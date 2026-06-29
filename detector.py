def analyze_transaction(transaction):
    """
    transaction is a dictionary containing:
    user_name
    amount
    location
    transaction_type
    """

    score = 0
    reasons = []

    amount = transaction["amount"]
    location = transaction["location"]
    txn_type = transaction["transaction_type"]

    # ---------- Amount ----------
    if amount > 300000:
        score += 60
        reasons.append("Very Large Amount")

    elif amount > 100000:
        score += 40
        reasons.append("Large Amount")

    elif amount > 50000:
        score += 20
        reasons.append("Moderate Amount")

    # ---------- Location ----------
    if location == "Russia":
        score += 25
        reasons.append("Suspicious Location")

    elif location == "North Korea":
        score += 40
        reasons.append("High Risk Location")

    # ---------- Transaction Type ----------
    if txn_type == "Wire Transfer":
        score += 20
        reasons.append("Wire Transfer")

    elif txn_type in ["NEFT", "IMPS"]:
        score += 10
        reasons.append(txn_type)

    elif txn_type in ["Debit Card", "Credit Card"]:
        score += 5

    # ---------- Final Status ----------
    if score >= 90:
        status = "CRITICAL"

    elif score >= 60:
        status = "HIGH"

    elif score >= 30:
        status = "MEDIUM"

    else:
        status = "SAFE"

    return {
        "risk_score": score,
        "status": status,
        "risk_reason": ", ".join(reasons),
        "is_flagged": 1 if status != "SAFE" else 0
    }