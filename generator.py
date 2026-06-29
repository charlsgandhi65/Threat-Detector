print("===== NEW GENERATOR RUNNING =====")
import sqlite3
import random
import time

DATABASE_NAME = "database/transactions.db"

users = [
    "Rahul Sharma",
    "Priya Patel",
    "Amit Verma",
    "John Smith",
    "Sara Khan",
    "David Lee",
    "Neha Joshi",
    "Arjun Mehta",
    "Riya Shah",
    "Alex Brown"
]

normal_locations = [
    "India",
    "USA",
    "UK",
    "Canada",
    "Germany"
]

suspicious_locations = [
    "Russia",
    "North Korea"
]

transaction_types = [
    "UPI",
    "Debit Card",
    "Credit Card",
    "NEFT",
    "IMPS",
    "Wire Transfer"
]


def generate_transaction():

    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    user = random.choice(users)
    chance = random.randint(1, 100)

    # 80% Normal Transactions
    if chance <= 80:

        amount = random.randint(100, 50000)
        location = random.choice(normal_locations)
        transaction_type = random.choice(transaction_types[:5])

    # 15% Suspicious Transactions
    elif chance <= 95:

        amount = random.randint(100001, 300000)
        location = random.choice(normal_locations + suspicious_locations)
        transaction_type = random.choice(transaction_types)

    # 5% Critical Transactions
    else:

        amount = random.randint(300001, 500000)
        location = random.choice(suspicious_locations)
        transaction_type = "Wire Transfer"

    cursor.execute("""

        INSERT INTO transactions
        (user_name, amount, location, transaction_type)

        VALUES (?, ?, ?, ?)

    """, (user, amount, location, transaction_type))

    conn.commit()
    conn.close()

    print(f"{user} | ₹{amount} | {location} | {transaction_type}")


if __name__ == "__main__":

    while True:

        generate_transaction()
        time.sleep(3)
