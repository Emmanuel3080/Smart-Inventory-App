# SmallBiz — Run your business. Know your stock.

> **Category:** Retail Inventory & Business Operations Management  
> **Supporting Description:** A simpler way for growing businesses to manage inventory, staff, sales, and daily operations.

---

## 📌 Overview

**SmallBiz** is a modern, responsive web application engineered for small and medium-sized retail shops. It consolidates daily store operations into two distinct, role-based workflows:

1. **Owner & Administrator Suite:** Real-time stock valuation, catalog governance, supplier procurement channels with one-click WhatsApp messaging, financial analytics, cashier transaction audits, and team delegation.
2. **Staff Point of Sale (POS) Terminal:** Fast inventory lookup, live stock balance visibility, and sales checkout for store clerks and cashiers.

---

## 🚀 Key Features

### 1. Inventory & Stock Valuation
- **Live Stock Alerts:** Real-time categorization of catalog items into `In Stock` (healthy), `Low Stock` (at or below reorder floor), and `Out of Stock`.
- **Financial Analytics & Margins:** Automated computation of total inventory capital, profit margins per unit, and retail markups.
- **Product Catalog Management:** Full CRUD operations with SKU tagging, category classification, reorder threshold configuration, and product image uploads.

### 2. Staff Onboarding & Team Delegation
- **Tokenized Staff Invitations:** Store owners can invite staff via email (`POST /api/v1/staff/invitations`). The system generates an encrypted invitation link with automated clipboard copying and expiry dates.
- **Invitation Verification & Activation:** Dedicated acceptance route (`/staff/accept-invitation?token=...`) verifying token validity (`GET /api/v1/staff/invitations/verify/:token`) and allowing invited members to securely set up their credentials (`POST /api/v1/staff/invitations/accept`).
- **Staff Directory & Roster:** Paginated table view (`GET /api/v1/staff`) featuring debounced search (by first name, last name, or email), status filtering (`active` vs. `inactive`), multi-field sorting, and global store counts (Total, Active, Inactive).
- **Staff Member Modal:** Instant view-only inspection modal displaying employee metadata, shift status, and enrolled timestamps.

### 3. Staff Point of Sale (POS) Terminal
- **Cashier Counter:** Clean inventory grid enabling staff to quickly locate merchandise and execute sales.
- **Shift & Assignment Protection:** Staff members without an assigned store owner are safely routed to a friendly holding terminal (`/staff/pending`) with live assignment refresh checks.

### 4. Supplier & Vendor Directory
- **Vendor Profiles:** Record vendor company names, primary contacts, physical store addresses, and phone numbers.
- **Direct WhatsApp Dispatch:** One-click WhatsApp link generator (`https://wa.me/...`) sanitized with international dialing prefixes for instant purchase orders.

### 5. Sales & Transaction Audits
- **Revenue Ledger:** Track all completed cashier transactions, items sold, checkout timestamps, and payment modes (Cash, Card, Transfer).
- **Instant Search:** Filter transaction history by cashier name, item name, or payment mode.

---

## 🎨 Design System & Palette

SmallBiz follows a calm, clean, and trustworthy visual palette:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Page Base** | `#FAF8F5` | Warm cream background for all main screens |
| **Surface** | `#FFFFFF` | Cards, modals, inputs, and floating containers |
| **Subtle Surface** | `#F2EDE4` | Table headers, secondary strips, and hover fills |
| **Borders** | `#E8E2D8` | Dividers and 1px card outlines |
| **Strong Border** | `#CFC6B8` | Focused inputs and selected card boundaries |
| **Primary Brand** | `#1F5C4A` | Deep forest green for main actions, logo tiles, active nav links |
| **Primary Hover** | `#174738` | Hover state for primary buttons |
| **Primary Tint** | `#E3EEE9` | Soft highlight badges and active chips |
| **Accent Brand** | `#D99A2B` | Warm amber for icon tiles, small badges, and highlights |
| **Dark Panel** | `#123D31` | High-contrast hero panels with `#FFFFFF` and `#B9CEC5` text |
| **Status: Success** | `#15803D` (`#E6F4EA` tint) | In-stock items, verified accounts, active cashiers |
| **Status: Warning** | `#C2410C` (`#FFEDD5` tint) | Low stock warnings, reorder alerts |
| **Status: Danger** | `#B91C1C` (`#FEE2E2` tint) | Out of stock, delete buttons, rejected invites |

---

## 🛠️ Tech Stack

