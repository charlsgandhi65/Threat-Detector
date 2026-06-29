from flask import Flask, render_template

from database import init_db

app = Flask(__name__)


@app.before_request
def ensure_database():
    init_db()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
