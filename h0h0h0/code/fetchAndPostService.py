import os 
from flask import Flask, request
from urllib import request as urllibrequest

app = Flask(__name__)

@app.route("/", methods=['GET'])
def index():
    return '<br>\n'.join([
        "Fetch and Post running. This service helps to avoid censorship in the world.",
        "",
        "You can use this service to access a URL that is blocked to you.",
        "This is useful to avoid government restrictions and firewalls.",
        "",
        "Post a JSON to / a value:",
        "&nbsp;url: the URL to download",
        "",
        "For example, if you post {url :'http://ssense.com'} I'll download the source of the page and send it to you.",
        "",
        "Please don't try to hack this, it is written in Python, a super secure language that is also very performant.",
        "It is SOOOO performant that you can run multiple services in the same container, maybe listening in different ports ...",
        "",
        "Serving this file from " + os.path.realpath(__file__),
        "<!-- <a href=\"/the-easy-one\">If you really need a flag, click here</a>"
    ])

@app.route("/", methods=['POST'])
def post():
    try:
        url = request.get_json()['url']
        response = urllibrequest.urlopen(url)
        content = response.read()
        return {"url": url, "content": content.decode('utf-8')}
    except Exception as err:
        return {"url": url, "content": '{}'.format(err)}, 500


@app.route("/the-easy-one", methods=['GET'])
def indexf():
    return '<br>\n'.join([
       'EasyFlag?ThereIsNoSuchThing'
    ])
