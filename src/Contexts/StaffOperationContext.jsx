import { createContext, useState } from "react";
import { toast } from "sonner";


export const StaffOperationContext = createContext()




const StaffOperationProvider = ({ children }) => {

    const baseUrl = import.meta.env.VITE_API_URL
    const [allproducts, setProduct] = useState([])

    const [loadingCheckout, setLoadingCheckout] = useState(false);

    const fetchInventory = async () => {
        const token = localStorage.getItem("StaffToken")
        try {
            const response = await fetch(`${baseUrl}/staff/all/products`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            console.log(data);
            if (response.ok) {
                setProduct(data.products)
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error);

        }
    }



    const ProcessSales = async (items, paymentMethod) => {
        const token = localStorage.getItem("StaffToken")
        setLoadingCheckout(true)
        try {

            const response = await fetch(`${baseUrl}/staff/process/sales`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        _id: item._id || item.product,
                        quantity: item.quantity,
                        productName: item.productName
                    })),
                    paymentMethod: paymentMethod
                })
            })
            const result = await response.json()
            if (response.ok) {
                toast.success(result.message)
                return result;
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            else {
                toast.error(result.message || "Failed to process sale")
            }

        } catch (error) {
            console.log(error);
            toast.error("Network error while processing sale");
        }
        finally {
            setLoadingCheckout(false)
        }
    }


    const staffOperationValue = {
        fetchInventory,
        ProcessSales,
        loadingCheckout,
        allproducts
    }

    return (
        <>
            <StaffOperationContext.Provider value={staffOperationValue}>{children}</StaffOperationContext.Provider>
        </>
    )
}



export default StaffOperationProvider