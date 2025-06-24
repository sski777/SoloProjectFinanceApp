import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionForm from "./components/mainpage";
import ProtectedRoute from "./Middlewares/AuthMiddleware";
import AuthStatusPage from "./components/PleaseAuthenticate";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import TransactionsPage from "./components/TransactionPage";
import BarChartPage from "./components/BarChart";
import PieChartPage from "./components/PieCharts";
import NotFoundPage from "./components/NotFound";
import RenderTask from "./components/IndividualTask";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TransactionForm />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/authenticate" element={<AuthStatusPage />}></Route>
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/barchart"
          element={
            <ProtectedRoute>
              <BarChartPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/piechart"
          element={
            <ProtectedRoute>
              <PieChartPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/rendertask"
          element={
            <ProtectedRoute>
              <RenderTask />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
