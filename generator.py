import sqlite3
import random
import time

DATABASE_NAME = "database/transactions.db"

users = [
    "Rahul", "Priya", "Amit", "John", "Sara",
    "David", "Neha", "Arjun", "Riya", "Alex"
]

locations = [
    "India", "USA", "UK", "Russia",
    "China", "Germany", "Canada"
]

def generate_transaction():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    user = random.choice(users)
    amount = random.randint(500, 500000)
    location = random.choice(locations)

    cursor.execute("""
        INSERT INTO transactions(user_name, amount, location)
        VALUES (?, ?, ?)
    """, (user, amount, location))

    conn.commit()
    conn.close()

    print(f"Transaction Added -> {user} | ₹{amount} | {location}")

if __name__ == "__main__":
    while True:
        generate_transaction()
        time.sleep(3)