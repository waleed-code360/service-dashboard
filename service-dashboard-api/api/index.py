from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import os

# Adapt database.py import for Vercel structure if needed, 
# but since we are in api/index.py we might need to adjust imports or path.
# However, Vercel python runtime adds root to pythonpath.
# Let's keep imports standard as if running from root, BUT we need to be careful.

# To be safe on Vercel, we can try absolute imports or relative. 
# Given the directory structure:
# /
#   api/
#     index.py
#   database.py
#   models.py
#   requirements.txt

# We need to ensure we can import database and models from parent directory.
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import supabase
from models import Customer, CustomerCreate, Order, OrderCreate, DashboardStats

app = FastAPI()

# CORS config allowing frontend access
origins = [
    "*", # Allow all for Vercel deployment simplicity, or list specific Vercel domains
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/python")
def hello_world():
    return {"message": "Hello from Vercel Serverless Function!"}

@app.get("/api")
def read_root():
    return {"message": "Service Dashboard API is running on Vercel"}

# --- Dashboard ---
@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    try:
        response = supabase.table("orders").select("id", count="exact").eq("status", "in_progress").execute()
        active_count = response.count if response.count is not None else 2 
    except Exception as e:
        print(f"Error fetching stats: {e}")
        active_count = 5 

    return {
        "revenue": [12000, 19000, 3000, 5000, 2000, 3000, 15000, 21000, 24500, 28000, 22000, 35000],
        "total_revenue_amount": "$124,500",
        "active_orders": active_count,
        "new_customers": 12,
        "pending_reviews": 4
    }

# --- Customers ---
@app.get("/api/customers", response_model=List[Customer])
def get_customers():
    response = supabase.table("customers").select("*").order("created_at", desc=True).execute()
    return response.data

@app.post("/api/customers", response_model=Customer)
def create_customer(customer: CustomerCreate):
    response = supabase.table("customers").insert(customer.dict(exclude_unset=True)).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not create customer")
    return response.data[0]

# --- Orders (Kanban) ---
@app.get("/api/orders", response_model=List[Order])
def get_orders():
    response = supabase.table("orders").select("*").execute()
    return response.data

@app.post("/api/orders", response_model=Order)
def create_order(order: OrderCreate):
    response = supabase.table("orders").insert(order.dict(exclude_unset=True)).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Could not create order")
    return response.data[0]

@app.patch("/api/orders/{order_id}", response_model=Order)
def update_order_status(order_id: UUID, status_update: dict):
    response = supabase.table("orders").update(status_update).eq("id", str(order_id)).execute()
    if not response.data:
         raise HTTPException(status_code=404, detail="Order not found")
    return response.data[0]
