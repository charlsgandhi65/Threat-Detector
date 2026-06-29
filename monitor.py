import sqlite3
import time
from detector import analyze_transaction

DATABASE_NAME = "database/transactions.db"


def monitor_transactions():

    print("Real-Time Threat Monitor Started...\n")

    while True:

        conn = sqlite3.connect(DATABASE_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Get all transactions that haven't been analyzed
        cursor.execute("""

            SELECT *
            FROM transactions
            WHERE risk_score = 0

        """)

        transactions = cursor.fetchall()

        for transaction in transactions:

            transaction_dict = dict(transaction)

            result = analyze_transaction(transaction_dict)

            # Update transaction
            cursor.execute("""

                UPDATE transactions

                SET

                    risk_score = ?,
                    status = ?,
                    risk_reason = ?,
                    is_flagged = ?

                WHERE id = ?

            """, (

                result["risk_score"],
                result["status"],
                result["risk_reason"],
                result["is_flagged"],
                transaction["id"]

            ))

            # Create alert only for HIGH or CRITICAL
            if result["status"] in ["HIGH", "CRITICAL"]:

                cursor.execute("""

                    INSERT INTO alerts
                    (transaction_id, severity, message)

                    VALUES (?, ?, ?)

                """, (

                    transaction["id"],
                    result["status"],
                    result["risk_reason"]

                ))

                print(f"🚨 ALERT -> Transaction {transaction['id']} | {result['status']}")

            else:

                print(f"✔ Transaction {transaction['id']} is {result['status']}")

        conn.commit()
        conn.close()

        time.sleep(2)


if __name__ == "__main__":

    monitor_transactions()