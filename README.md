# example-fast-api

This is a simple demo for a python FastAPI backend with NextJS frontend

## Purpose

RESTful endpoint for a new purchase order request

Fields:

POST /api/order
    - User
    - Item Name
    - Item Description
    - Item Cost
    - Reason For Purchase

nice to have:

GET /api/items
    - id
    - description
    - cost
    - name

## How to Start

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Start the server using uv (recommended) or python:

   ```bash
   uv run uvicorn main:app --reload
   ```

   *Alternatively, if not using uv:*

   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies and start the development server:

   ```bash
   pnpm install
   pnpm run dev
