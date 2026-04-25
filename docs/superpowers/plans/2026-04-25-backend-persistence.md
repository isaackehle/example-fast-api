# Backend Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the in-memory data storage in the FastAPI backend with a persistent PostgreSQL database.

**Architecture:** Implement a data access layer using SQLModel. Transition the `Order` model to a database table. Use a dependency-injected session manager to handle database connections per request.

**Tech Stack:** FastAPI, SQLModel (SQLAlchemy + Pydantic), PostgreSQL, Alembic.

---

## File Structure

- Create: `backend/database.py` - Database connection and session management.
- Modify: `backend/models/orders.py` - Convert `Order` to a SQLModel table.
- Modify: `backend/routers/orders.py` - Update endpoints to use DB sessions.
- Modify: `backend/main.py` - Initialize database on startup.
- Modify: `backend/pyproject.toml` - Add dependencies (`sqlmodel`, `psycopg2-binary`).
- Create: `alembic.ini` - Migration configuration.
- Create: `backend/migrations/` - Migration scripts folder.

---

## Tasks

### Task 1: Database Foundation

**Files:**

- Modify: `backend/pyproject.toml`
- Create: `backend/database.py`

- [ ] **Step 1: Add dependencies**
  Run: `cd backend && pip install sqlmodel psycopg2-binary`
  (Note: Update `pyproject.toml` manually or via `uv add` if using uv)
  Expected: Dependencies installed.

- [ ] **Step 2: Implement database connection**
  Create `backend/database.py`:

  ```python
  from sqlmodel import create_engine, Session, SQLModel
  import os

  DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/orders_db")
  engine = create_engine(DATABASE_URL, echo=True)

  def create_db_and_tables():
      SQLModel.metadata.create_all(engine)

  def get_session():
      with Session(engine) as session:
          yield session
  ```

- [ ] **Step 3: Commit**
  Run: `git add backend/pyproject.toml backend/database.py`
  Run: `git commit -m "feat: add sqlmodel and database connection logic"`

### Task 2: Model Migration

**Files:**

- Modify: `backend/models/orders.py`

- [ ] **Step 1: Convert Order model to SQLModel Table**
  Modify `backend/models/orders.py`:

  ```python
  from sqlmodel import SQLModel, Field
  from typing import Optional
  from datetime import datetime

  class Order(SQLModel, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      customer_name: str
      total_amount: float
      status: str
      created_at: datetime = Field(default_factory=datetime.utcnow)
  ```

- [ ] **Step 2: Commit**
  Run: `git add backend/models/orders.py`
  Run: `git commit -m "feat: convert order model to sqlmodel table"`

### Task 3: Router Implementation

**Files:**

- Modify: `backend/routers/orders.py`

- [ ] **Step 1: Update endpoints to use get_session dependency**
  Modify `backend/routers/orders.py`:

  ```python
  from fastapi import APIRouter, Depends, HTTPException
  from sqlmodel import Session, select
  from backend.database import get_session
  from backend.models.orders import Order
  from typing import List

  router = APIRouter()

  @router.get("/orders", response_model=List[Order])
  def read_orders(session: Session = Depends(get_session)):
      orders = session.exec(select(Order)).all()
      return orders

  @router.post("/orders", response_model=Order)
  def create_order(order: Order, session: Session = Depends(get_session)):
      session.add(order)
      session.commit()
      session.refresh(order)
      return order

  @router.get("/orders/{order_id}", response_model=Order)
  def read_order(order_id: int, session: Session = Depends(get_session)):
      order = session.get(Order, order_id)
      if not order:
          raise HTTPException(status_code=404, detail="Order not found")
      return order
  ```

- [ ] **Step 2: Commit**
  Run: `git add backend/routers/orders.py`
  Run: `git commit -m "feat: implement db-backed order endpoints"`

### Task 4: App Integration & Verification

**Files:**

- Modify: `backend/main.py`

- [ ] **Step 1: Initialize DB on startup**
  Modify `backend/main.py` to call `create_db_and_tables()` during startup.

  ```python
  from fastapi import FastAPI
  from backend.database import create_db_and_tables
  from backend.routers import orders

  app = FastAPI()

  @app.on_event("startup")
  def on_startup():
      create_db_and_tables()

  app.include_router(orders.router)
  ```

- [ ] **Step 2: Run and verify**
  1. Start PostgreSQL container: `docker run --name orders-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`
  2. Run backend: `cd backend && uvicorn main:app --reload`
  3. Test endpoints using FastAPI Swagger UI (`/docs`).

- [ ] **Step 3: Commit**
  Run: `git add backend/main.py`
  Run: `git commit -m "feat: finalize db integration and verify startup"`

---
