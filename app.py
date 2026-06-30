from pathlib import Path
import json
import sqlite3

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

app = Flask(
    __name__,
    static_folder=str(FRONTEND_DIST / "assets"),
    static_url_path="/assets"
)

CORS(app)

DATABASE_NAME = "database/transactions.db"


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def serve_frontend():
    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return send_from_directory(FRONTEND_DIST, "index.html")

    return jsonify({
        "message": "Frontend build not found. Run the frontend build first."
    })


# --------------------------------------------------------
# Frontend
# --------------------------------------------------------

@app.route("/")
@app.route("/<path:path>")
def home(path=""):

    if path.startswith("api/"):
        return jsonify({"message": "Not Found"}), 404

    return serve_frontend()


# --------------------------------------------------------
# Transactions API
# --------------------------------------------------------

@app.route("/api/transactions")
@app.route("/transactions")
def transactions():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""

        SELECT *

        FROM transactions

        ORDER BY id DESC

    """)

    data = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify(data)


# --------------------------------------------------------
# Alerts API
# --------------------------------------------------------

@app.route("/api/alerts")
@app.route("/alerts")
def alerts():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""

        SELECT *

        FROM alerts

        ORDER BY id DESC

    """)

    data = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return jsonify(data)


# --------------------------------------------------------
# Dashboard Stats API
# --------------------------------------------------------

@app.route("/api/stats")
@app.route("/stats")
def stats():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM transactions")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM transactions WHERE status='SAFE'")
    safe = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM transactions WHERE status='MEDIUM'")
    medium = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM transactions WHERE status='HIGH'")
    high = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM transactions WHERE status='CRITICAL'")
    critical = cursor.fetchone()[0]

    conn.close()

    return jsonify({

        "total": total,
        "safe": safe,
        "medium": medium,
        "high": high,
        "critical": critical

    })


# --------------------------------------------------------
# Incident Correlation API
# --------------------------------------------------------

@app.route("/api/incidents")
@app.route("/incidents")
def incidents():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""

        SELECT *

        FROM incidents

        ORDER BY id DESC

    """)

    rows = cursor.fetchall()

    data = []

    for row in rows:

        incident = dict(row)

        try:
            incident["timeline"] = json.loads(
                incident["timeline"]
            )
        except:
            incident["timeline"] = []

        data.append(incident)

    conn.close()

    return jsonify(data)


# --------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)