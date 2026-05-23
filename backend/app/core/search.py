"""Azure AI Search client for RAG operations."""

import os
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SearchField,
    SearchFieldDataType,
    SimpleField,
    SearchableField,
    VectorSearch,
    HnswAlgorithmConfiguration,
    VectorSearchProfile,
    SemanticConfiguration,
    SemanticSearch,
    SemanticField,
    SemanticPrioritizedFields,
)
from azure.core.credentials import AzureKeyCredential
from openai import AzureOpenAI


class SearchManager:
    """Manages Azure AI Search operations for RAG."""

    def __init__(self):
        self.endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
        self.admin_key = os.getenv("AZURE_SEARCH_ADMIN_KEY")
        self.index_name = os.getenv("AZURE_SEARCH_INDEX_NAME", "portfolio-about-index")
        
        self.credential = AzureKeyCredential(self.admin_key)
        self.index_client = SearchIndexClient(endpoint=self.endpoint, credential=self.credential)
        self.search_client = SearchClient(endpoint=self.endpoint, index_name=self.index_name, credential=self.credential)
        
        # Initialize OpenAI client for embeddings
        self.openai_client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.embedding_model = os.getenv("AZURE_EMBEDDING_DEPLOYMENT", "text-embedding-3-small")
        # text-embedding-3-small = 1536 dims, text-embedding-3-large = 3072 dims
        self.embedding_dimensions = 3072 if "large" in self.embedding_model.lower() else 1536

    def create_index(self):
        """Create or update the search index."""
        # Define vector search configuration
        vector_search = VectorSearch(
            algorithms=[HnswAlgorithmConfiguration(name="myHnsw")],
            profiles=[VectorSearchProfile(name="myHnswProfile", algorithm_configuration_name="myHnsw")],
        )

        # Define semantic search configuration
        semantic_search = SemanticSearch(
            configurations=[
                SemanticConfiguration(
                    name="default",
                    prioritized_fields=SemanticPrioritizedFields(
                        content_fields=[SemanticField(field_name="content")],
                        keywords_fields=[SemanticField(field_name="keywords")],
                    ),
                )
            ]
        )

        # Define index fields
        fields = [
            SimpleField(name="id", type=SearchFieldDataType.String, key=True),
            SearchableField(name="title", type=SearchFieldDataType.String),
            SearchableField(name="content", type=SearchFieldDataType.String),
            SearchableField(name="category", type=SearchFieldDataType.String),
            SearchableField(name="keywords", type=SearchFieldDataType.String),
            SearchField(
                name="content_vector",
                type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                searchable=True,
                vector_search_dimensions=self.embedding_dimensions,
                vector_search_profile_name="myHnswProfile",
                retrievable=True,
                # Make it nullable so documents can be indexed without embeddings
            ),
        ]

        # Create index
        index = SearchIndex(
            name=self.index_name,
            fields=fields,
            vector_search=vector_search,
            semantic_search=semantic_search,
        )

        try:
            result = self.index_client.create_or_update_index(index)
            print(f"✅ Index created or updated: {result.name}")
            return True
        except Exception as e:
            print(f"❌ Error creating index: {e}")
            return False

    def _generate_embedding(self, text: str) -> list:
        """Generate embedding for text using Azure OpenAI."""
        try:
            response = self.openai_client.embeddings.create(
                input=text,
                model=self.embedding_model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"⚠️  Warning: Could not generate embedding: {e}")
            # Return empty list - will do keyword search only
            return []

    def upload_documents(self, documents):
        """Upload documents to the search index with embeddings."""
        try:
            # Try to create index if it doesn't exist
            try:
                self.index_client.get_index(self.index_name)
            except:
                print(f"Index not found, creating '{self.index_name}'...")
                self.create_index()
            
            # Generate embeddings and unique IDs for each document
            docs_with_embeddings = []
            for i, doc in enumerate(documents):
                # Generate embedding from content
                embedding = self._generate_embedding(doc.get("content", ""))
                
                # Create document with embedding (can be None if embedding failed)
                doc_with_embedding = {
                    "id": doc.get("id", f"doc_{i}_{hash(doc.get('title', '')) % 10000}"),
                    "title": doc.get("title", ""),
                    "content": doc.get("content", ""),
                    "category": doc.get("category", ""),
                    "keywords": doc.get("category", ""),
                    "content_vector": embedding if embedding else None  # None if embedding failed
                }
                docs_with_embeddings.append(doc_with_embedding)
            
            result = self.search_client.upload_documents(documents=docs_with_embeddings)
            print(f"✅ {len(documents)} documents uploaded successfully")
            if any(not doc["content_vector"] for doc in docs_with_embeddings):
                print("⚠️  Some documents were indexed without embeddings (will use keyword search only)")
            else:
                print("✅ All documents indexed with embeddings (vector + keyword search)")
            return True
        except Exception as e:
            print(f"❌ Error uploading documents: {e}")
            return False

    def search(self, query: str, top: int = 3):
        """Search for relevant documents."""
        try:
            # Generate embedding for query
            query_embedding = self._generate_embedding(query)
            
            # If embedding generation failed, fall back to keyword search
            if not query_embedding:
                print("⚠️  Using keyword-only search (no embeddings available)")
                results = self.search_client.search(
                    search_text=query,
                    top=top,
                    include_total_count=True
                )
            else:
                # Use vector search with embeddings
                results = self.search_client.search(
                    search_text=query,
                    vector_queries=[{
                        "kind": "vector",
                        "vector": query_embedding,
                        "fields": "content_vector",
                        "k": top
                    }],
                    top=top,
                    include_total_count=True
                )
            
            documents = []
            for result in results:
                documents.append({
                    "id": result["id"],
                    "title": result.get("title", ""),
                    "content": result.get("content", ""),
                    "category": result.get("category", ""),
                    "score": result["@search.score"]
                })
            
            return documents
        except Exception as e:
            print(f"❌ Error searching: {e}")
            return []

    def get_all_documents(self):
        """Get all indexed documents."""
        try:
            # Check if index exists
            try:
                self.index_client.get_index(self.index_name)
            except:
                print(f"Index '{self.index_name}' does not exist yet")
                return []
            
            # Use semantic search with broad query to get all documents
            results = self.search_client.search(
                search_text="*",
                include_total_count=True,
                select=["id", "title", "category", "content"]
            )
            
            documents = []
            for result in results:
                content = result.get("content", "")
                content_preview = content[:200] + "..." if len(content) > 200 else content
                
                documents.append({
                    "id": result["id"],
                    "title": result.get("title", ""),
                    "category": result.get("category", ""),
                    "content_preview": content_preview
                })
            
            return documents
        except Exception as e:
            print(f"❌ Error getting documents: {e}")
            return []

    def delete_document(self, doc_id: str):
        """Delete a document from the index."""
        try:
            self.search_client.delete_documents(documents=[{"id": doc_id}])
            print(f"✅ Document {doc_id} deleted successfully")
            return True
        except Exception as e:
            print(f"❌ Error deleting document: {e}")
            return False
