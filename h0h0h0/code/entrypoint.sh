#/bin/bash
FLASK_APP=flagService.py python -m flask run --host=localhost --port=1337 > /dev/null &
FLASK_APP=fetchAndPostService.py python -m flask run --host=0.0.0.0 --port=6426