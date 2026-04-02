# 🌌 Kasflow - Next-Generation Personal Finance Dashboard

**Kasflow** is a modern, innovative Single Page Application (SPA) designed to empower individuals and small businesses to take control of their financial health. Say goodbye to boring spreadsheets! Kasflow brings your financial data to life with an elegant **Glassmorphism** interface, dynamic Aurora/Prism background animations, and highly interactive visualizations, making budget tracking and expense management a seamless, delightful experience.

![Kasflow Banner](https://via.placeholder.com/800x400/0D0716/B19EEF?text=Kasflow+Finance+App) <!-- Replace with actual screenshot later -->

## ✨ Key Features

- 🎨 **Stunning Modern Aesthetics:** A premium, immersive Glassmorphism UI combined with dynamic, interactive Aurora background effects that wow the user.
- 🔐 **Robust & Interactive Authentication:** Secure login and registration flows featuring real-time password validation and custom animated scanning spotlight effects.
- 📊 **Deep Financial Insights:** Interactive, easy-to-understand charts and dashboards that provide a real-time overview of your income, expenses, and asset growth.
- 📱 **Lightning Fast & Responsive:** Built as a modern SPA, delivering a crisp, app-like experience across both desktop and mobile devices.
- 📑 **Automated Reporting:** Effortlessly export your financial data into beautifully formatted PDF reports for professional use or archiving.

## 🗺️ Application Structure

Kasflow provides a comprehensive suite of pages tailored for seamless financial tracking:

- **`/` (Landing Page):** A high-converting, visually stunning entry point explaining the app's features using glassmorphic cards.
- **`/login`:** A beautifully crafted authentication portal with animated validation effects and Google Login integration.
- **`/dashboard`:** The main control center offering a quick glance at total balance, recent transactions, and key metrics.
- **`/transactions`:** A detailed, filterable log of all historically recorded income and expenses.
- **`/add`:** A user-friendly form interface to record new transactions quickly.
- **`/insights`:** Deep analytical charts powered by Recharts, breaking down financial distributions and trends.
- **`/profile`:** User settings and personalization control.

## 🛠️ Tech Stack & Utilities

Kasflow is built using a bleeding-edge architectural stack. Here are the core technologies powering the application:

- **Core Engine:** React.js (ES6+) & Vite
- **Routing & State:** `react-router-dom` (v6) & React Context API
- **Styling & Visual Effects:** 
  - Tailwind CSS (Utility-First styling)
  - Custom Glassmorphism UI tokens
  - Advanced Animations & Graphics (*GSAP*, WebGL with *OGL*, Custom CSS Animations)
- **UI Primitives:** Shadcn UI (Radix UI) & `lucide-react` (for clean, consistent iconography)
- **Data Visualization:** `recharts`
- **Document Generation:** `jspdf` & `jspdf-autotable`
- **Notifications:** `sonner`
- **Networking:** `axios`

## 🚀 Getting Started Locally

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. Follow these steps to run the development server:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AhlunNR/kasflow-frontend.git
   cd kasflow-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your favorite browser and navigate to `http://localhost:5173`.

## 👥 Meet the Team

- **Ahlun Najarrudin** - *Frontend Engineer / UI & UX Implementation*

---
*Crafted with ❤️ for the CodingCamp Capstone Project.*