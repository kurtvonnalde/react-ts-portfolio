"""Setup script to initialize RAG index with portfolio content."""

import os
import uuid
from dotenv import load_dotenv
from openai import AzureOpenAI
from app.core.search import SearchManager

load_dotenv()


def generate_embeddings(text: str) -> list:
    """Generate embeddings using Azure OpenAI."""
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"❌ Error generating embeddings: {e}")
        return []


def setup_portfolio_index():
    """Set up the portfolio index with sample content."""
    
    print("🚀 Setting up RAG index for portfolio...")
    
    # Initialize search manager
    search_manager = SearchManager()
    
    # Create index
    print("\n📋 Creating search index...")
    search_manager.create_index()
    
    # Sample portfolio content
    portfolio_content = [
        {
            "title": "About Me - Overview",
            "category": "about",
            "content": """I am a passionate full-stack developer with expertise in Python, TypeScript, React, and Azure cloud technologies. 
            I have 5+ years of experience building scalable web applications and AI-powered solutions. 
            I specialize in creating modern, responsive user interfaces combined with robust backend services.""",
            "keywords": "developer, full-stack, Python, TypeScript, React, Azure"
        },
        {
            "title": "Technical Skills",
            "category": "skills",
            "content": """My technical stack includes:
            - Frontend: React, TypeScript, Vite, CSS3, TailwindCSS
            - Backend: Python, FastAPI, Node.js, Express
            - Cloud: Azure (App Service, Functions, Cosmos DB, AI Search)
            - Databases: Cosmos DB, SQL, MongoDB
            - AI/ML: Azure OpenAI, LLM Integration, RAG Systems
            - DevOps: Docker, GitHub Actions, Azure DevOps""",
            "keywords": "React, Python, FastAPI, Azure, Docker, TypeScript"
        },
        {
            "title": "Experience",
            "category": "experience",
            "content": """I have worked on various projects including:
            - Building AI-powered portfolio websites
            - Developing RESTful APIs with FastAPI
            - Creating responsive React applications
            - Implementing RAG systems for AI assistants
            - Managing cloud infrastructure on Azure
            - Leading development teams and mentoring junior developers""",
            "keywords": "experience, projects, development, leadership"
        },
        {
            "title": "Portfolio Projects",
            "category": "projects",
            "content": """Notable projects include:
            1. AI Portfolio Website - A full-stack web application with integrated RAG system for answering portfolio inquiries
            2. Cloud Management Dashboard - Azure resource monitoring and management tool
            3. Real-time Chat Application - WebSocket-based chat with authentication
            4. Data Analysis Platform - Processing and visualization of large datasets""",
            "keywords": "projects, portfolio, applications, development"
        },
        {
            "title": "Education & Certifications",
            "category": "education",
            "content": """I hold certifications in:
            - Microsoft Azure Fundamentals (AZ-900)
            - Azure Developer Associate (AZ-204)
            - AWS Solutions Architect Associate
            I continuously learn and stay updated with the latest technologies through courses, workshops, and hands-on practice.""",
            "keywords": "education, certifications, Azure, AWS, learning"
        }
    ]
    
    # Generate embeddings and prepare documents for upload
    print("\n🔍 Generating embeddings...")
    documents = []
    
    for item in portfolio_content:
        # Generate embeddings for the content
        embedding = generate_embeddings(item["content"])
        
        document = {
            "id": str(uuid.uuid4()),
            "title": item["title"],
            "content": item["content"],
            "category": item["category"],
            "keywords": item["keywords"],
            "content_vector": embedding
        }
        documents.append(document)
        print(f"  ✓ Embedded: {item['title']}")
    
    # Upload documents to index
    print("\n📤 Uploading documents to search index...")
    search_manager.upload_documents(documents)
    
    print("\n✅ RAG index setup complete!")
    print(f"   - Index name: {search_manager.index_name}")
    print(f"   - Documents uploaded: {len(documents)}")
    print("\n💡 The RAG system is now ready to answer questions about the portfolio!")


if __name__ == "__main__":
    setup_portfolio_index()
