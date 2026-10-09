import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export const StaffAuthContext = createContext()



const StaffAuthProvider = ({ children }) => {

    const [loadingRegistration, setLoadingReg] = useState(false)
    const [loadingSign, setLoadingSign] = useState(false)

    const [staffInfo, setStaffInfo] = useState({})

    const baseURL = import.meta.env.VITE_API_URL


    console.log("API URL:", baseURL);

    const navigate = useNavigate()




    const RegisterStaff = async (payload) => {
        setLoadingReg(true)
        try {
            const response = await fetch(`${baseURL}/staff/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })


            const result = await response.json()
            if (response.ok) {
                toast.success(`${result.message || "Sign Up Successful"}`)
                navigate("/staff/signin")
            }
            else {
                toast.error(`${result.message || "Sign Up Failed"}`)
            }
        } catch (error) {
            console.log(error);

        }
        finally {
            setLoadingReg(false)
        }
    }




    const LoginStaff = async (staffData) => {
        setLoadingSign(true)
        try {
            const response = await fetch(`${baseURL}/staff/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(staffData)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(`Welcome onboard ${data.staffInfo.firstName || "Sign In Successful"}`)
                localStorage.setItem("StaffToken", data.token)
                navigate("/staff")
            }
            else {
                toast.error(`${data.message || "Sign In Failed"}`)
            }

        } catch (error) {
            console.log(error);

        }
        finally {
            setLoadingSign(false)
        }
    }



    const isAuthenticated = async () => {
        const token = localStorage.getItem("StaffToken")

        if (!token) {
            return false
        }
        try {
            const response = await fetch(`${baseURL}/staff/verify_jwt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (response.ok) {
                setStaffInfo(data.staff)
                return true
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error);
        }
    }

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
        loadingRegistration
    }

    return (
        <>
            <StaffAuthContext.Provider value={staffAuthAuthValue}>{children}</StaffAuthContext.Provider>
        </>
    )
}

export default StaffAuthProvider