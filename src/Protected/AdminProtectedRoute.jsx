import { useContext, useEffect, useState } from 'react';
import { adminAuthContext } from '../Contexts/AdminAuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AdminProtectedRoute = () => {
  const { isAuthenticated } = useContext(adminAuthContext);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  const checkAuthState = async () => {
    // Prevent staff with only StaffToken from accessing admin routes
    const adminToken = localStorage.getItem("accesToken");
    const staffToken = localStorage.getItem("StaffToken");

    if (!adminToken && staffToken) {
      toast.error("Access denied: Administrator privileges required.");
      navigate("/staff/dashboard", { replace: true });
      return;
    }

    if (!adminToken) {
      toast.error("Kindly Sign In as Administrator");
      navigate("/admin/signin", { replace: true });
      return;
    }

    try {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        toast.error("Kindly Sign In as Administrator");
        navigate("/admin/signin", { replace: true });
      } else {
        setChecking(false);
      }
    } catch (error) {
      console.error("Admin authentication check failed:", error);
      navigate("/admin/signin", { replace: true });
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-stone-800" size={28} />
          <span className="text-xs font-medium text-stone-600">
            Verifying administrative access...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminProtectedRoute;
