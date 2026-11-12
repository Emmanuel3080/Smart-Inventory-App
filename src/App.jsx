import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EntryScreen } from './Components/EntryScreen';
import AdminRegistrationForm from "./AuthPages/SignUp";
import AdminSignIn from "./AuthPages/SignIn";
import AdminAuthProvider from './Contexts/AdminAuthContext';
import { Toaster } from 'sonner';
import AdminDashboard from './Dashboard/AdminDashboard';
import AdminStaffManagement from './AdminDashboard/AdminStaffManagement';
import AdminProtectedRoute from './Protected/AdminProtectedRoute';
import ProductProvider from './Contexts/ProductContext';
import PostProduct from './ProductPage/PostProduct';
import UpdateProduct from './ProductPage/UpdateProduct';
import CreateSuplier from './Supplierpage/CreateSuplier';
import Suppliers from './Supplierpage/Suppliers';
import SupplierProvider from './Contexts/SupplierContext';
import SignIn from './StaffAuthPages/SignIn';
import SignUp from './StaffAuthPages/Signp';
import AcceptInvitation from './StaffAuthPages/AcceptInvitation';
import StaffAuthProvider from './Contexts/StaffAuthContext';
import StaffProtectedRoute from './Protected/StaffProtectedRoute';
import Dashboard from './StaffDashboard/Dashboard';
import StaffPending from './StaffDashboard/StaffPending';
import StaffOperationProvider from './Contexts/StaffOperationContext';
import Transactionprovider from './Contexts/TransactionContext';

function App() {
  return (
    <>
      <BrowserRouter>
        <AdminAuthProvider>
          <Transactionprovider>
            <StaffAuthProvider>
              <StaffOperationProvider>
                <ProductProvider>
                  <SupplierProvider>
                    <Toaster
                      richColors
                      closeButton
                      theme="light"
                      toastOptions={{
                        style: {
                          background: "#FFFFFF",
                          border: "1px solid #EAE5DC",
                          borderRadius: "12px",
                          fontSize: "13px",
                          fontWeight: "500",
                          padding: "14px 16px",
                          color: "#1C1917",
                          fontFamily: "inherit",
                          boxShadow: "0 4px 16px rgba(28, 25, 23, 0.06)",
                        },
                      }}
                    />
                    <Routes>
                      {/* Root redirects to Entry Portal */}
                      <Route path='/' element={<Navigate to='/entry' replace />} />
                      <Route path='/entry' element={<EntryScreen />} />

                      {/* Admin Auth Routes */}
                      <Route path='/admin/signup' element={<AdminRegistrationForm />} />
                      <Route path='/admin/signin' element={<AdminSignIn />} />

                      {/* Staff Auth & Invitation Routes */}
                      <Route path='/staff/signin' element={<SignIn />} />
                      <Route path='/staff/signup' element={<SignUp />} />
                      <Route path='/staff/accept-invitation' element={<AcceptInvitation />} />

                      {/* Staff Protected Routes */}
                      <Route element={<StaffProtectedRoute />}>
                        <Route path='/staff/dashboard' element={<Dashboard />} />
                        <Route path='/staff/pending' element={<StaffPending />} />
                        <Route path='/staff' element={<Navigate to='/staff/dashboard' replace />} />
                      </Route>

                      {/* Admin Protected Routes */}
                      <Route element={<AdminProtectedRoute />}>
                        <Route path='/admin/dashboard' element={<AdminDashboard />} />
                        <Route path='/admin' element={<Navigate to='/admin/dashboard' replace />} />
                        <Route path='/admin/staff' element={<AdminStaffManagement />} />
                        <Route path='/admin/staff-management' element={<Navigate to='/admin/staff' replace />} />
                        <Route path='/post_product' element={<PostProduct />} />
                        <Route path='/update/product/:id' element={<UpdateProduct />} />
                        <Route path='/add/supplier' element={<CreateSuplier />} />
                        <Route path='/my_suppliers' element={<Suppliers />} />
                      </Route>

                      {/* Fallback to entry */}
                      <Route path='*' element={<Navigate to='/entry' replace />} />
                    </Routes>
                  </SupplierProvider>
                </ProductProvider>
              </StaffOperationProvider>
            </StaffAuthProvider>
          </Transactionprovider>
        </AdminAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
