# Gemini Build Prompt — Lighting Inventory Management System

> Read this file completely before writing any code.
> Build the application step by step in the exact order given at the bottom.
> Do not skip any step. Do not add features not listed here.

---

## What you are building

A simple, clean inventory management web application for a small lighting consultancy business.
The people who will use this are non-technical office staff and warehouse workers.
The UI must be very easy to understand — large text, large buttons, minimal clutter.

There are two types of users:
1. **Admin / Staff** — can add, edit, delete inventory items, and manage brands and categories
2. **Office Workers (Viewers)** — can view, search, filter, and export inventory (no login needed)

---

## Tech Stack

Use exactly this stack. Do not substitute anything.

| Layer       | Choice                     |
|-------------|----------------------------|
| Framework   | Next.js 14 (App Router)    |
| Language    | TypeScript                 |
| Styling     | Tailwind CSS               |
| Components  | shadcn/ui                  |
| Database    | Supabase (PostgreSQL)      |
| Auth        | Supabase Auth              |
| Export      | SheetJS (`xlsx` library)   |
| Hosting     | Vercel (deployment target) |

---

## File Structure to create

Build exactly this structure. Each file's purpose is described.

```
infra-inventory/
│
├── app/
│   ├── page.tsx                        ← Inventory View (public, main page)
│   ├── layout.tsx                      ← Root layout with font and metadata
│   ├── globals.css                     ← Global Tailwind base styles
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                ← Admin login form
│   │
│   └── admin/
│       ├── page.tsx                    ← Admin dashboard with summary + item table
│       ├── items/
│       │   ├── add/
│       │   │   └── page.tsx            ← Add new inventory item
│       │   └── [id]/
│       │       └── page.tsx            ← Edit existing inventory item
│       ├── brands/
│       │   └── page.tsx                ← Manage brands (list, add, delete)
│       └── categories/
│           └── page.tsx                ← Manage categories (list, add, delete)
│
├── components/
│   ├── inventory-table.tsx             ← Table showing all inventory rows
│   ├── search-filter-bar.tsx           ← Search input + brand/category dropdowns
│   ├── item-form.tsx                   ← Shared form used by both add and edit pages
│   ├── export-buttons.tsx              ← Excel and CSV download buttons
│   ├── summary-bar.tsx                 ← Shows total items + total stock value
│   └── admin-nav.tsx                   ← Top navigation bar for admin pages
│
├── lib/
│   ├── supabase.ts                     ← Supabase browser client initialization
│   └── utils.ts                        ← formatCurrency(), formatDate() helpers
│
├── types/
│   └── index.ts                        ← TypeScript types for Brand, Category, InventoryItem
│
├── supabase/
│   ├── schema.sql                      ← SQL to create all three tables
│   └── seed.sql                        ← SQL to insert sample brands, categories, and items
│
├── middleware.ts                       ← Protects /admin/* routes, redirects to /login
├── .env.local.example                  ← Template showing required env variable names
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Database Schema

### Table: `brands`
```sql
create table brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamp with time zone default now()
);
```

### Table: `categories`
```sql
create table categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamp with time zone default now()
);
```

### Table: `inventory_items`
```sql
create table inventory_items (
  id            uuid primary key default gen_random_uuid(),
  brand_id      uuid references brands(id) on delete set null,
  category_id   uuid references categories(id) on delete set null,
  cat_number    text not null,
  cct           text,
  watts         numeric,
  color_fixture text,
  quantity      integer not null default 0,
  unit_price    numeric(10,2) not null default 0,
  created_at    timestamp with time zone default now(),
  updated_at    timestamp with time zone default now()
);
```

Important: `total_value` is NOT stored in the database.
It is always calculated in the frontend as: `quantity * unit_price`.

---

## TypeScript Types — `/types/index.ts`

```typescript
export type Brand = {
  id: string
  name: string
  created_at: string
}

export type Category = {
  id: string
  name: string
  created_at: string
}

export type InventoryItem = {
  id: string
  brand_id: string
  category_id: string
  cat_number: string
  cct: string
  watts: number
  color_fixture: string
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  // Joined fields (from Supabase query with select)
  brand?: Brand
  category?: Category
}

