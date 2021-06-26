from context import ExecutionContext
import json
import re
from logging import getLogger, INFO

logger = getLogger(__name__)
class Database:
    """
    Pretend this class performs database queries.
    Pretend you want
    """
    def pretend_sql_query(self, string_to_match: str):
        context = ExecutionContext.current()
        with open('/sample-data/montreal.json', encoding='utf-8-sig') as file:
            contents = file.read()
            logger.info(f"File read: %s", json.dumps(dict(context)))
            data = json.loads(contents)
            logger.info(f"File decoded: %s", json.dumps(dict(context)))

        results = [x 
            for x in data 
            if x.get('Title') and re.search(re.escape(string_to_match), x.get('Title'), re.IGNORECASE)
        ]
        logger.info(f"Results filtered: %s", json.dumps(dict(context)))
        return results

