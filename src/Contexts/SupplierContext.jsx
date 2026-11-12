import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export const supplierContext = createContext()

const SupplierProvider = ({ children }) => {

    const baseUrl = import.meta.env.VITE_API_URL

    const [loadingCreateSupplier, setLoadSupplier] = useState(false)


    const [supplier, setSuppliers] = useState([])
    const [loadSupplier, setLoading] = useState(false)

    const navigate = useNavigate()

    const createSupplierProfile = async (data) => {
        const token = localStorage.getItem("accesToken")
        setLoadSupplier(true)
        try {
            const response = await fetch(`${baseUrl}/admin/add_supplier`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (response.ok) {
                toast.success(result.Message)
                navigate("/admin/dashboard")
            }
            else {
                toast.error(result.Message)
            }

        } catch (error) {
            console.log(error);

        }
        finally {
            setLoadSupplier(false)
        }
    }




    const fetchSuppliers = async () => {
        const token = localStorage.getItem("accesToken")
        setLoading(true)
        try {
            const response = await fetch(`${baseUrl}/admin/suppliers/all`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()
            // console.log(data);
            
            if (response.ok) {
                // toast.success()
                setSuppliers(data.suppliers)
            }
            else {
                toast.error("Failed to feetch Supplier")
            }

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
        }


    }
    const supplierValue = {
        createSupplierProfile,
        fetchSuppliers,
        loadSupplier,
        supplier,
        loadingCreateSupplier
    }

    return (
        <>
            <supplierContext.Provider value={supplierValue}>{children}</supplierContext.Provider>
        </>
    )
}

export default SupplierProvider