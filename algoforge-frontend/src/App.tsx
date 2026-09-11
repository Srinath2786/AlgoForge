import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProtectedRoute, AdminRoute, PublicRoute } from "@/components/auth/RouteGuards";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ProblemsPage = lazy(() => import("@/pages/ProblemsPage"));
const ProblemDetailPage = lazy(() => import("@/pages/ProblemDetailPage"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));
const SubmissionsPage = lazy(() => import("@/pages/SubmissionsPage"));
const SubmissionDetailPage = lazy(() => import("@/pages/SubmissionDetailPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ChallengesPage = lazy(() => import("@/pages/ChallengesPage"));
const AdminChallengesPage = lazy(() => import("@/pages/AdminChallengesPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminProblemsPage = lazy(() => import("@/pages/AdminProblemsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-void">
      <Loader2 className="animate-spin text-forge" size={28} />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  );
}