- **Frontend Core:** [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/) (Browser routing with protected route guards)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Modals & Overlays:** [React Modal](https://reactcommunity.org/react-modal/)

---

## 📁 Project Structure

```text
SME_APP/
├── public/
│   └── favicon.svg               # SmallBiz brand favicon squircle
├── src/
│   ├── AdminDashboard/
│   │   ├── AdminContent.jsx       # Owner metrics, catalog table & transaction modal
│   │   ├── AdminStaffManagement.jsx # Paginated staff directory with search & filters
│   │   ├── InviteStaffModal.jsx   # Staff invitation link generator modal
│   │   └── StaffDetailsModal.jsx  # Staff profile inspection modal
│   ├── AuthPages/
│   │   ├── SignIn.jsx             # Administrator sign-in
│   │   └── SignUp.jsx             # Administrator registration
│   ├── Common/
│   │   ├── AdminHeader.jsx        # Sticky navigation header for administrators
│   │   └── StaffHeader.jsx        # Sticky navigation header for POS staff
│   ├── Components/
│   │   ├── EntryScreen.jsx        # Public portal landing page
│   │   ├── Inventoryrid.jsx       # Staff POS inventory counter
│   │   ├── ProductTableList.jsx   # Admin inventory table with stock badges
│   │   └── SmallBizLogo.jsx       # Scalable SmallBiz SVG logo and icon component
│   ├── Contexts/
│   │   ├── AdminAuthContext.jsx   # Administrator authentication state
│   │   ├── ProductContext.jsx     # Product inventory state & CRUD actions
│   │   ├── StaffAuthContext.jsx   # Staff authentication & JWT verification
│   │   ├── StaffOperationContext.jsx # Staff inventory fetching & checkout actions
│   │   ├── SupplierContext.jsx    # Supplier profiles state & actions
│   │   └── TransactionContext.jsx # Sales transactions and gross revenue state
│   ├── Dashboard/
│   │   └── AdminDashboard.jsx     # Main owner dashboard container
│   ├── ProductPage/
│   │   ├── PostProduct.jsx        # Register new merchandise entry
│   │   └── UpdateProduct.jsx      # Edit existing merchandise entry
│   ├── Protected/
│   │   ├── AdminProtectedRoute.jsx # Enforces owner role access
│   │   └── StaffProtectedRoute.jsx # Enforces staff role & assigned status
│   ├── StaffAuthPages/
│   │   ├── AcceptInvitation.jsx   # Verifies tokens & completes staff onboarding
│   │   ├── SignIn.jsx             # Staff terminal sign-in
│   │   └── Signp.jsx              # Standalone staff registration
│   ├── StaffDashboard/
│   │   ├── Dashboard.jsx          # Staff POS terminal view
│   │   └── StaffPending.jsx       # Holding screen for unassigned staff
│   ├── Supplierpage/
│   │   ├── CreateSuplier.jsx      # Onboard new merchandise vendor
│   │   └── Suppliers.jsx          # Supplier directory with WhatsApp actions
│   ├── App.jsx                    # Application routing table & context providers
│   ├── index.css                  # Tailwind CSS v4 design system theme
│   └── main.jsx                   # React application entry point
├── .env                           # Environment variables
├── index.html                     # HTML template with SmallBiz metadata
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```

---

## 🔌 API Integration Matrix

| Endpoint | Method | Role | Description |
| :--- | :---: | :---: | :--- |
| `/api/v1/admin/auth/signin` | `POST` | Public | Authenticates store owner & returns admin JWT |
| `/api/v1/admin/auth/signup` | `POST` | Public | Registers a new store owner account |
| `/api/v1/staff/invitations` | `POST` | Admin | Generates a staff invitation token for an email |
| `/api/v1/staff/invitations/verify/:token` | `GET` | Public | Validates an invitation token & returns owner details |
| `/api/v1/staff/invitations/accept` | `POST` | Public | Accepts invitation and registers a staff account |
| `/api/v1/staff` | `GET` | Admin | Lists admin's staff with pagination, search, status, and sorting |
| `/staff/auth/signin` | `POST` | Public | Authenticates staff cashier & returns staff JWT |
| `/staff/verify_jwt` | `GET` | Staff | Retrieves staff profile and verifies assigned `adminId` |
| `/staff/all/products` | `GET` | Staff | Returns products belonging to the staff's assigned admin |
| `/api/v1/products` | `GET`/`POST` | Admin | Fetches or creates inventory merchandise entries |
| `/api/v1/products/:id` | `PUT`/`DELETE` | Admin | Updates or removes inventory merchandise entries |
| `/api/v1/suppliers` | `GET`/`POST` | Admin | Retrieves or creates supplier contact records |
| `/api/v1/transactions` | `GET` | Admin | Fetches store checkout transaction ledger |

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (bundled with Node.js)

### 1. Installation
Clone the repository and install the project dependencies:
```bash
git clone <repository-url>
cd SME_APP
npm install
```

### 2. Environment Configuration
Create or verify the `.env` file in the root directory:
```env
VITE_API_URL = https://smart-inventory-system-backend-sy9t.onrender.com
```
*(For local backend development, switch `VITE_API_URL` to `http://localhost:3000`)*.

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready assets will be generated inside the `dist/` directory.

---

## 🔒 Role-Based Routing Rules

- `/entry`: Public landing page showcasing SmallBiz capabilities and sign-in shortcuts.
- `/admin/*`: Restricted strictly to store administrators (`accesToken`). Unauthorized users are redirected to `/admin/signin`.
- `/staff/dashboard`: Restricted to authenticated staff (`StaffToken`) who are assigned to an active store owner (`adminId`).
- `/staff/pending`: Holding route for authenticated staff whose account is pending assignment by an owner.
- `/staff/accept-invitation?token=...`: Public landing route for invited employees to register and activate their account.

---

## 📄 License

This project is developed as an academic and commercial retail inventory management solution. All rights reserved.
