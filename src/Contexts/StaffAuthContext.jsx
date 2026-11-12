import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const StaffAuthContext = createContext();

const StaffAuthProvider = ({ children }) => {
  const [loadingRegistration, setLoadingReg] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [staffInfo, setStaffInfo] = useState({});

  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const RegisterStaff = async (payload) => {
    setLoadingReg(true);
    try {
      const response = await fetch(`${baseURL}/staff/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(`${result.message || "Sign Up Successful"}`);
        navigate("/staff/signin");
      } else {
        toast.error(`${result.message || "Sign Up Failed"}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error during staff registration");
    } finally {
      setLoadingReg(false);
    }
  };

  // Retrieve authenticated user's profile and role using existing profile endpoint
  const fetchProfile = async (token) => {
    if (!token) return null;
    try {
      const response = await fetch(`${baseURL}/staff/verify_jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const staff = data.staff || data.staffInfo || data.user || null;
        if (staff) {
          setStaffInfo(staff);
          return staff;
        }
      }
      return null;
    } catch (error) {
      console.log("Error fetching staff profile:", error);
      return null;
    }
  };

  const LoginStaff = async (staffData) => {
    setLoadingSign(true);
    try {
      const response = await fetch(`${baseURL}/staff/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffData),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token || data.accessToken || data.accesToken;
        if (token) {
          localStorage.setItem("StaffToken", token);
        }

        // Retrieve authenticated user's profile and role using the existing profile endpoint
        const profile = await fetchProfile(token);
        const resolvedStaff = profile || data.staff || data.staffInfo || {};
        setStaffInfo(resolvedStaff);

        const displayName =
          resolvedStaff.firstName ||
          (data.staffInfo && data.staffInfo.firstName) ||
          "Staff";

        toast.success(`Welcome onboard ${displayName}`);

        // Role-based routing: Assigned staff -> /staff/dashboard, Unassigned staff -> /staff/pending
        if (resolvedStaff.adminId) {
          navigate("/staff/dashboard");
        } else {
          navigate("/staff/pending");
        }
      } else {
        toast.error(`${data.message || "Sign In Failed"}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error during sign in");
    } finally {
      setLoadingSign(false);
    }
  };

  const isAuthenticated = async () => {
    const token = localStorage.getItem("StaffToken");

    if (!token) {
      return false;
    }
    try {
      const response = await fetch(`${baseURL}/staff/verify_jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const staff = data.staff || data.staffInfo || data.user || {};
        setStaffInfo(staff);
        return staff;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("StaffToken");
    setStaffInfo({});
    toast.info("Signed out of staff terminal");
    navigate("/staff/signin");
  };

  const staffAuthAuthValue = {
    LoginStaff,
    RegisterStaff,
    StaffSignOut: logout,
    logout,
    isAuthenticated,
    staffInfo,
    loadingSign,
    loadingRegistration,
  };

  return (
    <StaffAuthContext.Provider value={staffAuthAuthValue}>
      {children}
    </StaffAuthContext.Provider>
  );
};

export default StaffAuthProvider;
