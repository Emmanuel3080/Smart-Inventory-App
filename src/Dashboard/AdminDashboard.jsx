import React from 'react'
import ModernAdminHeader from '../Common/AdminHeader'
import AdminContent from '../AdminDashboard/AdminContent'

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
            <ModernAdminHeader />
            <AdminContent />
        </div>
    )
}

export default AdminDashboard