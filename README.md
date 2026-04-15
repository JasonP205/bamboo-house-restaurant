# Bamboo House Restaurant Management System

## Table of Contents
1. [INTRODUCTION](#1-introduction)
2. [SYSTEM DEVELOPMENT PROCESS](#2-system-development-process)
   1. [Design the Interface of the Pages](#21-design-the-interface-of-the-pages)
   2. [Navigation Structure](#22-navigation-structure)
3. [UTILIZED TECHNOLOGY](#3-utilized-technology)
   1. [Front-end Development](#31-front-end-development)
   2. [Back-end Technology](#32-back-end-technology)
   3. [Database Management System](#33-database-management-system)
   4. [Justifications for Technology Choices](#34-justifications-for-technology-choices)
4. [LEGAL, SOCIAL, AND ETHICAL ISSUES](#4-legal-social-and-ethical-issues)
   1. [Compliance with GDPR and Data Privacy Standards](#41-compliance-with-gdpr-and-data-privacy-standards)
   2. [Ethical Issues in System Design](#42-ethical-issues-in-system-design)
   3. [Social Impact of the System](#43-social-impact-of-the-system)
5. [SYSTEM OVERVIEW: COMPREHENSIVE INTERFACE AND FUNCTIONALITY ANALYSIS](#5-system-overview-comprehensive-interface-and-functionality-analysis)
6. [TESTING AND EVALUATION](#6-testing-and-evaluation)
   1. [Current Testing Strategy](#61-current-testing-strategy)
   2. [Detailed Test Cases](#62-detailed-test-cases)
   3. [Analysis and Evaluation of Comprehensive Test Results](#63-analysis-and-evaluation-of-comprehensive-test-results)
7. [CONCLUSION AND EVALUATION](#7-conclusion-and-evaluation)
   1. [Project Conclusion](#71-project-conclusion)
   2. [System Strengths](#72-system-strengths)
   3. [Limitations and Future Improvements](#73-limitations-and-future-improvements)
   4. [Personal Reflection](#74-personal-reflection)

---

## 1. INTRODUCTION

The Bamboo House Restaurant Management System is a full-stack web platform designed to digitize and coordinate daily operations in a multi-branch restaurant business. The project combines two major user experiences:

- An internal staff and manager workspace for branch management, menu maintenance, order monitoring, and staff administration.
- A customer-facing ordering interface accessed through table-specific QR links.

The system was developed as a practical software engineering project with a strong emphasis on usability, role-based access, bilingual support, and real-time synchronization between customers and staff.

At a functional level, the platform addresses key operational pain points in restaurant environments:

- Delays and communication errors between table service and kitchen/staff.
- Difficulty tracking branch-level resources (tables, staff, active orders).
- Inefficient update cycles for menu items and dish availability.
- Lack of unified historical records for completed orders.

By integrating REST APIs, WebSocket communication, and structured data models, the project provides a cohesive workflow from order creation to completion while maintaining a clear separation between public, customer, and authenticated staff spaces.

---

## 2. SYSTEM DEVELOPMENT PROCESS

The development process followed an iterative and feature-driven approach. Core modules were delivered in vertical slices (authentication, branch management, menu management, ordering, and history), then refined through integration and interface consistency improvements.

### 2.1. Design the Interface of the Pages

The interface design process was organized around user roles and primary tasks.

**Phase A: Role and journey definition**

- Public visitor journey: discover brand information and access staff login.
- Staff journey: authenticate quickly, monitor incoming orders in real time, update order status.
- Manager journey: manage branches, tables, menu items, and staff profiles.
- Customer journey: scan table QR, browse dishes, customize quantity/notes, place order.

**Phase B: Information architecture and screen grouping**

Screens were grouped into six practical families:

1. Public and authentication pages.
2. Branch administration pages.
3. Menu and dish maintenance pages.
4. Customer ordering pages.
5. Staff order-monitoring pages.
6. History and profile pages.

**Phase C: Component strategy**

The frontend uses reusable components to maintain design consistency and speed up delivery:

- Form-focused components for image upload, numeric input, and select fields.
- Dialog and modal components for create/edit/delete actions.
- Skeleton components for better perceived performance during async loading.
- Shared UI controls for language and theme.

**Phase D: Validation and feedback model**

- Form validation is implemented with Zod and react-hook-form.
- API success and failure states are communicated by toast notifications.
- Loading states are surfaced through skeletons and button loading indicators.

**Phase E: Responsive and multilingual design**

- Layouts adapt from single-column mobile views to multi-column desktop dashboards.
- Interface text is localized in English and Vietnamese using i18next namespaces.

### 2.2 Navigation Structure

Navigation is implemented with React Router and protected route boundaries.

**Main route groups**

- Public: `/`, `/auth/login`, `/login-callback`
- Protected staff/manager: `/branches`, `/branches/:branchId`, `/menu`, `/menu/:dishId`, `/orders`, `/history`, `/staff/:staffId`
- Customer ordering: `/order?b=<branchId>&t=<tableId>`

**Access control design**

- Unauthenticated access to protected routes is intercepted by the protected route layer.
- After login, role and branch context are stored in client state.
- Manager-oriented workflows are centered around branch and menu administration.
- Staff-oriented workflows are centered around active order monitoring.

**Operational navigation logic**

- Manager can navigate from branch list to branch detail tabs (overview, tables, staff, history).
- Staff can jump from table cards to order detail views and status updates.
- Customer can browse dishes by category, open dish detail modal, and confirm order from cart.

---

## 3. UTILIZED TECHNOLOGY

### 3.1 Front-end Development

The frontend is built with modern React and TypeScript tooling.

**Core framework and runtime**

- React 19
- TypeScript 5
- Vite 8

**UI, styling, and interaction**

- HeroUI v3 (`@heroui/react`, `@heroui/styles`)
- Tailwind CSS v4 and `@tailwindcss/vite`
- Framer Motion and Motion for animation
- Lucide and Hugeicons for iconography

**State, forms, and validation**

- Zustand for global state slices (auth, branch, menu, order, socket)
- react-hook-form for form orchestration
- Zod for schema validation

**Networking and localization**

- Axios for API client and interceptor strategy
- socket.io-client for real-time events
- i18next + react-i18next + language detector + HTTP backend for EN/VI localization

### 3.2 Back-end Technology

The backend follows an Express-based API architecture with integrated real-time communication.

**Server stack**

- Node.js (ES modules)
- Express 5
- CORS and cookie-parser middleware
- dotenv for environment management

**Authentication and authorization**

- JSON Web Token (JWT) for access tokens
- Refresh session records stored in database
- bcrypt for password and sensitive-code verification
- Passport with Google OAuth 2.0 strategy

**Realtime, file handling, and external services**

- Socket.IO for branch/table room updates
- Multer for file upload handling
- Cloudinary for image storage
- DeepL API client for bilingual text support in menu workflows

### 3.3 Database Management System

The project uses MongoDB with Mongoose as the ODM layer.

**Data model characteristics**

- Document-oriented schemas for Branch, Table, Dish, Order, Staff, and Session domains.
- Flexible nested fields for bilingual content and order item structures.
- Reference-based relationships where needed (for example, staff and branch linkage).
- TTL behavior for session lifecycle management.

**Why MongoDB fits this project**

- Supports fast iteration in a student project context with evolving schemas.
- Represents variable restaurant data (dish metadata, optional notes, status fields) naturally.
- Integrates smoothly with JavaScript/TypeScript application stacks.

### 3.4 Justifications for Technology Choices

Technology choices were guided by practical delivery constraints and functional requirements.

- React + Vite provides fast feedback during UI iteration and reliable build output.
- TypeScript improves maintainability and reduces type-related integration errors.
- Zustand is lightweight and suitable for modular store design without heavy boilerplate.
- Express + Mongoose accelerates backend feature delivery with clear route-controller-model separation.
- Socket.IO is essential for time-sensitive order synchronization between customer and staff views.
- HeroUI and Tailwind allow rapid component assembly while preserving responsive consistency.
- i18next directly supports the bilingual deployment requirement.

In summary, the selected stack balances developer productivity, maintainability, and real-world restaurant workflow needs.

---

## 4. LEGAL, SOCIAL, AND ETHICAL ISSUES

### 4.1 Compliance with GDPR and Data Privacy Standards

The system stores and processes personal and operational data, including staff profile information, authentication sessions, and order records. The following GDPR-aligned considerations are relevant:

- **Data minimization**: only role-relevant staff information and order context should be collected.
- **Purpose limitation**: stored data should be used strictly for restaurant operation and administration.
- **Storage limitation**: session TTL mechanisms support bounded retention for authentication artifacts.
- **Security controls**: httpOnly cookie usage and token-based authorization reduce certain client-side leakage risks.

However, full GDPR compliance requires additional operational controls not yet formalized in this codebase, such as:

- Explicit consent and privacy notice flows.
- Data subject request handling (access, rectification, erasure).
- Documented retention policy for historical operational data.
- Auditable incident response and logging procedures.

### 4.2 Ethical Issues in System Design

Several ethical and engineering concerns emerge from the current implementation profile:

- **Authorization consistency**: HTTP endpoints use token middleware, but realtime socket access requires stronger identity guarantees to prevent room misuse.
- **Input and abuse protection**: rate limiting and deeper input validation are needed to reduce brute-force and malformed-request risks.
- **Fairness and usability**: role-based restrictions should remain transparent to avoid hidden privilege barriers for staff.
- **Operational accountability**: system actions that affect orders and staff records should be traceable through proper audit logs.

Addressing these concerns improves not only security posture but also trust between employees, managers, and customers.

### 4.3 Social Impact of the System

The platform has meaningful social and workplace effects.

**Positive impact**

- Reduces communication delays between dining tables and staff.
- Improves transparency of order status and branch operations.
- Supports multilingual interaction, improving accessibility for diverse users.

**Potential negative impact**

- Overreliance on digital workflows may challenge less technical staff members.
- Poorly governed monitoring data could create workplace pressure if used unfairly.
- Service disruptions (network issues, realtime failures) may directly affect customer experience.

A responsible rollout should include staff onboarding, fallback procedures, and clear policy boundaries around monitoring data.

---

## 5. SYSTEM OVERVIEW: COMPREHENSIVE INTERFACE AND FUNCTIONALITY ANALYSIS

This section describes each major page and functional area in detail. Screenshot placeholders are included so images can be inserted later without restructuring the narrative.

### 5.1 Landing Page (`/`)

**Objective**

Provide a public-facing introduction to the restaurant brand and direct users to the authentication entry point.

**Interface structure**

- Hero content with visual branding.
- Highlighted service and menu storytelling blocks.
- Theme toggle and language toggle controls.

**Core interactions**

- Switch language between English and Vietnamese.
- Switch theme for visual preference.
- Navigate to staff login.

**Functional notes**

- No authentication required.
- Responsive layout adapts to mobile and desktop widths.

**Figure placeholder**

- Figure 5.1: Landing Page interface and hero section.

### 5.2 Staff Login Page (`/auth/login`)

**Objective**

Authenticate staff users and route them into role-appropriate workspaces.

**Interface structure**

- Credential form (staff ID, password).
- Visibility toggle for password input.
- Loading and toast feedback states.

**Core interactions**

- Submit valid credentials.
- Handle invalid credentials with clear error messages.

**Functional notes**

- Validation with Zod and react-hook-form.
- On successful login, app state stores token and user context.

**Figure placeholder**

- Figure 5.2: Staff login form and validation state.

### 5.3 Branch Listing Page (`/branches`)

**Objective**

Allow managers to view all branches and enter branch-level management flows.

**Interface structure**

- Card grid of branches.
- Floating create-branch action.
- Skeleton loading while fetching data.

**Core interactions**

- Open branch detail by selecting a card.
- Trigger branch creation dialog.

**Functional notes**

- Branch data is loaded from the branch store/service layer.
- Empty-state messaging supports first-time setup.

**Figure placeholder**

- Figure 5.3: Branch card grid and create action.

### 5.4 Branch Detail Page (`/branches/:branchId`)

**Objective**

Provide centralized management for one branch across operational tabs.

**Interface structure**

- Header with branch identity and open/closed indicator.
- Tabbed workspace: overview, tables, staff, history.

**Core interactions by tab**

- **Overview**: view and edit metadata (address, contact, hours, map).
- **Tables**: create tables, select and delete tables, inspect capacity/status.
- **Staff**: add new staff, list existing staff, remove selected staff.
- **History**: inspect completed orders for this branch.

**Functional notes**

- Integrates branch, table, staff, and history data in one route.
- Uses modals/drawers for create and edit flows.

**Figure placeholders**

- Figure 5.4a: Branch detail overview tab.
- Figure 5.4b: Table management tab.
- Figure 5.4c: Staff management tab.

### 5.5 Menu Page (`/menu`)

**Objective**

Provide managers a searchable and filterable catalog of dishes.

**Interface structure**

- Header and create-dish entry point.
- Category filter and fuzzy search input.
- Responsive dish card grid.

**Core interactions**

- Filter dishes by category.
- Search dish names with fuzzy matching.
- Open dish detail editor.

**Functional notes**

- Search behavior adapts to current language context.
- Designed for quick catalog scanning and maintenance.

**Figure placeholder**

- Figure 5.5: Menu filtering and card layout.

### 5.6 Dish Detail Page (`/menu/:dishId`)

**Objective**

Edit, validate, and remove individual dish records.

**Interface structure**

- Bilingual name and description fields.
- Price, category, dietary tags.
- Image preview and replacement upload.

**Core interactions**

- Submit validated dish updates.
- Confirm and execute delete action.

**Functional notes**

- Strong field-level validation.
- Supports structured update payloads and media replacement.

**Figure placeholder**

- Figure 5.6: Dish detail editing form.

### 5.7 Customer Place Order Page (`/order?b=<branchId>&t=<tableId>`)

**Objective**

Enable table-based customers to browse dishes, customize selections, and submit orders.

**Interface structure**

- Category navigation and dish grid.
- Dish detail modal with quantity and note controls.
- Cart and order summary panel.

**Core interactions**

- Open dish modal and adjust quantity.
- Add/remove cart items.
- Confirm order submission.

**Functional notes**

- Requires valid branch/table query parameters.
- VAT-aware total calculation.
- Integrates with realtime cart events.

**Figure placeholders**

- Figure 5.7a: Customer menu and categories.
- Figure 5.7b: Dish detail modal and cart summary.

### 5.8 Staff Order Monitor Page (`/orders`)

**Objective**

Provide staff with a realtime dashboard of table and order activity.

**Interface structure**

- Grid of table status cards.
- Order detail modal from selected table.

**Core interactions**

- Open table order detail.
- Observe status changes as they occur.

**Functional notes**

- Combines initial API data with Socket.IO updates.
- Supports rapid decision-making during service operations.

**Figure placeholder**

- Figure 5.8: Realtime table monitor view.

### 5.9 Order History Page (`/history`)

**Objective**

Display completed orders and support bill review/reprint operations.

**Interface structure**

- Completed order cards sorted by most recent updates.
- Order bill modal with printable layout.

**Core interactions**

- Open completed order details.
- Trigger print flow for receipt output.

**Functional notes**

- Acts as an operational audit view for completed service cycles.

**Figure placeholder**

- Figure 5.9: Completed orders and bill modal.

### 5.10 Staff Profile Page (`/staff/:staffId`)

**Objective**

Allow managers to review and edit staff profile information.

**Interface structure**

- Profile form with identity and employment fields.
- Save and cancel actions.

**Core interactions**

- Update profile values with validation.
- Persist profile edits through staff service endpoints.

**Functional notes**

- Supports profile maintenance as part of branch administration.

**Figure placeholder**

- Figure 5.10: Staff profile edit form.

### 5.11 Cross-cutting Functional Analysis

**State management flow**

- Store slices separate concerns: authentication, branch, menu, order, and socket.
- UI components consume store state and dispatch actions to services.

**API integration flow**

- Axios client centralizes endpoint communication and token handling patterns.
- Controllers in backend convert requests into model operations and standardized responses.

**Realtime flow**

- Customer-side cart interactions emit socket events.
- Staff monitoring pages receive update events and refresh visual state.

**Operational value**

This design creates a continuous digital loop:

1. Customer selects dishes.
2. Order data is persisted and broadcast.
3. Staff receives updates immediately.
4. Status transitions and history records close the service cycle.

---

## 6. TESTING AND EVALUATION

### 6.1 Current Testing Strategy

The current repository does not include a formal automated test suite (for example, Jest, Vitest, or Cypress). Therefore, the effective testing strategy is based on:

- Manual functional testing of route-level features.
- Scenario-based validation of key workflows.
- Integration checks across frontend store state, API endpoints, and socket events.
- Build and lint verification to ensure deployable artifacts.

This approach is acceptable for an academic prototype stage but should be extended with automated tests for long-term reliability.

### 6.2 Detailed Test Cases

The table below organizes representative test cases by functional objective. Test IDs are generic sample identifiers.

| Test ID | Feature Area | Scenario | Input/Action | Expected Result |
| --- | --- | --- | --- | --- |
| TC-01 | Authentication | Valid login | Correct staff ID/password | Redirect to role-appropriate page, token/session context set |
| TC-02 | Authentication | Invalid login | Wrong password | Error notification, remain on login page |
| TC-03 | Navigation | Protected route guard | Access protected route while logged out | Redirect to login page |
| TC-04 | Branch Management | Create branch | Submit complete branch form with image | New branch appears in listing |
| TC-05 | Branch Management | Edit branch information | Update contact/location/hours | Branch detail reflects saved values |
| TC-06 | Table Management | Add table | Submit valid capacity | Table appears in branch table list |
| TC-07 | Staff Management | Add staff | Submit staff form | Staff member appears in staff tab |
| TC-08 | Menu Management | Create dish | Submit bilingual dish data | Dish appears in menu list |
| TC-09 | Menu Management | Filter/search dishes | Use category and search text | Dish list narrows correctly |
| TC-10 | Menu Management | Edit/delete dish | Update or delete existing dish | Changes persist or dish removed |
| TC-11 | Customer Ordering | Query parameter validation | Open `/order` without `b` or `t` | Error state shown |
| TC-12 | Customer Ordering | Add to cart and submit | Add dish, set qty/note, confirm order | Order created, cart updated/cleared as expected |
| TC-13 | Realtime Sync | Cart/order update broadcast | Modify cart from customer view | Staff monitor reflects update in near real time |
| TC-14 | Order Lifecycle | Status progression | Update order status from staff flow | Status changes reflected in monitor/history |
| TC-15 | History & Billing | View and print completed order | Open history card and print bill | Bill modal opens and print flow executes |

### 6.3 Analysis and Evaluation of Comprehensive Test Results

Because this project stage is primarily validated through manual integration testing, the following evaluation summarizes observed and inferred outcomes by feature cluster.

**Authentication and access control**

- Core login and protected route behavior is functionally coherent.
- Session refresh and token handling design is suitable for short-lived access tokens.
- Improvement area: strengthen consistency between HTTP and realtime authorization boundaries.

**Branch, table, and staff administration**

- CRUD-oriented workflows are well integrated in branch detail tabs.
- Form validation quality is good for administrative data entry.
- Improvement area: add stronger backend-side validation and audit logging for sensitive actions.

**Menu and dish management**

- Bilingual dish fields and filtering support practical manager workflows.
- Edit/delete flows are direct and supported by user feedback states.
- Improvement area: performance and pagination planning for large catalogs.

**Customer ordering and realtime synchronization**

- Customer ordering path is clear and task-focused.
- Realtime updates provide major operational value for staff responsiveness.
- Improvement area: resilience for reconnection, idempotency checks, and stronger socket identity verification.

**History and billing**

- Completed order retrieval and print-oriented bill view support end-of-service operations.
- Improvement area: add export/report features and richer analytics dimensions.

**Overall evaluation summary**

- The system demonstrates a successful end-to-end restaurant workflow prototype.
- Feature completeness is strong for a coursework-scale product.
- The primary technical debt is in automated testing coverage, security hardening, and production-grade observability.

---

## 7. CONCLUSION AND EVALUATION

### 7.1 Project Conclusion

The Bamboo House system successfully delivers an integrated restaurant operations platform with role-based management functions and a customer QR-ordering experience. The project validates that a unified web architecture can support branch administration, dish management, realtime order coordination, and historical review in one coherent product.

### 7.2 System Strengths

- Clear role-oriented workflows for manager, staff, and customer users.
- Modern frontend architecture with reusable components and strong form handling.
- Effective bilingual support through structured localization.
- Realtime synchronization that improves service responsiveness.
- Practical separation of concerns in backend route-controller-model organization.

### 7.3 Limitations and Future Improvements

Current limitations:

- No automated test suite yet.
- Security hardening remains incomplete in some realtime and validation paths.
- Monitoring, audit logging, and production observability are limited.
- Large-scale optimization features (pagination, caching strategy, analytics) are still minimal.

Recommended next-phase improvements:

1. Add automated tests (unit, integration, and end-to-end).
2. Introduce stricter socket authentication and centralized request validation.
3. Add structured logs, metrics, and error tracing.
4. Expand reporting dashboards and branch-level analytics.
5. Implement robust rate limiting and abuse protection.

### 7.4 Personal Reflection

This project demonstrates the practical value of combining software engineering theory with iterative implementation. Building Bamboo House required balancing architectural decisions, user experience constraints, and operational realism under time and scope limitations.

The development process provided key lessons:

- Clean modular architecture simplifies feature growth.
- Early validation design prevents downstream data issues.
- Realtime features add high user value but require stronger security planning.
- Academic prototypes should still be documented with production-oriented risk awareness.

Overall, the project is a meaningful foundation for future extension into a more scalable and compliance-ready restaurant platform.