// This is the item shape used in forms
export type InventoryItemFormData = {
  brand_id: string
  category_id: string
  cat_number: string
  cct: string
  watts: number | ''
  color_fixture: string
  quantity: number | ''
  unit_price: number | ''
}
```

---

## Supabase Client — `/lib/supabase.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Utility Helpers — `/lib/utils.ts`

```typescript
// Format a number as Indian Rupees: ₹1,23,456.00
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Calculate total value for an item
export function calcTotalValue(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

// Format date to readable string
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
```

---

## Middleware — `/middleware.ts`

Protect all `/admin/*` routes. If user is not logged in, redirect to `/login`.
The main `/` page and `/login` page are always accessible without login.

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## Environment Variables — `/.env.local.example`

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

These values come from: Supabase Dashboard → Project Settings → API

---

## Seed Data — `/supabase/seed.sql`

```sql
-- Brands
insert into brands (name) values
  ('Vizion'),
  ('Neri'),
  ('Bega'),
  ('Philips'),
  ('Havells');

-- Categories
insert into categories (name) values
  ('Downlights'),
  ('Track Lights'),
  ('Wall Lights'),
  ('Ceiling Lights'),
  ('Outdoor Lights');

-- Inventory Items (use actual UUIDs from the above inserts when running manually)
-- When building this, query brand and category IDs from the inserted rows above
-- and insert items using those IDs.
-- Below is a template showing which brand+category+data belongs together:

-- VIZ-DL-001 | Vizion | Downlights  | 3000K | 9W  | White      | qty:45  | price:850
-- VIZ-DL-002 | Vizion | Downlights  | 4000K | 12W | Black      | qty:30  | price:1100
-- VIZ-TL-003 | Vizion | Track Lights| 5000K | 20W | Black      | qty:12  | price:4200
-- NER-WL-010 | Neri   | Wall Lights | 3000K | 7W  | Silver     | qty:20  | price:2200
-- NER-TL-005 | Neri   | Track Lights| 4000K | 15W | White      | qty:15  | price:3500
-- BEG-OL-020 | Bega   | Outdoor     | 5000K | 20W | Anthracite | qty:10  | price:8500
-- BEG-WL-015 | Bega   | Wall Lights | 3000K | 10W | Silver     | qty:8   | price:6200
-- PHI-CL-030 | Philips| Ceiling     | 4000K | 18W | White      | qty:25  | price:1800
-- PHI-DL-008 | Philips| Downlights  | 3000K | 9W  | White      | qty:60  | price:650
-- HAV-DL-012 | Havells| Downlights  | 4000K | 12W | White      | qty:40  | price:750
```

---

## Page: Inventory View — `/app/page.tsx`

This is the most important page. Build it with great care.

**Behavior:**
- Fetch all inventory items from Supabase on page load, joined with brand and category names
- Use client-side filtering: search and dropdown filters work without hitting the database again
- Display filtered results in the inventory table
- Show total stock value as sum of (quantity × unit_price) for currently visible rows
- Export buttons export only visible rows

**Layout (top to bottom):**
1. Page heading: "Lighting Stock Inventory" — large, bold
2. Search bar: full width, large, placeholder: "Search by brand, category, cat number, color..."
3. Two dropdowns side by side: "All Brands" and "All Categories"
4. Summary bar: "Showing X items | Total Value: ₹XX,XXX"
5. Export buttons: "Download Excel" and "Download CSV"
6. Inventory table
7. Small footer link: "Admin Panel →"

**Search logic:**
Filter items where any of these fields contain the search text (case-insensitive):
- brand.name
- category.name
- cat_number
- color_fixture

Brand dropdown filters by brand. Category dropdown filters by category.
All three (search + brand filter + category filter) apply simultaneously.

**Table columns:**
Brand | Category | Cat No | CCT | Watts | Color/Fixture | Qty | Unit Price | Total Value

**Design requirements:**
- Minimum body font size: 16px
- Table header: bold, slightly larger
- Alternating row background for readability (very light grey on alternate rows)
- Responsive: on mobile, allow horizontal scroll on the table, or switch to card layout
- Large, clearly labeled buttons (at least 44px tall)
- Clean white background, subtle borders
- Primary accent color: indigo-600
- Do not add any decorative hero images, banners, or marketing text

