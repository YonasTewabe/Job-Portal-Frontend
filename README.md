# Job Portal Front-End (React + Vite)

A modern, responsive, and feature-rich Job Portal system built with **React**, **Vite**, and **TailwindCSS**. The frontend offers role-customized dashboards for Superadmins, Company Admins, and Job Seekers.

---

## ✨ Features

*   **Responsive Job Dashboard**: Dark-mode/light-mode ready layouts tailored for role-specific interfaces.
*   **Authentication & Auth HOCs**: Secure session management using browser cookies, routing guards, and helper higher-order components (`withAuth`).
*   **Job Seeker Workflow**:
    *   Dynamic profile builder including education and work history.
    *   Upload and view Resumes using native PDF viewers.
    *   Search, filter, and apply to job listings.
*   **Company Admin Workflow**:
    *   Publish and manage job postings.
    *   Review applicant submissions with embedded resume previews.
    *   Premium payment/checkout using the Chapa Payment Gateway.
*   **Direct Chat**: Real-time message exchange between job seekers and company administrators.
*   **Visual Reports**: Analytics dashboards for administrators using ApexCharts (displaying applicant statistics, job posts count, etc.).
*   **Client Mail Alerts**: Integration with EmailJS for triggers and user notification updates.

---

## 🛠️ Tech Stack & Dependencies

*   **Build Tool**: Vite (Ultra-fast Hot Module Replacement)
*   **Framework**: React (v18)
*   **Styling**: TailwindCSS, PostCSS, React Icons
*   **State Management**: Redux Toolkit & React-Redux
*   **Routing**: React Router DOM (v6)
*   **Forms & Validation**: Formik & Yup
*   **Visualizations**: ApexCharts & React ApexCharts
*   **PDF Viewer**: `@react-pdf-viewer` & `@react-pdf/renderer`
*   **Alerts & Notifications**: React Toastify & SweetAlert2
*   **API Client**: Axios with global interceptors for automatic JWT header attachments.

---

## 📋 Prerequisites

*   [Node.js](https://nodejs.org/en) (v18 or higher recommended)
*   [Job Portal Backend](file:///c:/Users/yonas/OneDrive/Desktop/Dev/Dev/JOB/Job%20Backend) running (default is `http://localhost:5000`)

---

## ⚙️ Setup & Configuration

1.  **Clone the Repository** and navigate to the frontend directory:
    ```bash
    cd "Job front"
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    Ensure the configuration parameters correctly point to the running NestJS API and Chapa public setup:
    *   `VITE_API_BASE_URL` — Backend API endpoint.
    *   `VITE_CHAPA_ENCRYPTION_KEY` — Chapa gateway public key.

---

## 🏃 Running the Application

```bash
# Start development server
npm run dev

# Format code using Prettier
npm run format

# Run ESLint to check for code issues
npm run lint

# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📂 Folder Structure

```bash
src/
├── Pages/               # Pages representing routes (Home, Register, Login, Dashboards)
├── Components/          # Shared components (NavBar, SideBar, Footer, Layouts, Charts)
├── assets/              # Images, static svgs, and fonts
├── constants/           # Action constants, configuration static values
├── context/             # Global contexts (e.g. chat or notification states)
├── hooks/               # Custom reusable React hooks
├── utils/               # Helper utilities and validators
├── App.jsx              # Main routes router and configuration
├── index.css            # Tailwind directives and custom CSS styles
├── axiosInterceptor.jsx # Interceptor attaching JWT to request headers and handling auth expiry
├── withAuth.jsx         # Higher-order component enforcing page access permissions
└── main.jsx             # React DOM application mount entry point
```

---

## 📝 License

This project is private and unlicensed. Refer to parent configuration specifications.
