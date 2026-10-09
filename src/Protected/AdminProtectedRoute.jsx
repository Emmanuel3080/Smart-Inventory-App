import React, { useContext, useEffect } from 'react'
import { adminAuthContext } from '../Contexts/AdminAuthContext'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AdminProtectedRoute = () => {

    const { isAuthenticated } = useContext(adminAuthContext)

    const navigate = useNavigate()

    const checkAutState = async () => {
        try {
            const isAuth = await isAuthenticated()
            if (!isAuth) {
                toast.error("Kindly Sign In")
                navigate("/admin/signin")
            }
        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {
        checkAutState()
    }, [])
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default AdminProtectedRoute