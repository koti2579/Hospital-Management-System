# Hospital Management System (HMS)

A comprehensive, full-stack Hospital Management System designed to streamline hospital operations across multiple departments. This system provides a centralized platform for managing patients, staff, prescriptions, laboratory tests, and pharmacy inventory.

## 🚀 Overview

The Hospital Management System is built using the MERN stack (MongoDB, Express.js, React.js, Node.js). it features a role-based access control system that ensures secure and efficient workflows for different hospital stakeholders.

## 🛠 Technical Stack

### Frontend
- **Framework**: React.js (v19)
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: CSS3 with custom dashboard layouts
- **Data Visualization**: Chart.js & React-Chartjs-2
- **Icons**: Lucide-React & React-Icons
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt.js for password hashing
- **Middleware**: CORS, Dotenv

---

## 📂 Project Structure

```text
Hospital-Management-System/
├── backend/                # Express.js Backend Application
│   ├── config/             # Database and Query configurations
│   │   ├── queries/        # Mongoose-based database query abstractions
│   │   └── db.js           # MongoDB connection logic
│   ├── models/             # Mongoose Data Models (User, Patient, etc.)
│   ├── routes/             # API Route definitions for different roles
│   ├── index.js            # Main entry point for the backend
│   ├── seed.js             # Database seeding script for initial data
│   └── package.json        # Backend dependencies and scripts
├── frontend/               # React.js Frontend Application
│   ├── public/             # Static assets (HTML, Icons)
│   ├── src/                # React Source Code
│   │   ├── components/     # UI Components and Dashboard layouts
│   │   ├── App.js          # Main React component and Routing
│   │   └── index.js        # Frontend entry point
│   ├── .gitignore          # Frontend git ignore rules
│   └── package.json        # Frontend dependencies and scripts
├── .gitignore              # Root git ignore rules
└── README.md               # Project documentation (You are here)
```

---

## ✨ Core Features

### 👤 Role-Based Dashboards
- **Admin**: Manage hospital staff, view real-time statistics, and monitor system-wide data.
- **Receptionist**: Register new patients, manage patient records, and handle administrative entries.
- **Doctor**: View patient history, record vitals, and issue digital prescriptions.
- **Lab Technician**: Manage laboratory test requests, update results, and track test statuses.
- **Pharmacist**: Monitor medicine inventory, manage prescriptions, and handle medicine dispensing.

### 📊 Key Functionalities
- **Secure Authentication**: Login system with encrypted passwords and token-based sessions.
- **Real-time Analytics**: Visual representation of patient demographics and hospital status using charts.
- **Inventory Management**: Track medicine stock levels with low-stock alerts.
- **Integrated Workflow**: Seamless data flow from reception to doctor, lab, and pharmacy.

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/koti2579/Hospital-Management-System.git
cd Hospital-Management-System
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hms_db
   JWT_SECRET=your_jwt_secret_key
   ```
4. Seed the database (Optional but recommended for testing):
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 🔑 Default Credentials (Seed Data)

If you ran the `seed.js` script, you can use the following credentials to explore the system:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **Reception** | `reception` | `reception123` |
| **Doctor** | `doctor1` | `doctor123` |
| **Lab** | `lab` | `lab123` |
| **Pharmacy** | `pharmacy` | `pharmacy123` |

---

## 🤝 Contribution Guidelines

We welcome contributions to improve the Hospital Management System!

1. **Fork** the repository.
2. Create a new **branch** (`git checkout -b feature/your-feature`).
3. **Commit** your changes (`git commit -m 'Add some feature'`).
4. **Push** to the branch (`git push origin feature/your-feature`).
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the ISC License.
