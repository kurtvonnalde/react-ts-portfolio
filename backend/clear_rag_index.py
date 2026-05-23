"""Clear the portfolio RAG index."""

import os
from pathlib import Path
from dotenv import load_dotenv
from azure.search.documents.indexes import SearchIndexClient
from azure.core.credentials import AzureKeyCredential

# Load .env file
backend_dir = Path(__file__).resolve().parent
env_path = backend_dir / ".env"
load_dotenv(env_path)

# Get Azure Search credentials
search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
admin_key = os.getenv("AZURE_SEARCH_ADMIN_KEY")
index_name = os.getenv("AZURE_SEARCH_INDEX_NAME")

if not all([search_endpoint, admin_key, index_name]):
    print("❌ Missing Azure Search credentials in .env file")
    exit(1)

# Create client
client = SearchIndexClient(search_endpoint, AzureKeyCredential(admin_key))

try:
    # Delete the index
    client.delete_index(index_name)
    print(f"✅ Index '{index_name}' deleted successfully")
except Exception as e:
    print(f"❌ Error deleting index: {e}")

