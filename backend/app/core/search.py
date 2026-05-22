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


class SearchManager:
    """Manages Azure AI Search operations for RAG."""

    def __init__(self):
        self.endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
        self.admin_key = os.getenv("AZURE_SEARCH_ADMIN_KEY")
        self.index_name = os.getenv("AZURE_SEARCH_INDEX_NAME", "portfolio-about-index")
        
        self.credential = AzureKeyCredential(self.admin_key)
        self.index_client = SearchIndexClient(endpoint=self.endpoint, credential=self.credential)
        self.search_client = SearchClient(endpoint=self.endpoint, index_name=self.index_name, credential=self.credential)

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
                vector_search_dimensions=1536,
                vector_search_profile_name="myHnswProfile",
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

    def upload_documents(self, documents):
        """Upload documents to the search index."""
        try:
            result = self.search_client.upload_documents(documents=documents)
            print(f"✅ {len(documents)} documents uploaded successfully")
            return True
        except Exception as e:
            print(f"❌ Error uploading documents: {e}")
            return False

    def search(self, query: str, top: int = 3):
        """Search for relevant documents."""
        try:
            results = self.search_client.search(
                search_text=query,
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
