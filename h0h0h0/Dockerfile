FROM python:latest

RUN pip install gunicorn Flask

COPY ./code /code

WORKDIR /code
ENTRYPOINT ./entrypoint.sh