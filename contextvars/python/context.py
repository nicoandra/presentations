from contextvars import ContextVar, Token
from typing import Callable, ClassVar, Optional, Union
from datetime import datetime, timezone
from uuid import uuid4
from time import perf_counter

class ExecutionContext():
    _contextvar: ClassVar[ContextVar] = ContextVar("ExecutionContext")

    def __init__(self, user_agent="Unknown", username="Unknown"):
        self.user_agent = user_agent
        self.started_at = datetime.now(timezone.utc)
        self.username = username
        self.request_id = uuid4()
        self.perf_timer_start = perf_counter()

    def __enter__(self) -> "ExecutionContext":
        self.token = ExecutionContext._contextvar.set(self)
        return self

    def __exit__(self, type_, value, traceback) -> None:
        ExecutionContext._contextvar.reset(self.token)

    @staticmethod
    def current() -> "ExecutionContext":
        """Returns the current ExecutionContext or a clean one if there's no current context."""
        return ExecutionContext._contextvar.get(ExecutionContext())

    def __iter__(self):
        """ Magic method to create dictionnaries """
        yield 'user_agent', self.user_agent
        yield 'started_at', str(self.started_at)
        yield 'username', self.username
        yield 'request_id', str(self.request_id)
        yield 'time_elapsed', perf_counter() - self.perf_timer_start
