import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export const adminAuthContext = createContext()


const AdminAuthProvider = ({ children }) => {


    const [loadingRegistration, setLoadingReg] = useState(false)
    const [loadingSign, setLoadingSign] = useState(false)
    const [adminInfo, setUserInfo] = useState({})
    const baseUrl = import.meta.env.VITE_API_URL

    const navigate = useNavigate()



    const AdminSignUp = async (adminData) => {
        setLoadingReg(true)

        try {
            const payload = new FormData()
            payload.append("fullName", adminData.fullName)
            payload.append("email", adminData.email)
            payload.append("password", adminData.password)

            if (adminData.profileImage && adminData.profileImage[0]) {
                payload.append("profileImage", adminData.profileImage[0])
            }

            const response = await fetch(`${baseUrl}/admin/signup`, {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json"
                },
                body: payload
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(`${data.Message || "Sign Up Successful"}`)
                navigate("/admin/signin")
            }
            else {
                toast.error(`${data.Message || "Sign Up Failed"}`)
            }
        } catch (error) {
            console.log(error);

        }
        finally {
            setLoadingReg(false)
        }
    }

    const AdminSignIn = async (adminData) => {
        setLoadingSign(true)
        try {
            const response = await fetch(`${baseUrl}/admin/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(adminData)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success(`Welcome onboard ${data.adminInfo.fullName || "Sign In Successful"}`)
                localStorage.setItem("accesToken", data.accesToken)
                navigate("/admin/dashboard")
            }
            else {
                toast.error(`${data.Message || "Sign In Failed"}`)
            }

        } catch (error) {
            console.log(error);

        }
        finally {
            setLoadingSign(false)
        }
    }

    const isAuthenticated = async () => {
        const token = localStorage.getItem("accesToken")

        if (!token) {
            return false
        }
        try {
            const response = await fetch(`${baseUrl}/admin/verify_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (response.ok) {
                setUserInfo(data.user)
                return true
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error);

        }
    };

    const AdminSignOut = () => {
        localStorage.removeItem("accesToken");
        setUserInfo({});
        toast.info("Signed out of administrative session");
        navigate("/admin/signin");
    };

    const authValue = {
        AdminSignUp,
        AdminSignIn,
        AdminSignOut,
        isAuthenticated,
        adminInfo,
        loadingSign,
        loadingRegistration,
    }

    return (
        <>
            <adminAuthContext.Provider value={authValue}>{children}</adminAuthContext.Provider>
        </>
    )
}

export default AdminAuthProvider