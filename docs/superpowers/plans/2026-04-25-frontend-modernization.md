# Frontend Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the frontend by integrating Tailwind CSS, shadcn/ui, and migrating from client-side `useEffect` fetching to Next.js Server-Side Components (SSC).

**Architecture:** Transition the `Page` component from a client component to a server component for initial data fetching. Use a separate client component for interactive elements. Implement a utility-first styling approach with Tailwind and a component library (shadcn/ui) for a professional look.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS, shadcn/ui, Lucide React.

---

## File Structure

- Create: `frontend/tailwind.config.ts` - Tailwind configuration.
- Create: `frontend/postcss.config.js` - PostCSS configuration.
- Create: `frontend/app/globals.css` - Tailwind directives and shadcn variables.
- Create: `frontend/components/ui/` - shadcn component library (Button, Card, Table, etc.).
- Create: `frontend/components/orders-list.tsx` - Client component for displaying orders.
- Modify: `frontend/app/page.tsx` - Convert to Server Component and handle data fetching.
- Modify: `frontend/package.json` - Add necessary dependencies.

---

## Tasks

### Task 1: Tailwind CSS Setup

**Files:**

- Modify: `frontend/package.json`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Install Tailwind and dependencies**
  Run: `cd frontend && pnpm add -D tailwindcss postcss autoprefixer`
  Expected: Packages installed successfully.

- [ ] **Step 2: Initialize Tailwind config**
  Create `frontend/tailwind.config.ts`:

  ```typescript
  import type { Config } from 'tailwindcss'

  const config: Config = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  export default config
  ```

- [ ] **Step 3: Create PostCSS config**
  Create `frontend/postcss.config.js`:

  ```javascript
  module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  ```

- [ ] **Step 4: Add Tailwind directives to globals.css**
  Modify `frontend/app/globals.css`:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- [ ] **Step 5: Commit**
  Run: `git add frontend/package.json frontend/tailwind.config.ts frontend/postcss.config.js frontend/app/globals.css`
  Run: `git commit -m "style: setup tailwind css"`

### Task 2: shadcn/ui Integration

**Files:**

- Create: `frontend/components/ui/button.tsx`
- Create: `frontend/components/ui/card.tsx`
- Create: `frontend/components/ui/table.tsx`
- Create: `frontend/lib/utils.ts`

- [ ] **Step 1: Add utility function for Tailwind merging**
  Create `frontend/lib/utils.ts`:

  ```typescript
  import { clsx type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

  Run: `cd frontend && pnpm add clsx tailwind-merge`

- [ ] **Step 2: Implement shadcn Button**
  Create `frontend/components/ui/button.tsx`:

  ```tsx
  import * as React from "react"
  import { Slot } from "@radix-ui/react-slot"
  import { cn } from "@/lib/utils"

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
  }

  const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : "button"
      return <Comp className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2", className)} ref={ref} {...props} />
    }
  )
  Button.displayName = "Button"
  export { Button }
  ```

  Run: `cd frontend && pnpm add @radix-ui/react-slot`

- [ ] **Step 3: Implement shadcn Card**
  Create `frontend/components/ui/card.tsx`:

  ```tsx
  import * as React from "react"
  import { cn } from "@/lib/utils"

  const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow", className)} {...props} />
  ))
  Card.displayName = "Card"

  const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ))
  CardHeader.displayName = "CardHeader"

  const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  ))
  CardTitle.displayName = "CardTitle"

  const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ))
  CardContent.displayName = "CardContent"

  export { Card, CardHeader, CardTitle, CardContent }
  ```

- [ ] **Step 4: Commit**
  Run: `git add frontend/lib/utils.ts frontend/components/ui/button.tsx frontend/components/ui/card.tsx`
  Run: `git commit -m "ui: integrate shadcn base components"`

### Task 3: Migration to Server-Side Components (SSC)

**Files:**

- Create: `frontend/components/orders-list.tsx`
- Modify: `frontend/app/page.tsx`

- [ ] **Step 1: Create OrdersList client component**
  Create `frontend/components/orders-list.tsx`:

  ```tsx
  'use client';

  import { Order } from '@/types/models';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  export default function OrdersList({ orders }: { orders: Order[] }) {
    return (
      <div className="grid gap-4">
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Order ID: {order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-slate-100 p-2 rounded">
                  {JSON.stringify(order, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Convert Page to Server Component**
  Modify `frontend/app/page.tsx`:

  ```tsx
  import { getOrders } from '@/lib/api';
  import OrdersList from '@/components/orders-list';

  export default async function Page() {
    try {
      const orders = await getOrders();

      return (
        <main className="p-8 font-sans max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
          <div className="mb-4 text-sm text-muted-foreground">
            Total Orders: {orders.length}
          </div>
          <OrdersList orders={orders} />
        </main>
      );
    } catch (err) {
      return (
        <main className="p-8 font-sans max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            Error loading orders: {err instanceof Error ? err.message : 'An unexpected error occurred'}
          </div>
        </main>
      );
    }
  }
  ```

- [ ] **Step 3: Run and verify**
  Run: `cd frontend && pnpm run dev`
  Expected: Page loads with data immediately (no loading spinner) and uses Tailwind styling.

- [ ] **Step 4: Commit**
  Run: `git add frontend/components/orders-list.tsx frontend/app/page.tsx`
  Run: `git commit -m "feat: migrate to server components and apply tailwind styles"`

---
