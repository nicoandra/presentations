from typing import Optional
from context import ExecutionContext
from fastapi import FastAPI, Request 
from time import sleep
from database import Database
import logging

logging.config.fileConfig('logging.conf', disable_existing_loggers=False)


app = FastAPI()

database_instance = Database()

@app.middleware("http")
async def keep_context(request: Request, call_next):
    user_agent = request.headers.get('user-agent', 'Unkown')
    username = request.query_params.get('username', 'anonymous user')
    
    with ExecutionContext(user_agent=user_agent, username=username) as context:
        # Process the request within an execution context.
        response = await call_next(request)

    return response

@app.get("/")
def read_root():
    execution_context = ExecutionContext.current()
    return {"Hello": "World", "context": dict(execution_context)}


@app.get("/pretend-query/{string_to_match}")
def read_item(string_to_match: str, username: Optional[str] = "some-username"):
    # Note the context is not passed as parameter
    return database_instance.pretend_sql_query(string_to_match)
