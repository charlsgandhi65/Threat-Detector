from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE_NAME = "database/transactions.db"


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def home():
    return jsonify({
        "message": "Threat Detector API Running"
    })


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


if __name__ == "__main__":
    app.run(debug=True)