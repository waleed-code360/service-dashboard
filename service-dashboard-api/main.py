from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from database import supabase
from models import Customer, CustomerCreate, Order, OrderCreate, DashboardStats

app = FastAPI()

# CORS config allowing frontend access
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.18.146:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Service Dashboard API is running"}

# --- Dashboard ---
@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    # In a real app, we would query DB for these. For now, we mock some, fetch some.
    
    # Example: Count active orders
    try:
        response = supabase.table("orders").select("id", count="exact").eq("status", "in_progress").execute()
        active_count = response.count if response.count is not None else 2 # Fallback to mock if DB empty
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
    # Returns all orders. Frontend groups them by status columns.
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
    # Receives {"status": "completed"} etc.
    response = supabase.table("orders").update(status_update).eq("id", str(order_id)).execute()
    if not response.data:
         raise HTTPException(status_code=404, detail="Order not found")
    return response.data[0]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
