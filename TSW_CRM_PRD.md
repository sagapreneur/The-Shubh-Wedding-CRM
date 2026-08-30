# Product Requirements Document
## TSW Studio CRM — Invoicing & Payments Tool for The Shubh Wedding

**Prepared for:** The Shubh Wedding (TSW) — Wedding Photography Studio
**Document type:** PRD + Build Prompt (ready to paste into an AI coding agent such as Google Antigravity, Claude Code, Cursor, etc.)
**Version:** 1.0
**Date:** 30 August 2026

---

## 1. Product Summary

TSW CRM is a **lightweight, single-purpose CRM** built for a wedding photography studio. It is **not** a general-purpose CRM — its only job is to help the studio manage clients, raise professional invoices, track payments, generate printable PDF receipts, and chase pending payments over WhatsApp. Every feature exists to serve that job. Nothing else gets added.

**Guiding principle:** Simple, fast, beautiful, and boringly reliable. If a feature doesn't directly help send an invoice, collect a payment, or track a client, it does not belong in v1.

### 1.1 Core modules (exactly four)
1. **Dashboard** — at-a-glance business snapshot
2. **Clients** — client records and contact details
3. **Invoices** — create, edit, send, and track invoices/receipts
4. **Reports** — payment and revenue reporting

---

## 2. Goals & Non-Goals

### Goals
- Let the studio owner create a proper, professional invoice in under 60 seconds.
- Let any invoice be edited at any time (line items, amounts, status, notes).
- Generate a print-ready, PDF invoice and PDF receipt on a standard **A4 page**, laid out like a real studio invoice (not a spreadsheet dump).
- Send that PDF directly to the client's WhatsApp number in one tap.
- Track paid vs. pending amounts per client and studio-wide.
- Send a one-tap WhatsApp **payment reminder** message (with the pending amount auto-filled) for unpaid/partially-paid invoices.
- Keep the whole experience light, minimal, and on-brand with the TSW logo.

### Non-Goals (explicitly out of scope for v1)
- No lead pipeline / sales funnel / deal stages.
- No online payment gateway integration (Razorpay/Stripe) in v1 — payments are recorded manually as "received."
- No task management, calendar/shoot scheduling, or contract e-signing.
- No multi-user roles/permissions — single studio-owner login is enough.
- No email sending — WhatsApp is the only outbound channel.
- No mobile native app — a responsive web app is sufficient.

---

## 3. Users

| User | Description |
|---|---|
| Studio Owner / Admin | The single primary user. Manages clients, creates/edits invoices, marks payments, sends WhatsApp messages, views reports. |

(v1 is single-tenant, single-user. Design the data model so multi-user could be added later without a rebuild, but do not build auth roles now.)

---

## 4. Branding

- **Studio name:** The Shubh Wedding (short form: **TSW**)
- **Logo:** provided (`Logo-01.png`) — serif wordmark "TSW" with "THE SHUBH WEDDING" tagline underneath, tracked-out letterspacing, charcoal ink on transparent background.
- **Favicon:** provided (`Favicon-01.png`) — the "TSW" monogram alone.
- Use the provided logo file in the app header/sidebar and login screen; use the favicon file as the browser tab icon.
- On invoices/receipts, the logo sits at the top of the document as the studio letterhead.

### 4.1 Visual direction — "light, minimal, but attractive"
Since this is a wedding studio, the UI should feel elegant and calm, not corporate/SaaS-generic.

