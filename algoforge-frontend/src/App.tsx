import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import ProblemsPage from "@/pages/ProblemsPage";
import ProblemDetailPage from "@/pages/ProblemDetailPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import SubmissionsPage from "@/pages/SubmissionsPage";
import SubmissionDetailPage from "@/pages/SubmissionDetailPage";
import SettingsPage from "@/pages/SettingsPage";
import ChallengesPage from "@/pages/ChallengesPage";
import AdminChallengesPage from "@/pages/AdminChallengesPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProblemsPage from "@/pages/AdminProblemsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { ProtectedRoute, AdminRoute, PublicRoute } from "@/components/auth/RouteGuards";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Authenticated (any role) */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/problems" element={<ProtectedRoute><ProblemsPage /></ProtectedRoute>} />
      <Route path="/problems/:id" element={<ProtectedRoute><ProblemDetailPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/submissions" element={<ProtectedRoute><SubmissionsPage /></ProtectedRoute>} />
      <Route path="/submissions/:id" element={<ProtectedRoute><SubmissionDetailPage /></ProtectedRoute>} />
      <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/problems" element={<AdminRoute><AdminProblemsPage /></AdminRoute>} />
      <Route path="/admin/challenges" element={<AdminRoute><AdminChallengesPage /></AdminRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
