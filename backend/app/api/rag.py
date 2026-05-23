"""RAG API endpoints."""

from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from app.core.rag import RAGService
import os

router = APIRouter(tags=["rag"])


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    answer: str
    sources: list
    retrieved_count: int


class DocumentUploadRequest(BaseModel):
    title: str
    content: str
    category: str  # skills, experience, personal_info, etc.


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


@router.post("/api/rag/upload")
async def upload_document(
    title: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Upload and index a document for the RAG system.
    
    Args:
        title: Document title
        category: Document category (skills, experience, personal_info, etc.)
        file: File to upload (txt or md)
        
    Returns:
        Success status with document info
    """
    try:
        # Read file content
        content = await file.read()
        text_content = content.decode('utf-8')
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Create document
        doc = {
            "title": title,
            "category": category,
            "content": text_content
        }
        
        # Index document
        rag_service = RAGService()
        success = rag_service.search_manager.upload_documents([doc])
        
        return {
            "success": success,
            "message": f"Document '{title}' uploaded and indexed successfully",
            "document": {
                "title": title,
                "category": category,
                "size": len(text_content)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")


@router.post("/api/rag/index-text")
async def index_text_document(request: DocumentUploadRequest):
    """
    Index a text document directly.
    
    Args:
        request: Contains title, content, and category
        
    Returns:
        Success status
    """
    try:
        if not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")
        
        doc = {
            "title": request.title,
            "category": request.category,
            "content": request.content
        }
        
        rag_service = RAGService()
        success = rag_service.search_manager.upload_documents([doc])
        
        return {
            "success": success,
            "message": f"Document '{request.title}' indexed successfully",
            "document": {
                "title": request.title,
                "category": request.category,
                "size": len(request.content)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error indexing document: {str(e)}")


@router.get("/api/rag/sources")
async def get_indexed_sources():
    """
    Get all indexed sources/documents.
    
    Returns:
        List of indexed documents with metadata
    """
    try:
        rag_service = RAGService()
        sources = rag_service.search_manager.get_all_documents()
        
        return {
            "total": len(sources),
            "sources": sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving sources: {str(e)}")


@router.delete("/api/rag/sources/{doc_id}")
async def delete_source(doc_id: str):
    """
    Delete an indexed document.
    
    Args:
        doc_id: ID of document to delete
        
    Returns:
        Success status
    """
    try:
        rag_service = RAGService()
        success = rag_service.search_manager.delete_document(doc_id)
        
        return {
            "success": success,
            "message": f"Document deleted successfully" if success else "Failed to delete document"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")


@router.get("/api/rag/health")
async def rag_health():
    """Health check for RAG service."""
    try:
        rag_service = RAGService()
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/rag/init")
async def initialize_rag():
    """Initialize/create the RAG index."""
    try:
        rag_service = RAGService()
        success = rag_service.search_manager.create_index()
        
        return {
            "success": success,
            "message": "Index initialized successfully" if success else "Failed to initialize index"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing index: {str(e)}")
    return {"status": "ok", "service": "RAG"}