- **Palette:**
  - Ink / primary text: `#3A3A3A` (matches the logo's charcoal)
  - Background: `#FAF8F5` (warm ivory, not stark white)
  - Surface/cards: `#FFFFFF` with a very soft shadow, 1px hairline border `#EAE5DE`
  - Accent (for CTAs, status highlights): `#B8935F` (soft muted gold) — used sparingly
  - Success/Paid: `#5C8A6B` (muted sage green)
  - Pending/Warning: `#C97B4A` (soft terracotta)
  - Overdue/Danger: `#B25454` (muted brick red)
- **Typography:**
  - Headings & the wordmark: an elegant serif (e.g. "Playfair Display" or "EB Garamond") to echo the TSW logo.
  - Body/UI text: a clean sans-serif (e.g. "Inter" or "Poppins") for readability in tables and forms.
- **Layout feel:** generous white space, thin dividers instead of heavy boxes, rounded corners (8–12px), soft shadows, no harsh gradients, no clutter. Think "boutique studio," not "enterprise dashboard."
- **Iconography:** simple line icons (e.g. Lucide icon set).

---

## 5. Module Specifications

### 5.1 Dashboard
Single landing page after login. Read-only snapshot, no data entry here.

**Must show:**
- Total revenue collected (all-time, and this month toggle)
- Total pending amount (sum of unpaid + partially paid invoices)
- Count of clients
- Count of invoices (total / paid / pending / overdue)
- A short list: "Recent Invoices" (last 5–10, with status chip and quick "View" link)
- A short list: "Payments Due Soon" or "Pending Payments" — invoices not fully paid, sorted by oldest first, each with a one-tap **"Send Reminder"** button (see §5.4)
- Simple revenue trend — a minimal bar or line chart of collected revenue over the last 6 months

### 5.2 Clients
**Client List View**
- Table/card list of all clients: Name, WhatsApp number, total invoiced, total pending, last invoice date
- Search by name/phone
- "+ Add Client" button

**Add / Edit Client Form** — fields:
- Full Name *(required)*
- Service *(required — e.g. "Wedding Photography", "Pre-Wedding Shoot", "Reception Coverage"; free text or a simple dropdown+custom option)*
- Amount *(the agreed/base package amount — required, numeric)*
- Address *(required — for the invoice billing address)*
- WhatsApp Number *(required — used for sending PDFs & reminders, include country code)*
- Email *(optional — for record only, not used for sending in v1)*
- Notes *(optional free text)*

**Client Detail View**
- Client info card
- List of all invoices raised for this client with status
- Quick "+ New Invoice" button pre-filled with this client's details

### 5.3 Invoices
This is the heart of the product.

**Invoice List View**
- Table of all invoices: Invoice #, Client Name, Date, Total Amount, Amount Paid, Balance Due, Status (Draft / Sent / Partially Paid / Paid / Overdue), Actions
- Filter by status; search by client/invoice number
- "+ New Invoice" button

**Create / Edit Invoice Form**
- Auto-generated Invoice Number (editable if needed), Invoice Date, Due Date
- Client selector (search existing client, or "+ Add New Client" inline)
- Billing details auto-pulled from client record (name, address, WhatsApp) — editable per-invoice without changing the master client record
- **Line items table — add unlimited rows:**
  - Service/Item description
  - Quantity
  - Rate
  - Amount (auto = qty × rate, but editable/overridable)
  - "+ Add Service" button to add another row, remove-row button per line
- Auto-calculated Subtotal
- Optional Discount (flat or %)
- Optional Tax/GST (%, since applicable for Indian studios) — toggle on/off
- Grand Total (auto-calculated, always visible)
- **Payment tracking fields:**
  - Amount Paid so far (editable — supports partial payments)
  - Balance Due (auto = Grand Total − Amount Paid)
  - Payment Status (auto-derived: Draft / Sent / Partially Paid / Paid / Overdue) with manual override allowed
  - Payment mode (Cash / UPI / Bank Transfer / Other) — optional note field
- Notes / Terms section (e.g. "50% advance, balance on delivery") — with an editable default template
- **Editing:** every field above must remain editable at any time after creation, including after it's marked "Paid" or already sent — this is a hard requirement. Edits should update an "Last edited on" timestamp on the invoice for the owner's own reference.

**Invoice Actions (from list or detail view):**
- **View/Preview** — shows the print-style A4 layout
- **Edit**
- **Download PDF** (invoice)
- **Download PDF** (receipt — see §5.3.1)
- **Send via WhatsApp** — sends the generated PDF directly to the client's WhatsApp number (see §5.5)
- **Send Reminder** — only enabled if Balance Due > 0 (see §5.4)
- **Duplicate** (nice-to-have — clone an invoice as a starting point for a new one)
- **Delete/Void** (with confirmation)

#### 5.3.1 Invoice vs. Receipt
- **Invoice** = bill for services rendered, shows amount due.
- **Receipt** = proof of payment, generated once Amount Paid > 0. Should look near-identical to the invoice but headed "RECEIPT," and clearly state the amount received, mode, and date, plus remaining balance if it's a partial payment.
- Both are generated from the *same* invoice record — no separate receipt data entry needed. A receipt can be generated (and re-generated) any time payment status changes.

#### 5.3.2 Print-ready PDF layout
- Page size: **A4**, portrait, print-optimized margins (so it prints cleanly on a standard printer, one page for a normal invoice).
- Layout (top to bottom):
  1. **Letterhead:** TSW logo (top-left or centered), studio contact info (phone/email/address — configurable in Settings), Invoice/Receipt title + number + date on the right
  2. **Bill To:** client name, address, WhatsApp/phone
  3. **Line items table:** clean bordered/striped table — Description | Qty | Rate | Amount
  4. **Totals block:** Subtotal, Discount, Tax, Grand Total — right-aligned, Grand Total emphasized
  5. **Payment summary:** Amount Paid, Balance Due, Payment Status badge
  6. **Notes/Terms**
  7. **Footer:** thank-you note + studio tagline, matching the TSW brand
- Must render identically for on-screen preview, PDF download, and the file sent over WhatsApp (single source of truth — one PDF generator).

### 5.4 Payment Reminders (WhatsApp)
- Available wherever a pending invoice appears (Dashboard, Invoice list, Invoice detail).
- Tapping **"Send Reminder"** opens a pre-filled WhatsApp message (via `wa.me` deep link using the client's stored WhatsApp number) with an editable template, e.g.:

  > Hi {Client Name}, this is a gentle reminder that ₹{Balance Due} is pending for Invoice #{Invoice No.} ({Service}) with The Shubh Wedding. Kindly complete the payment at your convenience. Thank you! 🙏

- Owner reviews/edits the message in WhatsApp before hitting send (standard `wa.me` behavior — no backend WhatsApp Business API required for v1, keeping this simple and free).

### 5.5 Send Invoice/Receipt via WhatsApp
- "Send via WhatsApp" generates the PDF, then opens WhatsApp (Web/App via `wa.me` link) to the client's number with a pre-filled text message; the PDF is attached by the owner from their downloads (browser-based WhatsApp sharing cannot auto-attach a file without WhatsApp Business API).
- **Recommended v1 approach:** auto-download the PDF + auto-open the WhatsApp chat with a pre-filled message like "Hi {Name}, please find your invoice attached 🙏" so the owner just needs to tap the attach icon once.
- **v2 enhancement (optional, flagged below):** integrate WhatsApp Business API/Cloud API to send the PDF automatically without manual attach — costs money and needs a Meta Business account, so kept out of v1 to stay simple.

### 5.6 Reports
Simple, filterable reporting — no BI complexity.

- Date range filter (this month / last month / custom range / all time)
- Total Revenue Collected in range
- Total Pending in range
- Invoice count by status (Paid / Partially Paid / Pending / Overdue) — simple chart
- Top clients by revenue (list, top 5–10)
- Exportable table of all invoices in the selected range → **Export to CSV/Excel** and **Export to PDF**

---

## 6. Data Model (suggested)

**Client**
`id, name, service, amount, address, whatsapp_number, email (optional), notes, created_at`

**Invoice**
`id, invoice_number, client_id (FK), invoice_date, due_date, status (draft/sent/partial/paid/overdue), subtotal, discount, tax, grand_total, amount_paid, balance_due, payment_mode, notes, last_edited_at, created_at`

**InvoiceLineItem**
`id, invoice_id (FK), description, quantity, rate, amount, sort_order`

**StudioSettings** (single row — owner's business info for the letterhead)
`studio_name, logo_url, favicon_url, address, phone, email, default_terms, tax_default_percent`

---

## 7. Non-Functional Requirements
- **Responsive**, works well on both desktop (primary, for invoice creation) and mobile (for quick dashboard/reminder checks on the go).
- Fast PDF generation (< 2 seconds).
- All data persisted reliably (no data loss on refresh/navigation away from a form — warn before discarding unsaved edits).
- Simple, single-login authentication (email+password is enough).
- Clean empty states (e.g., "No clients yet — add your first client" with a CTA).

---

## 8. Nice-to-Have Enhancements (only if they stay simple — optional, not required for v1)
- Auto-numbering with a customizable prefix (e.g. `TSW-2026-001`).
- Studio Settings page to edit letterhead info, default tax %, default invoice terms/notes template, and reminder message template.
- Dark/soft "night" theme toggle.
- Simple dashboard filter: "This Month" vs "All Time."
- Invoice status auto-flips to "Overdue" automatically if Due Date has passed and Balance Due > 0.
- "Duplicate Invoice" for repeat clients.

Do **not** add anything beyond this list without checking back — the brief is intentionally kept to four modules and one clean workflow: **Client → Invoice → PDF → WhatsApp → Paid.**

---

## 9. Suggested Tech Stack (for the build agent)
- **Frontend:** React + Tailwind CSS (clean component styling matching §4.1 tokens)
- **PDF generation:** a client- or server-side HTML-to-PDF renderer (e.g. `react-pdf`, Puppeteer, or an equivalent) producing the A4 layout in §5.3.2
- **Backend/DB:** any lightweight stack is fine — e.g. Node/Express + PostgreSQL, or a BaaS like Supabase/Firebase, to minimize setup overhead
- **WhatsApp integration (v1):** `wa.me` deep links (no paid API required)
- **Auth:** simple email/password session auth
- **Hosting:** any standard web host (Vercel/Netlify for frontend, Render/Railway/Supabase for backend)

---

## 10. Build Prompt (paste directly into your AI coding agent)

> Build a lightweight, elegant CRM web app called **"TSW CRM"** for a wedding photography studio, **The Shubh Wedding**. The app has exactly four modules: **Dashboard, Clients, Invoices, Reports.** Do not add any modules beyond these four.
>
> **Clients module:** a form to add/edit clients with fields — Name, Service, Amount, Address, WhatsApp Number (Email and Notes optional) — plus a searchable client list and a client detail page showing their invoices.
>
> **Invoices module:** create and edit invoices at any time, even after marked paid. Each invoice has a client, invoice/due dates, an unlimited-row line-items table (description, qty, rate, amount, with an "Add Service" button), auto-calculated subtotal/discount/tax/grand total, and payment tracking (amount paid, balance due, status: Draft/Sent/Partially Paid/Paid/Overdue). Generate a clean, professional, **print-ready A4 PDF** for both the **Invoice** and a **Receipt** (same data, receipt shows amount received + remaining balance), styled like a real studio letterhead using the provided TSW logo. Add a **"Send via WhatsApp"** action that generates the PDF and opens a `wa.me` chat to the client's stored number with a pre-filled message, ready for the PDF to be attached. Add a **"Send Reminder"** action (enabled whenever balance due > 0) that opens a `wa.me` chat with a pre-filled payment reminder message including the client name, invoice number, and pending amount.
>
> **Dashboard module:** show total revenue collected, total pending, client count, invoice counts by status, a recent-invoices list, a pending-payments list (each row with a one-tap Send Reminder button), and a simple 6-month revenue trend chart.
>
> **Reports module:** date-range filterable revenue/pending totals, invoice counts by status, top clients by revenue, and CSV/PDF export of the invoice list.
>
> **Design:** light, minimal, elegant — not a generic SaaS dashboard. Use an ivory background (`#FAF8F5`), charcoal text (`#3A3A3A`), a muted gold accent (`#B8935F`), soft sage/terracotta/brick status colors for paid/pending/overdue, a serif font for headings/the wordmark (echoing the provided TSW logo) and a clean sans-serif for body/UI text. Generous whitespace, thin hairline dividers, soft shadows, rounded corners. Use the provided `Logo-01.png` as the app header/sidebar logo and on invoice/receipt letterheads, and `Favicon-01.png` as the browser favicon.
>
> Keep the entire build simple and focused — single studio-owner login, no payment gateway, no email sending, no scheduling/CRM pipeline features. The full user journey is: add a client → create an invoice with multiple services → download/send the PDF invoice on WhatsApp → mark payment received (fully or partially) → send a WhatsApp reminder if still pending → generate a receipt once paid.

---

## 11. Open Questions for the Studio (answer before/while building)
- Should GST/Tax be on by default, or off unless toggled per invoice?
- Any fixed studio address/phone/email to hardcode into the letterhead (Settings)?
- Preferred invoice numbering format (e.g. `TSW-001`, `TSW/2026/001`, financial-year based)?
- Should "Service" on the Client form be a fixed dropdown (e.g. Wedding / Pre-Wedding / Engagement / Reception / Other) or free text?
