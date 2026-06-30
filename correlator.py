import sqlite3
import json
import random
import time

DATABASE_NAME = "database/transactions.db"

# Keeps track of processed incidents while the program is running
processed_users = set()


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def determine_root_cause(reasons):

    reason_text = " ".join(reasons)

    if "High Risk Location" in reason_text and "Wire Transfer" in reason_text:
        return "Possible Money Laundering"

    elif "Large Amount" in reason_text and "Wire Transfer" in reason_text:
        return "Suspicious Financial Activity"

    elif "Large Amount" in reason_text:
        return "High Value Suspicious Transaction"

    else:
        return "Coordinated Fraud Attempt"


def correlate_events():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""

    SELECT
        t.user_name,
        t.timestamp,
        a.message,
        a.severity

    FROM alerts a

    JOIN transactions t

    ON a.transaction_id = t.id

    ORDER BY t.timestamp

    """)

    rows = cursor.fetchall()

    grouped = {}

    for row in rows:

        user = row["user_name"]

        if user not in grouped:
            grouped[user] = []

        grouped[user].append(row)

    for user, events in grouped.items():

        # Skip users already processed
        if user in processed_users:
            continue

        # Need at least 3 alerts to create one incident
        if len(events) < 3:
            continue

        severity = "HIGH"

        timeline = []

        reasons = []

        for event in events:

            timeline.append(
                f"{event['timestamp']} - {event['message']}"
            )

            reasons.append(event["message"])

            if event["severity"] == "CRITICAL":
                severity = "CRITICAL"

        root_cause = determine_root_cause(reasons)

        confidence = random.randint(90, 99)

        cursor.execute("""

        INSERT INTO incidents
        (
            user_name,
            severity,
            root_cause,
            confidence,
            timeline
        )

        VALUES (?, ?, ?, ?, ?)

        """, (

            user,
            severity,
            root_cause,
            confidence,
            json.dumps(timeline)

        ))

        processed_users.add(user)

        print(f"\n🚨 INCIDENT CREATED")
        print(f"User       : {user}")
        print(f"Severity   : {severity}")
        print(f"Root Cause : {root_cause}")
        print(f"Confidence : {confidence}%")
        print("-" * 50)

    conn.commit()
    conn.close()


if __name__ == "__main__":

    print("\nThreat Correlation Engine Started...\n")

    while True:

        correlate_events()

        time.sleep(5)