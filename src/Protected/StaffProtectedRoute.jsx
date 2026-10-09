import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { StaffAuthContext } from '../Contexts/StaffAuthContext'

const StaffProtectedRoute = () => {

    const { isAuthenticated } = useContext(StaffAuthContext)

    const navigate = useNavigate()

    const checkAutState = async () => {
        try {
            const isAuth = await isAuthenticated()
            if (!isAuth) {
                toast.error("Kindly Sign In")
                navigate("/staff/signin")
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

export default StaffProtectedRoute