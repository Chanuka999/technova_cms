# Technova CMS - Computer Shop Management System

A comprehensive full-stack web application for managing computer shop operations including inventory, sales, customers, suppliers, and financial reporting.

## 🚀 Technology Stack

### Frontend

- **React.js 18+** - UI Framework
- **Redux Toolkit** - State Management
- **Material-UI** - Component Library
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **Vite** - Build Tool

### Backend

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password Hashing

## 📋 Features

- ✅ User Authentication & Authorization (Role-based)
- ✅ Product & Inventory Management
- ✅ Sales Order Processing
- ✅ Customer Management
- ✅ Supplier Management
- ✅ Purchase Orders
- ✅ Financial Reports & Analytics
- ✅ Dashboard with Key Metrics
- ✅ Low Stock Alerts
- ✅ Multi-payment Methods

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the server directory with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/technova_cms
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

4. Start the server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the client directory with:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
technova_cms/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Express Backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── package.json
│
└── PROJECT_PLAN.md       # Detailed project plan
```

## 🔐 User Roles

- **Admin** - Full system access
- **Manager** - Manage products, sales, reports
- **Cashier** - Process sales, view customers
- **Inventory** - Manage stock, purchase orders

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales

- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/:id` - Get sale details

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Add customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer

### Reports

- `GET /api/reports/sales` - Sales report
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/profit-loss` - Profit & Loss report
- `GET /api/reports/dashboard` - Dashboard statistics

## 🧪 Default Admin Account

For initial setup, you can create an admin account via the register endpoint:

```json
{
  "name": "Admin User",
  "email": "admin@technova.com",
  "password": "admin123456",
  "role": "admin",
  "phone": "1234567890"
}
```

## 📊 Database Models

- Users
- Products
- Categories
- Customers
- Sales
- Suppliers
- Purchase Orders
- Expenses

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation
- CORS protection
- Rate limiting
- Helmet security headers

## 🚧 Development Roadmap

### Phase 1: Setup & Authentication ✅

- Project initialization
- Database connection
- User authentication

### Phase 2: Inventory Management (In Progress)

- Product CRUD operations
- Stock tracking
- Low stock alerts

### Phase 3: Sales Management

- Sales order creation
- Invoice generation
- Payment processing

### Phase 4: Customer & Supplier Management

- Customer database
- Supplier management
- Purchase orders

### Phase 5: Financial & Reporting

- Expense tracking
- Reports generation
- Analytics dashboard

### Phase 6: Testing & Deployment

- Unit testing
- Integration testing
- Production deployment

## 📝 Contributing

This is an educational/commercial project. For contributions or modifications, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Development Team

- **Project:** Technova CMS
- **Version:** 1.0.0
- **Last Updated:** March 2, 2026

## 📞 Support

For support, email: support@technova.com

---

**Note:** Make sure MongoDB is running before starting the backend server.
