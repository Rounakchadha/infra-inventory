# Lighting Inventory Management System

A simple, clean inventory management web application for a lighting consultancy business.
Built for non-technical office staff. Designed to be fast, easy to read, and easy to maintain.

---

## What this app does

- Shows all lighting stock in a clean, searchable table
- Lets admin staff add, edit, and delete inventory items
- Lets office workers search and filter stock by brand, category, cat number, or color
- Calculates total stock value automatically (Quantity × Unit Price)
- Exports inventory to Excel or CSV with one click
- Works on desktop and mobile

---

## Tech Stack

| Layer      | Technology          | Why                                              |
|------------|---------------------|--------------------------------------------------|
| Framework  | Next.js 14 (App Router) | Full-stack, single framework, easy to deploy |
| Styling    | Tailwind CSS        | Fast, responsive, clean UI                       |
| Components | shadcn/ui           | Pre-built accessible components                  |
| Database   | Supabase (PostgreSQL) | Hosted DB + auth, no separate backend needed   |
| Export     | SheetJS (xlsx)      | Excel and CSV export                             |
| Hosting    | Vercel              | Free tier, one-click Next.js deployment          |

---

## Project Structure

```
infra-inventory/
│
├── app/                            # Next.js App Router pages
│   ├── page.tsx                    # Inventory View (main page — no login required)
│   ├── layout.tsx                  # Root layout (fonts, globals)
│   ├── globals.css                 # Global styles
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx            # Admin login page
│   │
│   └── admin/
│       ├── page.tsx                # Admin dashboard
│       ├── audit/
│       │   └── page.tsx            # Admin audit history (who changed what)
│       ├── items/
│       │   ├── add/
│       │   │   └── page.tsx        # Add new inventory item
│       │   └── [id]/
│       │       └── page.tsx        # Edit existing inventory item
│       ├── brands/
│       │   └── page.tsx            # Manage brands
│       └── categories/
│           └── page.tsx            # Manage categories
│
├── components/                     # Reusable UI components
│   ├── inventory-table.tsx         # Main inventory data table
│   ├── search-filter-bar.tsx       # Search input + brand/category dropdowns
│   ├── item-form.tsx               # Shared form for add and edit item
│   ├── export-buttons.tsx          # Excel and CSV download buttons
│   ├── summary-bar.tsx             # Total items + total stock value display
│   └── admin-nav.tsx               # Admin sidebar / top navigation
│
├── lib/
│   ├── supabase.ts                 # Supabase client setup
│   └── utils.ts                    # Helpers: currency formatting, date formatting
│
├── types/
│   └── index.ts                    # TypeScript types: Brand, Category, InventoryItem
│
├── supabase/
│   ├── schema.sql                  # Database table definitions (run in Supabase SQL editor)
│   └── seed.sql                    # Sample data: 10 inventory items across 5 brands
│
├── middleware.ts                   # Protects /admin routes — redirects to login if not authenticated
│
├── .env.local.example              # Template for environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── gemini.md                       # Full prompt for Gemini to build this app end-to-end
```

---

## Pages

### `/` — Inventory View (public)
The main page. Anyone with the link can use this.
- Large search bar at the top
- Brand and category filter dropdowns
- Inventory table with all fields
- Total stock value summary
- Export to Excel / CSV buttons
- Link to Admin Panel

### `/admin` — Admin Dashboard (login required)
- Summary cards: total items, total brands, total stock value
- Full inventory table with Edit and Delete per row
- Quick links to add items, manage brands, manage categories

### `/admin/items/add` — Add New Item
- Form with all fields
- Brand and category are dropdowns
- Total Value shown live (auto-calculated)

### `/admin/items/[id]` — Edit Item
- Same form, pre-filled with existing data

### `/admin/brands` — Manage Brands
- List of brands with add and delete

### `/admin/categories` — Manage Categories
- List of categories with add and delete

### `/admin/audit` — Audit Logs
- Timeline of create/update/delete actions
- Shows when a change happened, who did it, and which record/table was affected

### `/(auth)/login` — Admin Login
- Email and password login via Supabase Auth

---

## Database Tables

### `brands`
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | uuid      | Primary key        |
| name       | text      | e.g., "Vizion"     |
| created_at | timestamp | Auto-set           |

### `categories`
| Column     | Type      | Notes              |
|------------|-----------|--------------------|
| id         | uuid      | Primary key        |
| name       | text      | e.g., "Downlights" |
| created_at | timestamp | Auto-set           |

### `inventory_items`
| Column        | Type         | Notes                              |
|---------------|--------------|------------------------------------|
| id            | uuid         | Primary key                        |
| brand_id      | uuid         | Foreign key → brands               |
| category_id   | uuid         | Foreign key → categories           |
| cat_number    | text         | Catalog / article number           |
| cct           | text         | Color temperature e.g. "3000K"     |
| watts         | numeric      | Power in watts                     |
| color_fixture | text         | Finish/color e.g. "White", "Black" |
| quantity      | integer      | Units in stock                     |
| unit_price    | numeric(10,2)| Price per unit in ₹                |
| created_at    | timestamp    | Auto-set                           |
| updated_at    | timestamp    | Updated on each edit               |

> `total_value` is NOT stored. It is calculated in the frontend as `quantity × unit_price`.

---

## Sample Brands and Categories

**Brands:** Vizion, Neri, Bega, Philips, Havells

**Categories:** Downlights, Track Lights, Wall Lights, Ceiling Lights, Outdoor Lights

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these in your Supabase project under: Settings → API

---

## Setup Instructions (for developer)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
- Create a free project at https://supabase.com
- Go to SQL Editor
- Run the contents of `supabase/schema.sql`
- Then run `supabase/seed.sql` to insert sample data

### 3. Configure environment
```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
```

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy to Vercel
- Push to GitHub
- Connect repo to Vercel at https://vercel.com
- Add environment variables in Vercel dashboard
- Deploy

---

## Admin Access

- Go to `/login`
- Use the email and password you set up in Supabase Auth
- All `/admin/*` routes are protected by middleware
- The main view page `/` requires no login

---

## Export

- **Excel (.xlsx):** Downloads all currently visible (filtered) rows
- **CSV (.csv):** Same data in CSV format
- Filename format: `inventory-export-YYYY-MM-DD.xlsx` / `.csv`
- Uses SheetJS (xlsx) library

---

## Future Considerations (not built yet)

These are intentionally left out to keep the app simple. They can be added later:

- Low stock alerts (minimum quantity threshold per item)
- Item images
- Multiple warehouse locations
- PDF export
- Desktop app wrapper (Tauri)
- Supplier tracking

---

## Key Design Decisions

- **No separate backend server.** Supabase handles the database and auth. Next.js API routes are not needed.
- **No complex role system.** View page is public. Admin panel is protected by Supabase login. One admin account is enough for now.
- **Total value is calculated, not stored.** This avoids data inconsistency bugs.
- **Client-side search and filter.** Since the dataset is small (hundreds of items), filtering in the browser is fast and avoids extra API calls.
- **shadcn/ui for components.** Gives a clean, consistent look without custom CSS work.

---

## Notes for non-technical readers

- This app runs in a web browser — no software needs to be installed
- It works on phone, tablet, and desktop
- Only one person (the admin) needs a password
- Office workers just open the link and can immediately see and search stock
- Data is stored securely in the cloud (Supabase)
- Exporting stock data is one button click

---

*For any questions about the setup, refer to `gemini.md` which contains the full technical build prompt.*
