from context import ExecutionContext

class Database:
    """
    Pretend this class performs database queries.
    Pretend you want
    """
    def pretend_sql_query(self, item_id_param: int):
        context = ExecutionContext.current()
        return { "context": dict(context), "item_id": item_id_param }


    def pretend_another_sql_query(self):
        context = ExecutionContext.current()
        return { "context": dict(context) }