---

## Page: Admin Dashboard — `/app/admin/page.tsx`

**Layout:**
1. Admin navigation (use AdminNav component)
2. Three summary cards:
   - Total Items in Stock
   - Total Brands
   - Total Stock Value (sum of all items)
3. Quick action buttons: "Add New Item", "Manage Brands", "Manage Categories"
4. Full inventory table with Edit and Delete buttons per row

**Delete behavior:**
- Show a shadcn AlertDialog confirmation: "Are you sure you want to delete this item? This cannot be undone."
- Only delete after user confirms
- Refresh the list after deletion

---

## Page: Add Item — `/app/admin/items/add/page.tsx`

Use the `ItemForm` component with no initial data.
On successful save, redirect to `/admin`.

---

## Page: Edit Item — `/app/admin/items/[id]/page.tsx`

Fetch the item by ID from Supabase.
Pass item data as initial values to `ItemForm`.
On successful save, redirect to `/admin`.

---

## Component: ItemForm — `/components/item-form.tsx`

Shared form used by both Add and Edit pages.

**Props:**
```typescript
type ItemFormProps = {
  initialData?: InventoryItemFormData
  itemId?: string          // if provided, this is an edit operation
  brands: Brand[]
  categories: Category[]
  onSuccess: () => void
}
```

**Fields:**
| Field         | Input Type       | Notes                                      |
|---------------|------------------|--------------------------------------------|
| Brand         | Select dropdown  | Options from brands prop                   |
| Category      | Select dropdown  | Options from categories prop               |
| Cat Number    | Text input       | Required                                   |
| CCT           | Text input       | Optional, e.g., "3000K"                    |
| Watts         | Number input     | Optional                                   |
| Color/Fixture | Text input       | Optional                                   |
| Quantity      | Number input     | Required, min 0                            |
| Unit Price    | Number input     | Required, min 0, decimal allowed           |
| Total Value   | Read-only display| Auto-calculated: Quantity × Unit Price, shown in ₹ |

**Behavior:**
- Show validation errors below each field if required field is missing
- Total Value updates live as user changes Quantity or Unit Price
- On save: INSERT or UPDATE in Supabase depending on whether itemId is provided
- Show a loading spinner on the Save button while saving
- Show error message if save fails

**Buttons:** "Save Item" (or "Update Item" if editing) + "Cancel"

---

## Component: InventoryTable — `/components/inventory-table.tsx`

**Props:**
```typescript
type InventoryTableProps = {
  items: InventoryItem[]
  showActions?: boolean   // true on admin page (shows Edit/Delete buttons)
  onEdit?: (item: InventoryItem) => void
  onDelete?: (item: InventoryItem) => void
}
```

**Columns:**
Brand | Category | Cat No | CCT | Watts | Color/Fixture | Qty | Unit Price | Total Value | (Actions if showActions)

**Design:**
- Use shadcn Table component
- Alternating row shading
- Qty shown as plain number
- Unit Price and Total Value formatted with formatCurrency()
- On mobile: horizontal scroll enabled on table

---

## Component: SearchFilterBar — `/components/search-filter-bar.tsx`

**Props:**
```typescript
type SearchFilterBarProps = {
  search: string
  onSearchChange: (value: string) => void
  selectedBrand: string
  onBrandChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  brands: Brand[]
  categories: Category[]
}
```

**Layout:**
- Search input (full width on mobile, 60% on desktop)
- Brand select dropdown
- Category select dropdown
- All three on same row on desktop, stacked on mobile

---

## Component: ExportButtons — `/components/export-buttons.tsx`

**Props:**
```typescript
type ExportButtonsProps = {
  items: InventoryItem[]  // currently visible/filtered items
}
```

**Excel export behavior:**
```typescript
import * as XLSX from 'xlsx'

// Map items to rows
const rows = items.map(item => ({
  Brand: item.brand?.name ?? '',
  Category: item.category?.name ?? '',
  'Cat Number': item.cat_number,
  CCT: item.cct,
  Watts: item.watts,
  'Color/Fixture': item.color_fixture,
  Quantity: item.quantity,
  'Unit Price (₹)': item.unit_price,
  'Total Value (₹)': item.quantity * item.unit_price,
}))

const ws = XLSX.utils.json_to_sheet(rows)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Inventory')
XLSX.writeFile(wb, `inventory-export-${new Date().toISOString().split('T')[0]}.xlsx`)
```

