from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI()

# Define input structure
class UserData(BaseModel):
    clicks: int
    scroll: int
    rpm: int

# Generate realistic normal user data
np.random.seed(42)

clicks = np.random.normal(loc=30, scale=10, size=200)
scroll = np.random.normal(loc=50, scale=15, size=200)
rpm = np.random.normal(loc=20, scale=8, size=200)

X_train = np.column_stack((clicks, scroll, rpm))

model = IsolationForest(contamination=0.2)
model.fit(X_train)

@app.get("/")
def home():
    return {"message": "ML Service Running"}

@app.post("/predict")
def predict(data: UserData):
    input_data = np.array([[data.clicks, data.scroll, data.rpm]])

    prediction = model.predict(input_data)
    score = model.decision_function(input_data)

    result = "anomaly" if prediction[0] == -1 else "normal"

    return {
        "result": result,
        "score": float(score[0])
    }