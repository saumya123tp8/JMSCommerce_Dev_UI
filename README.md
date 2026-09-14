# JMSCommerce — Production-Ready E-Commerce Platform

The **JMSCommerce frontend** is a modern React-based e-commerce
application that provides the complete customer and administrative
interface for the JMSCommerce backend.

It delivers a responsive shopping experience covering **authentication,
product discovery, variants, customization, cart, checkout, payments,
orders, reviews, customer reports, profile management, and admin
operations**.

### 🚀 Live Demo
**[https://jmscommerce.in](https://jmscommerce.in)**

### 💻 Source Code

- **Backend:** [JMSCommerce_dev](https://github.com/saumya123tp8/JMSCommerce_dev)
- **Frontend:** [JMSCommerce_Dev_UI](https://github.com/saumya123tp8/JMSCommerce_Dev_UI)

---

## 🔐 Test Credentials
- **ADMIN**
- **Email:** `testadmin@gmai.com`
- **Password:** `Admin@123`

- **USER - use this or register/google Oauth**
- **Email:** `tonystark123@gmail.com`
- **Password:** `TonyStark@123`


## ⭐ Why This Project?

JMSCommerce was designed beyond a basic CRUD e-commerce application, with a focus on:

- **Scalable data access and caching**
- **Concurrency-safe inventory management**
- **Failure-resilient payment processing**
- **Secure authentication and authorization**
- **Transactional business workflows**
- **Production deployment using Docker and AWS**
- **Maintainable domain-driven backend design**

---
------------------------------------------------------------------------

## ✨ Features

### 🛍️ Customer Experience

-   Product browsing and discovery
-   Category-based product filtering
-   Product details and variant selection
-   Product customization
-   Shopping cart
-   Checkout
-   Cash on Delivery (COD)
-   Online payment through Razorpay
-   Order history and order details
-   Product reviews
-   Customer support/order reports
-   User profile and address management

### 🔐 Authentication

-   JWT-based authentication
-   Access and refresh token handling
-   Google OAuth2 login
-   Protected routes
-   Role-based UI access
-   Authentication state management
-   Email/phone verification states

### 👨‍💼 Admin Dashboard

-   Product management
-   Category management
-   Brand management
-   Variant management
-   Customization management
-   Order management
-   Payment/order monitoring
-   Customer reports
-   Review management
-   Administrative operations

------------------------------------------------------------------------

# 🏗️ Frontend Architecture

The frontend follows a component-driven React architecture:

``` text
                        ┌─────────────────────┐
                        │      React UI       │
                        └──────────┬──────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
              ┌──────────────┐           ┌──────────────┐
              │    Pages     │           │  Components  │
              └──────┬───────┘           └──────┬───────┘
                     │                          │
                     └────────────┬─────────────┘
                                  ▼
                         ┌────────────────┐
                         │ Custom Hooks   │
                         └───────┬────────┘
                                 ▼
                         ┌────────────────┐
                         │   Services     │
                         │   API Layer    │
                         └───────┬────────┘
                                 ▼
                         ┌────────────────┐
                         │ Spring Boot    │
                         │ REST API       │
                         └────────────────┘
```

The UI is separated from API communication so that business-facing
components do not directly manage HTTP requests throughout the
application.

------------------------------------------------------------------------

# 📁 Project Structure

``` text
src/
├── assets/
│
├── components/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── review/
│   ├── admin/
│   └── ui/
│
├── hooks/
│   ├── useHomeProducts
│   ├── usePagedList
│   ├── useMyOrders
│   └── ...
│
├── pages/
│   ├── Home
│   ├── Product
│   ├── Cart
│   ├── Checkout
│   ├── Orders
│   ├── Profile
│   ├── Auth
│   └── Admin
│
├── Service/
│   ├── AuthServices
│   ├── ProductServices
│   ├── CartServices
│   ├── OrderServices
│   ├── ReviewServices
│   └── ...
│
├── lib/
│   ├── apiError
│   └── ...
│
├── routes/
│
├── App.tsx
└── main.tsx
```

------------------------------------------------------------------------

# 🧩 Application Flow

``` text
User
 │
 ▼
React Page
 │
 ▼
Reusable Component
 │
 ▼
Custom Hook
 │
 ▼
Service / API Layer
 │
 ▼
Spring Boot REST API
 │
 ▼
JSON Response
 │
 ▼
Hook / State
 │
 ▼
React UI
```

This separation keeps API communication, state handling, and
presentation concerns easier to maintain.

------------------------------------------------------------------------


# 🔐 Authentication Flow

``` text
Login
  │
  ▼
Backend Authentication
  │
  ▼
Access + Refresh Token
  │
  ▼
Frontend Auth State
  │
  ▼
Protected API Requests
```

OAuth2 login follows the backend-provided success/failure flow.

Protected application areas are restricted based on authentication and
user roles.

------------------------------------------------------------------------

# 🧭 Routing

The application uses client-side routing for:

``` text
/
├── Authentication
│   ├── Login
│   ├── Register
│   └── OAuth Callback
│
├── Customer
│   ├── Products
│   ├── Product Details
│   ├── Cart
│   ├── Checkout
│   ├── Orders
│   ├── Reviews
│   ├── Reports
│   └── Profile
│
└── Admin
    ├── Dashboard
    ├── Products
    ├── Categories
    ├── Brands
    ├── Inventory
    ├── Orders
    ├── Reviews
    └── Reports
```

Protected routes ensure authenticated users can access customer-specific
resources, while administrative routes are restricted by role.

------------------------------------------------------------------------

# ⚡ Data Fetching & Custom Hooks

Reusable hooks encapsulate API-driven state and UI behavior.

Examples include:

``` text
useHomeProducts
usePagedList
useMyOrders
```

This approach keeps pages focused on presentation while reusable hooks
handle:

-   Loading state
-   API requests
-   Pagination
-   Data state
-   Error handling
-   Refetching

------------------------------------------------------------------------

# 📄 Pagination

The frontend supports paginated product/data views.

Pagination logic is separated into reusable hooks/components where
possible, allowing the same pattern to be reused across different
listing pages.

``` text
Page
 │
 ▼
usePagedList
 │
 ▼
Service
 │
 ▼
Backend API
 │
 ▼
Paginated Response
 │
 ▼
UI
```
## 👨‍💻 Author

**Saumya Keservani**

-   GitHub: https://github.com/saumya123tp8
-   LinkedIn: https://www.linkedin.com/in/saumya-keservani-416136202/

------------------------------------------------------------------------

⭐ If you find the project useful, consider giving it a star.
