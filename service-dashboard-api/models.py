from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# --- Shared Models ---

class CustomerBase(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = "active"

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    title: str
    client_id: Optional[UUID] = None
    status: str = "new_requests" # new_requests, in_progress, review, completed
    priority: str = "normal" # normal, urgent
    due_date: Optional[datetime] = None
    tags: List[str] = []
    assigned_to: Optional[UUID] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Dashboard Stats ---
class DashboardStats(BaseModel):
    revenue: List[int] # Mock revenue data for chart
    total_revenue_amount: str
    active_orders: int
    new_customers: int
    pending_reviews: int
