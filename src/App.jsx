import { useAuth } from "./context/AuthContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-10 text-center text-gray-500">Checking session...</p>;
  return user ? <Dashboard /> : <AuthPage />;
}
