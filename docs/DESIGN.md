# Stitch Design Analysis: EduMetrics Analytics Platform

This document captures the design system tokens, palettes, typography, spacing, and structural components extracted from the Stitch visual source of truth.

---

## 1. Design System Overview
*   **Design Paradigm:** Modern Corporate Minimalism
*   **Theme Name:** Lumina Analytics
*   **Target Device:** Desktop (1280px / 2560px grid width)
*   **Aesthetic Tone:** Authoritative, clean, professional SaaS interface with high information density.

---

## 1.5. Screen Inventory
The application design is built across 6 target layout designs:

1.  **Student Dashboard (Desktop - `d0dc43cbbd6a4f4781f515d069e31aac`):** The primary view displaying the student performance directory table ( Telugu, Hindi, English, Social averages), search functionality, and the sticky right drawer housing live Chart.js trend lines for the checked student.
2.  **Manage Student (Desktop - `159ea40ddbd24fcea4e605cc729b1f85`):** The form layout for creating/editing a student. Contains profile info fields on the left (Name, Age, Class selection) and a detailed monthly academic score input grid (January - June) on the right for Telugu, Hindi, English, and Social Studies.
3.  **Dashboard - States (Empty/Loading) (Desktop - `5ef4c86bdabd4d1daa4707db174a089c`):** Skeleton UI components and empty data message states for the dashboard cards and table.
4.  **Login - Student Analytics (Desktop - `c60ff0e7db2641aa90fc0b5ba2e01093`):** Secure login portal screen featuring institution branding, username/password fields, visual FERPA/Shield status indicators, and background radial gradient styling.
5.  **Dashboard - Mobile View (Mobile - `6e6333aa69334ca88fe7dd6218a4bfc3`):** Responsive fluid view of the main dashboard listing and pagination controls adapted to mobile screens.
6.  **Login - Mobile View (Mobile - `e657befe6430470a9b366ffae9b0e7f2`):** Responsive login screen layout optimized for mobile screens.

---

## 2. Color Palette
The colors are selected to keep the focus on student performance data. A desaturated gray/slate base is combined with rich purple and blue accents to define visual hierarchy.

| Token | HSL / Hex | Usage Description |
| :--- | :--- | :--- |
| **Primary** | `#3525CD` / `#4F46E5` | Active items, main buttons, primary interactions. |
| **Secondary** | `#006591` / `#0EA5E9` | Secondary actions, informative metrics, secondary charts. |
| **Tertiary** | `#7E3000` / `#A44100` | Accent badges, category metrics. |
| **Background** | `#F8F9FF` | Main application canvas background. |
| **Surface** | `#FFFFFF` | Cards, input fields, containers. |
| **Surface Dim** | `#CBDBF5` | Darkened variant of surface panels. |
| **Surface Container** | `#E5EEFF` | Table headers, sidebars, active container segments. |
| **Surface Container Low** | `#EFF4FF` | Hover states, secondary panels. |
| **Surface Container Lowest**| `#FFFFFF` | Core content panels (e.g., active table rows). |
| **Outline** | `#777587` | Borders, secondary dividers. |
| **Outline Variant** | `#C7C4D8` | Muted borders, low-contrast lines. |
| **On-Surface** | `#0B1C30` | Core text body, bold titles. |
| **On-Surface Variant** | `#464555` | Secondary text, descriptors, labels. |
| **Error** | `#BA1A1A` | Validation errors, delete actions, negative trends. |

---

## 3. Typography
The system uses the **Inter** font family exclusively to ensure readability in data-heavy layouts.

| Typography Token | Font Size | Line Height | Font Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-lg` | `32px` | `40px` | `600` | `-0.02em` | Page header / High-level stats |
| `headline-md` | `24px` | `32px` | `600` | `-0.01em` | Section headers |
| `headline-sm` | `20px` | `28px` | `600` | `Normal` | Card titles / Modal headers |
| `body-lg` | `16px` | `24px` | `400` | `Normal` | Primary readable paragraphs |
| `body-md` | `14px` | `20px` | `400` | `Normal` | Table contents / Small descriptors |
| `label-md` | `12px` | `16px` | `500` | `0.02em` | Secondary details / Badges |
| `label-sm` | `11px` | `14px` | `600` | `Normal` | Table column headers / Metadata |

---

## 4. Spacing & Shape System
Spacing scale and corner roundness variables are designed to maintain a clean structure.

### Spacing Scale
*   `stack-xs` (4px): Micro gap (elements inside badges).
*   `stack-sm` (8px): Minor gap (row/column list items, checkboxes).
*   `stack-md` (16px): Standard gap (card content paddings, form inputs).
*   `stack-lg` (24px): Large gap (section transitions, page title spacing).
*   `sidebar-width` (240px): Fixed navigation sidebar width.
*   `container-max` (1440px): Maximum fluid width of the main content zone.

### Shape Scale (Border Radius)
*   `rounded-sm` (4px / `0.25rem`): Checkboxes, badge indicators.
*   `rounded-md` (8px / `0.5rem`): Buttons, text inputs, table rows.
*   `rounded-xl` (12px / `0.75rem`): Main content cards, modals.

---

## 5. Layout Structure
The interface utilizes a **Hybrid-Fluid Sidebar Layout**:
1.  **Sidebar (Left):** 240px width, sticky vertical container containing app logo, primary pages navigation, and bottom utility items (Settings, Support, Profile/Logout).
2.  **Top Bar (Header):** Fixed header containing search bar, notification center, and current user avatar dropdown.
3.  **Split Main Screen:**
    *   **Left Column (Fluid):** Primary data view. Displays page title, primary CTA button ("Add Student"), and the student database table with pagination controls.
    *   **Right Column (Fixed - 380px):** Contextual side drawer displaying detailed profile metrics (Rank, Attendance) and performance charts for the currently selected student.

---

## 6. Component Inventory

### Side Navigation
*   **Container:** `w-sidebar-width bg-surface-container-lowest border-r`
*   **Nav Link:** Rounded hover states using `hover:bg-surface-container hover:text-primary` with interactive icon support.

### Top Bar
*   **Search Bar:** Muted border input `bg-surface-container-low` with search prefix icon.
*   **Notification Bell:** Icon badge with red warning dot on new events.

### Data Table
*   **Headers:** Uppercase labels with light gray backgrounds (`bg-surface-container-low`).
*   **Rows:** Interactive elements. Row click toggles checkbox and shifts style to `.active-row` (adds Left Border + Light Blue Background tint).
*   **Status Badges:** Text indicators for subject averages (e.g. `bg-secondary-container/20 text-on-secondary-container`).

### Context Panel (Analytics Drawer)
*   **Header Profile Card:** Centered profile image with custom star rank indicator and summary badges.
*   **Metric Grid:** Split row detailing rank and attendance percentage.
*   **Chart Cards:** Individual containers for line charts, featuring:
    *   Subject label (Left)
    *   Performance change indicator (Right: Green upward text/Red downward text)
    *   Linear/Area trend chart with a soft background gradient fade.
