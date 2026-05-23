# RAG Document Management Guide

## Overview
Your portfolio AI Assistant now supports dynamic document management. You can upload your own documents in different categories (skills, experience, personal info) and the AI will learn from them.

## Setup Instructions

### Step 1: Clear Current Index
The current index contains placeholder data. Clear it first:

```bash
cd backend
python clear_rag_index.py
```

### Step 2: Download Template Files
Three template files have been created for you:

1. **Personal Info Template** (`backend/templates/personal_info_template.md`)
   - Basic information
   - About you
   - Key achievements
   - Interests & hobbies

2. **Skills Template** (`backend/templates/skills_template.md`)
   - Programming languages
   - Frontend/Backend technologies
   - Cloud & DevOps
   - AI & ML skills
   - Tools & platforms
   - Soft skills

3. **Experience Template** (`backend/templates/experience_template.md`)
   - Job positions with responsibilities
   - Key achievements
   - Technologies used
   - Education
   - Certifications

### Step 3: Fill in Your Information
1. Download the templates from `backend/templates/`
2. Fill in each template with your actual information
3. Save them as `.md` or `.txt` files

### Step 4: Upload Documents
You have two ways to upload:

#### Option A: Using the Frontend (Coming Soon)
Navigate to `/sources` page and use the upload interface.

#### Option B: Using Python Script
Create a `upload_documents.py` script in the backend folder:

```python
from app.core.search import SearchManager
from app.core.rag import RAGService

search_manager = SearchManager()

# First, create the index
search_manager.create_index()

# Then upload your documents
documents = [
    {
        "id": "personal_1",
        "title": "About Me",
        "category": "personal_info",
        "content": open("path/to/your/personal_info.md").read()
    },
    {
        "id": "skills_1",
        "title": "My Technical Skills",
        "category": "skills",
        "content": open("path/to/your/skills.md").read()
    },
    {
        "id": "exp_1",
        "title": "My Experience",
        "category": "experience",
        "content": open("path/to/your/experience.md").read()
    }
]

search_manager.upload_documents(documents)
print("✅ Documents uploaded successfully!")
```

### Step 5: View Indexed Sources
Visit `http://localhost:5174/sources` to see all indexed documents and manage them.

## API Endpoints

### Upload Document (Text)
```
POST /api/rag/index-text
Content-Type: application/json

{
  "title": "My Skills",
  "category": "skills",
  "content": "Your document content here..."
}
```

### Upload Document (File)
```
POST /api/rag/upload
Content-Type: multipart/form-data

title=My Skills&category=skills&file=<file>
```

### Get All Sources
```
GET /api/rag/sources
```

Response:
```json
{
  "total": 3,
  "sources": [
    {
      "id": "doc_id",
      "title": "About Me",
      "category": "personal_info",
      "content_preview": "..."
    }
  ]
}
```

### Delete a Source
```
DELETE /api/rag/sources/{doc_id}
```

### Query the RAG
```
POST /api/rag/query
Content-Type: application/json

{
  "query": "What are your main skills?"
}
```

Response:
```json
{
  "answer": "Based on your documents, ...",
  "sources": [
    {
      "title": "My Technical Skills",
      "category": "skills",
      "score": 0.95
    }
  ],
  "retrieved_count": 1
}
```

## Document Categories

Use these categories when uploading:
- `personal_info` - Personal background, about you
- `skills` - Technical and soft skills
- `experience` - Work experience, positions
- `education` - Education, degrees, certifications
- `projects` - Project details and descriptions

## Tips for Best Results

1. **Be Specific**: Include details in your documents
2. **Use Headings**: Structure your content with headers
3. **Include Context**: Write in a conversational way
4. **Update Regularly**: Keep your information current
5. **Categorize Well**: Use appropriate categories for each document

## Troubleshooting

### Documents not showing up?
- Check if the index was created: `GET /api/rag/health`
- Verify document structure has required fields: title, category, content
- Check backend logs for errors

### AI not finding information?
- Ensure your documents are uploaded to the correct category
- Check that content is searchable (not just images)
- Try specific keywords that appear in your documents

### Upload failing?
- Check file encoding (must be UTF-8)
- Verify file size is reasonable (< 10MB)
- Check backend is running on port 8000