**CSV export behavior:**
Same rows as above, but use XLSX.utils.sheet_to_csv() and trigger a text/csv file download.

**Buttons:**
- "Download Excel" — indigo, icon: download
- "Download CSV" — outline style, icon: download

---

## Component: SummaryBar — `/components/summary-bar.tsx`

**Props:**
```typescript
type SummaryBarProps = {
  itemCount: number
  totalValue: number
}
```

Displays:
> Showing **23 items** | Total Stock Value: **₹4,56,200.00**

Use formatCurrency() for the total value.

---

## Component: AdminNav — `/components/admin-nav.tsx`

Top navigation bar shown on all `/admin/*` pages.

**Links:**
- Dashboard (`/admin`)
- Add Item (`/admin/items/add`)
- Brands (`/admin/brands`)
- Categories (`/admin/categories`)

**Also:**
- "View Inventory →" link (opens `/` in same tab)
- "Log Out" button (calls supabase.auth.signOut(), then redirect to `/login`)

---

## Page: Manage Brands — `/app/admin/brands/page.tsx`

**Layout:**
1. Heading: "Manage Brands"
2. Add brand section: text input + "Add Brand" button side by side
3. List of existing brands, each with a "Delete" button
4. Show confirmation before deleting
5. Do not allow deleting a brand that is still used by inventory items — show a clear warning instead

---

## Page: Manage Categories — `/app/admin/categories/page.tsx`

Same layout and logic as Manage Brands, but for categories.

---

## Page: Login — `/app/(auth)/login/page.tsx`

**Layout:**
- Centered card on screen
- Heading: "Admin Login"
- Email input
- Password input
- "Log In" button
- Error message area for wrong credentials

**Behavior:**
- On submit: call `supabase.auth.signInWithPassword({ email, password })`
- On success: redirect to `/admin`
- On failure: show "Invalid email or password. Please try again."

After logging in, the Supabase session cookie is set automatically by the middleware.
Do not store the password anywhere in code.

---

## Design System Rules

Apply these consistently across all pages:

| Rule                 | Value                                      |
|----------------------|--------------------------------------------|
| Body font size       | 16px minimum (text-base in Tailwind)       |
| Heading (H1)         | text-3xl font-bold                         |
| Heading (H2)         | text-2xl font-semibold                     |
| Section heading      | text-xl font-medium                        |
| Primary button       | bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg text-base font-medium |
| Secondary button     | border border-gray-300 text-gray-700 px-5 py-3 rounded-lg text-base font-medium |
| Danger button        | bg-red-600 hover:bg-red-700 text-white     |
| Input fields         | border border-gray-300 rounded-lg px-4 py-3 text-base w-full focus:ring-2 focus:ring-indigo-500 |
| Card/panel           | bg-white rounded-xl shadow-sm border border-gray-100 p-6 |
| Page background      | bg-gray-50                                 |
| Max page width       | max-w-7xl mx-auto px-4                     |
| Table header         | bg-gray-100 text-sm font-semibold text-gray-700 uppercase tracking-wide |
| Alternating row      | even:bg-gray-50                            |
| Mobile breakpoint    | sm: for 640px+, md: for 768px+             |

Do not deviate from this design system. It ensures visual consistency.

---

## Responsiveness Rules

- All pages must work on a 375px wide mobile screen (iPhone SE size)
- The inventory table can scroll horizontally on mobile (`overflow-x-auto`)
- The search bar and filters stack vertically on mobile
- Admin nav collapses to a simpler layout on mobile (or a hamburger menu if you wish)
- Buttons must be at least 44px tall for touch targets
- Font sizes must not go below 14px anywhere

---

## Error Handling Rules

- Show a simple, friendly error message if any Supabase query fails — not raw error text
- Example: "Could not load inventory. Please refresh the page."
- Use a try/catch around all Supabase calls
- Show loading states (spinner or skeleton rows) while data is being fetched
- If a form submission fails, show the error below the Save button

