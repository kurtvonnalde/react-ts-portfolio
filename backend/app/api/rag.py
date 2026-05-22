"""RAG API endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.rag import RAGService

router = APIRouter(tags=["rag"])


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    answer: str
    sources: list
    retrieved_count: int


@router.post("/api/rag/query", response_model=QueryResponse)
async def query_portfolio(request: QueryRequest):
    """
    Query the portfolio RAG system.
    
    Args:
        request: Contains the user's query
        
    Returns:
        QueryResponse with answer, sources, and metadata
    """
    if not request.query or len(request.query.strip()) == 0:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        rag_service = RAGService()
        result = rag_service.query(request.query)
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.post("/api/rag/index")
async def index_portfolio(documents: list):
    """
    Index portfolio documents.
    
    Args:
        documents: List of documents to index
        
    Returns:
        Success status
    """
    try:
        rag_service = RAGService()
        success = rag_service.search_manager.upload_documents(documents)
        
        return {
            "success": success,
            "message": "Documents indexed successfully" if success else "Failed to index documents"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing documents: {str(e)}")


@router.get("/api/rag/health")
async def rag_health():
    """Health check for RAG service."""
    return {"status": "ok", "service": "RAG"}
