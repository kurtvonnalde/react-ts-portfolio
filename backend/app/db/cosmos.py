import os
from azure.cosmos import CosmosClient

def get_container(name: str):
    endpoint = os.getenv("COSMOS_ENDPOINT")
    key = os.getenv("COSMOS_KEY")
    db_name = os.getenv("COSMOS_DATABASE", "aicopilotdb")

    if not endpoint or not key or not db_name:
        raise RuntimeError("Missing COSMOS_ENDPOINT / COSMOS_KEY / COSMOS_DATABASE")

    client = CosmosClient(endpoint, credential=key)
    db = client.get_database_client(db_name)
    return db.get_container_client(name)