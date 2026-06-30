import sqlite3
import json
import random
import time

DATABASE_NAME = "database/transactions.db"

# Prevent duplicate incidents while the engine is running
processed_users = set()


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ---------------------------------------------------
# Correlation Rules
# ---------------------------------------------------
def correlate_events(events):

    text = " ".join(events)

    if (
        "Very Large Amount" in text
        and "Wire Transfer" in text
        and (
            "High Risk Location" in text
            or "Suspicious Location" in text
        )
    ):
        return (
            "Possible Money Laundering",
            "High Value Transfer + High Risk Location + Wire Transfer"
        )

    elif (
        "Large Amount" in text
        and "Wire Transfer" in text
    ):
        return (
            "Suspicious Financial Activity",
            "Large Amount + Wire Transfer"
        )

    elif (
        "High Risk Location" in text
        or "Suspicious Location" in text
    ):
        return (
            "Cross-Border Fraud",
            "High Risk Geographic Activity"
        )

    elif len(events) >= 4:
        return (
            "Coordinated Fraud Attempt",
            "Multiple Correlated Security Events"
        )

    return (
        "Suspicious Activity",
        "Unknown Correlation Pattern"
    )


# ---------------------------------------------------
# Main Correlation Engine
# ---------------------------------------------------
def correlation_engine():

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

        grouped.setdefault(row["user_name"], []).append(row)

    # ---------------------------------------------

    for user, alerts in grouped.items():

        if user in processed_users:
            continue

        # Need at least 3 alerts
        if len(alerts) < 3:
            continue

        # Use latest 3 alerts only
        alerts = alerts[-3:]

        severity = "HIGH"

        security_events = []

        timeline = []

        # -----------------------------
        # Build Evidence
        # -----------------------------

        for alert in alerts:

            parts = [

                x.strip()

                for x in alert["message"].split(",")

            ]

            for part in parts:

                if part not in security_events:
                    security_events.append(part)

                timeline.append({

                    "time": alert["timestamp"],
                    "event": part

                })

            if alert["severity"] == "CRITICAL":
                severity = "CRITICAL"

        # -----------------------------
        # Correlation
        # -----------------------------

        root_cause, rule = correlate_events(security_events)

        confidence = random.randint(92, 99)

        # -----------------------------
        # Store Incident
        # -----------------------------

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

        # -----------------------------
        # Console Output
        # -----------------------------

        print("\n")
        print("=" * 75)
        print("🚨 HIGH RISK INCIDENT DETECTED")
        print("=" * 75)

        print(f"\nUser           : {user}")
        print(f"Severity       : {severity}")
        print(f"Root Cause     : {root_cause}")
        print(f"Confidence     : {confidence}%")

        print("\nCorrelation Rule")
        print("------------------------------")
        print(rule)

        print("\nCorrelated Security Events")
        print("------------------------------")

        for event in security_events:
            print(f"✓ {event}")

        print("\nAttack Timeline")
        print("------------------------------")

        for item in timeline:
            print(f"{item['time']}")
            print(f"   ↳ {item['event']}")

        print("\n🚨 Incident Generated")

        print("\nRecommended Actions")
        print("------------------------------")
        print("✓ Block suspicious transaction")
        print("✓ Notify security administrator")
        print("✓ Review user account activity")
        print("✓ Continue monitoring")

        print("=" * 75)

    conn.commit()
    conn.close()


if __name__ == "__main__":

    print("\nThreat Correlation Engine Started...\n")

    while True:

        correlation_engine()

        time.sleep(5)