---

## Package.json Dependencies

Include at minimum:
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "typescript": "5.x",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "xlsx": "latest",
    "tailwindcss": "3.x",
    "@tailwindcss/forms": "latest",
    "lucide-react": "latest"
  }
}
```

Also install shadcn/ui components needed:
- Button, Input, Select, Table, Card, Dialog (AlertDialog), Label, Badge

---

## Build Order — Follow exactly in this sequence

Do not jump ahead. Complete each step fully before moving to the next.

**Step 1:** Initialize Next.js 14 project with TypeScript and Tailwind CSS
- `npx create-next-app@latest infra-inventory --typescript --tailwind --app --eslint`

**Step 2:** Install shadcn/ui and initialize it
- `npx shadcn-ui@latest init`
- Add components: button, input, select, table, card, dialog, label, badge

**Step 3:** Install remaining packages
- `npm install @supabase/ssr @supabase/supabase-js xlsx lucide-react`

**Step 4:** Create Supabase project (instruct user)
- Go to https://supabase.com, create a new project
- Run `supabase/schema.sql` in the SQL Editor
- Run `supabase/seed.sql` in the SQL Editor
- Copy the Project URL and Anon Key into `.env.local`

**Step 5:** Write `/types/index.ts` — all TypeScript types

**Step 6:** Write `/lib/supabase.ts` — Supabase client

**Step 7:** Write `/lib/utils.ts` — formatCurrency, calcTotalValue, formatDate

**Step 8:** Write `/middleware.ts` — route protection

**Step 9:** Write `app/layout.tsx` and `app/globals.css`

**Step 10:** Write all components (in this order):
- `summary-bar.tsx`
- `search-filter-bar.tsx`
- `inventory-table.tsx`
- `export-buttons.tsx`
- `item-form.tsx`
- `admin-nav.tsx`

**Step 11:** Write `app/page.tsx` — the main inventory view page

**Step 12:** Write `app/(auth)/login/page.tsx` — login page

**Step 13:** Write `app/admin/page.tsx` — admin dashboard

**Step 14:** Write `app/admin/items/add/page.tsx` — add item

**Step 15:** Write `app/admin/items/[id]/page.tsx` — edit item

**Step 16:** Write `app/admin/brands/page.tsx` — manage brands

**Step 17:** Write `app/admin/categories/page.tsx` — manage categories

**Step 18:** Write `supabase/schema.sql` and `supabase/seed.sql`

**Step 19:** Write `.env.local.example`, `.gitignore`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`

**Step 20:** Final review
- Check all pages render without errors
- Check mobile responsiveness
- Check export buttons work
- Check admin auth flow works (login → redirect to /admin, logout → redirect to /login)
- Check search and filter work on the main page

---

## What NOT to build

Do not add any of the following — they are out of scope:

- Stock movement history or audit logs
- Supplier or vendor tracking
- Purchase orders
- Barcode scanning
- Item images/photo uploads
- Multiple warehouse locations
- PDF export
- Role-based access control (beyond simple admin vs. viewer)
- Dashboard analytics charts or graphs
- Email notifications
- Mobile app (native iOS or Android)

Keep the application focused and simple.

---

## Final Checklist (verify before submitting)

- [ ] All 17 files created and fully implemented (no TODO comments left)
- [ ] TypeScript types used throughout, no `any` types
- [ ] All Supabase calls wrapped in try/catch with user-friendly errors
- [ ] Loading states shown on all data-fetch pages
- [ ] Search and filter work on `/` page
- [ ] Total value calculated correctly as `quantity * unit_price`
- [ ] formatCurrency() used for all money values (₹ format)
- [ ] Export downloads correct data with correct filename
- [ ] Admin routes protected by middleware
- [ ] Login and logout flow works
- [ ] UI looks clean and consistent across all pages
- [ ] All buttons are at least 44px tall
- [ ] Font size is 16px minimum everywhere
- [ ] App is mobile responsive (tested at 375px width)
- [ ] No hardcoded data — all data comes from Supabase
- [ ] Seed data inserted: 5 brands, 5 categories, 10 inventory items
