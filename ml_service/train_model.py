import numpy as np
import joblib
from pymongo import MongoClient
from sklearn.ensemble import IsolationForest

# Connect to MongoDB
client = MongoClient("mongodb+srv://alertifyadmin:sa008fal@cluster0.u9fkn1q.mongodb.net/?appName=Cluster0")
db = client["alertify"]  # your DB name
events = db["events"]

# Fetch real data
data = []
for event in events.find():
    clicks = event.get("clicks", 0)
    scroll = event.get("scrollDepth", 0)
    rpm = event.get("requestsPerMinute", 0)

    # normalize
    data.append([
        clicks / 100,
        scroll / 100,
        rpm / 100
    ])

X_train = np.array(data)

print(f"Training on {len(X_train)} samples...")

# Train model
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(X_train)

# Save model
joblib.dump(model, "model.pkl")

print("Model trained and saved ✅")