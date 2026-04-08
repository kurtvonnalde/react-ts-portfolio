import os
from azure.cosmos import CosmosClient

def get_container(name: str):
    endpoint = os.getenv("COSMOS_ENDPOINT")
    key = os.getenv("COSMOS_KEY")
    db_name = os.getenv("COSMOS_DATABASE", "aicopilotdb")

    if not endpoint or not key:
        raise RuntimeError("Missing COSMOS_ENDPOINT or COSMOS_KEY env vars")

    client = CosmosClient(endpoint, credential=key)
    db = client.get_database_client(db_name)
    return db.get_container_client(name)