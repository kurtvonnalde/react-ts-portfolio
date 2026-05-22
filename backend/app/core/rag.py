"""RAG service for handling queries and generating responses."""

import os
from openai import AzureOpenAI
from app.core.search import SearchManager


class RAGService:
    """Handles RAG queries using Azure OpenAI and AI Search."""

    def __init__(self):
        self.client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        self.deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
        self.search_manager = SearchManager()

    def query(self, user_query: str) -> dict:
        """
        Process a user query and return a RAG response.
        
        Args:
            user_query: The user's question about the portfolio
            
        Returns:
            Dictionary with answer, sources, and metadata
        """
        # Step 1: Retrieve relevant documents
        retrieved_docs = self.search_manager.search(user_query, top=3)
        
        if not retrieved_docs:
            return {
                "answer": "I couldn't find relevant information in the portfolio database.",
                "sources": [],
                "retrieved_count": 0
            }

        # Step 2: Prepare context from retrieved documents
        context = self._prepare_context(retrieved_docs)
        
        # Step 3: Generate answer using OpenAI with context
        answer = self._generate_answer(user_query, context)
        
        return {
            "answer": answer,
            "sources": [
                {
                    "title": doc["title"],
                    "category": doc["category"],
                    "score": doc["score"]
                }
                for doc in retrieved_docs
            ],
            "retrieved_count": len(retrieved_docs)
        }

    def _prepare_context(self, documents: list) -> str:
        """Format retrieved documents into context for the LLM."""
        context = "Based on the following information about the portfolio:\n\n"
        
        for i, doc in enumerate(documents, 1):
            context += f"[Source {i}: {doc['title']} ({doc['category']})]\n"
            context += f"{doc['content']}\n\n"
        
        return context

    def _generate_answer(self, query: str, context: str) -> str:
        """Generate an answer using Azure OpenAI."""
        system_prompt = """You are a helpful AI assistant that answers questions about a person's portfolio, 
        skills, and projects. Use the provided context to answer questions accurately and personally. 
        If the information isn't in the provided context, say so. Be conversational and friendly."""
        
        try:
            response = self.client.chat.completions.create(
                model=self.deployment_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
                ],
                temperature=0.7,
                max_completion_tokens=500
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ Error generating answer: {e}")
            return f"I encountered an error while processing your question: {str(e)}"
