import sqlite3

DATABASE_NAME = "database/transactions.db"

def create_database():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL,
        amount REAL NOT NULL,
        location TEXT NOT NULL,
        transaction_type TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        risk_score INTEGER DEFAULT 0,
        status TEXT DEFAULT 'SAFE',
        risk_reason TEXT DEFAULT '',
        is_flagged INTEGER DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER,
        severity TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(transaction_id) REFERENCES transactions(id)
    )
    """)

    conn.commit()
    conn.close()

    print("✅ Database created successfully!")

if __name__ == "__main__":
    create_database()