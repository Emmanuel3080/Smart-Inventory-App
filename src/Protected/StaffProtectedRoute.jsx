import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { StaffAuthContext } from '../Contexts/StaffAuthContext';
import { Loader2 } from 'lucide-react';

const StaffProtectedRoute = () => {
  const { isAuthenticated, staffInfo } = useContext(StaffAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  const checkAuthState = async () => {
    const staffToken = localStorage.getItem("StaffToken");
    const adminToken = localStorage.getItem("accesToken");

    // Prevent pure admins from accessing staff routes
    if (!staffToken && adminToken) {
      toast.error("Staff session required. Redirecting to Admin Console.");
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (!staffToken) {
      toast.error("Kindly Sign In to access Staff POS Terminal");
      navigate("/staff/signin", { replace: true });
      return;
    }

    try {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        toast.error("Kindly Sign In to access Staff POS Terminal");
        navigate("/staff/signin", { replace: true });
        return;
      }

      // Determine assignment status
      const assigned = Boolean(isAuth?.adminId || staffInfo?.adminId);
      const isPendingRoute = location.pathname === "/staff/pending";

      if (assigned && isPendingRoute) {
        // Assigned staff should not be on pending page
        navigate("/staff/dashboard", { replace: true });
      } else if (!assigned && !isPendingRoute) {
        // Unassigned staff must be redirected to pending
        toast.info("Your account is pending store administrator assignment.");
        navigate("/staff/pending", { replace: true });
      } else {
        setChecking(false);
      }
    } catch (error) {
      console.error("Staff authentication check failed:", error);
      navigate("/staff/signin", { replace: true });
    }
  };

  useEffect(() => {
    checkAuthState();
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-stone-800" size={28} />
          <span className="text-xs font-medium text-stone-600">
            Verifying staff terminal session...
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

export default StaffProtectedRoute;
