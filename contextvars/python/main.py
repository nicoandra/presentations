from typing import Optional
from context import ExecutionContext
from fastapi import FastAPI, Request 
from time import sleep
from database import Database

app = FastAPI()

database_instance = Database()

@app.middleware("http")
async def keep_context(request: Request, call_next):
    user_agent = request.headers.get('user-agent', 'Unkown')
    username = request.query_params.get('username', 'anonymous user')
    
    with ExecutionContext(user_agent=user_agent, username=username) as context:
        response = await call_next(request)

    return response

@app.get("/")
def read_root():
    execution_context = ExecutionContext.current()
    return {"Hello": "World", "context": dict(execution_context)}


@app.get("/pretend-query/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return database_instance.pretend_sql_query(item_id)
