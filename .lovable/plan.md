

# GrowthPal DataVision — Dashboard + Mandates (UI First)

## Overview
Build the core M&A intelligence platform with a clean light theme, mock data, and the primary workflow: Dashboard → Mandates → Company Profiles.

---

## 1. App Layout & Navigation
- **Collapsible side panel** with navigation: Home, Mandates, Pipeline/CRM, Projects, Deliverables, Watchlist, Support
- **Top header** with: company logo ("GrowthPal"), global search bar, notification bell icon, and user profile dropdown (with logout)
- Clean light theme with professional SaaS styling

## 2. Dashboard (Home Page)
- **Active Mandates section** — cards showing each mandate's title, strategy, and summary criteria
- **Recommended Companies section** — horizontal scrollable list of company cards (logo, name, brief description)
- **Key News section** — news feed cards with headlines related to M&A, industry news (mock data)
- Optional strapline/ticker below header for latest deal announcements

## 3. Mandates Dashboard
- **Table view** of all mandates with columns: Title, Strategy, Capabilities, Partners, Verticals, Revenue Geo, Delivery Geo, People Scale, Est. Revenue, HQ
- **Action buttons**: Create New Mandate, Delete, Edit
- Each mandate row expandable/clickable with created/updated metadata
- **Graphical funnel** below the table showing numeric breakdown of matching companies
- Column filtering and sorting

## 4. Create New Mandate (Form Page)
- Multi-field form: Title, Strategic Goal (dropdown: Revenue Acquisition, Team Acquisition, etc.), Capabilities, Technology Partners, Verticals, Revenue Geo, Delivery Geo, People Scale/Revenue range, Go-to-Market type, Description
- **Live funnel preview** on the right side that updates as filters are filled
- Drag-and-drop reordering of criteria (except top strategy field)
- Reset Form and Create Mandate buttons

## 5. Mandate Detail View
- **Top section**: Mandate metadata (title, strategy, description) with Edit button
- **Editable filter sections**: Capabilities, Partners, Verticals, Revenue Geo, Delivery Geo, People/Revenue, Go-to-Market — each with inline edit + Apply
- **Tabs**: All Recommendations | Pipeline | Shortlisted | Declined
- **Company table** with columns: Name, HQ, Capabilities, Partners, Verticals, Delivery Geo, Customers, People, Revenue, Actions (Pipeline/Shortlist/Decline buttons)
- Export to Excel button
- Search bar for filtering companies

## 6. Company Profile View
- Accessible from mandate detail, pipeline, or search
- **Summary header**: Company logo, name, description, HQ, people count, social links, website
- **Action buttons**: Pipeline, Shortlisted, Declined, Download Profile
- **M&A Score** widget on left side with View Score button
- **Tabbed sections**: Company Overview, Intent Analysis, Company Profile (services, partners, delivery geo, revenue, verticals, skills, customers, investors), Management Profile, News, M&A Intent
- M&A Intent section with scores: Founder Liquidity, Stagnation, Activity, Partner Acquisition — each with detailed analysis text

## 7. Notification Side Panel
- Slide-out panel from bell icon
- Notification cards for: Mandate, Pipeline, Profile, Deliverables, Watchlist updates
- Each showing action type (created/updated/deleted), timestamp, and who made the change
- "View All" link

## 8. Mock Data
- 8-10 sample companies with realistic M&A data (names, capabilities, revenue, HQ, etc.)
- 3-4 sample mandates with different strategies
- Sample news articles and M&A scores

