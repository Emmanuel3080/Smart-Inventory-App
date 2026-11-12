import { createContext, useState } from "react";
import { toast } from "sonner";

export const StaffOperationContext = createContext();

const StaffOperationProvider = ({ children }) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [allproducts, setProduct] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [errorInventory, setErrorInventory] = useState(null);

  const fetchInventory = async () => {
    const token = localStorage.getItem("StaffToken");
    if (!token) {
      setErrorInventory("Staff session token missing. Please sign in again.");
      setProduct([]);
      return null;
    }

    setLoadingInventory(true);
    setErrorInventory(null);

    try {
      const response = await fetch(`${baseUrl}/staff/all/products`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const productsList = data.products || [];
        setProduct(productsList);
        return productsList;
      } else {
        const errMsg =
          data.message || "Unable to retrieve assigned store inventory.";
        setErrorInventory(errMsg);
        setProduct([]);
        return null;
      }
    } catch (error) {
      console.error("fetchInventory error:", error);
      const errMsg = "Network error while connecting to store inventory.";
      setErrorInventory(errMsg);
      setProduct([]);
      return null;
    } finally {
      setLoadingInventory(false);
    }
  };

  const ProcessSales = async (items, paymentMethod) => {
    const token = localStorage.getItem("StaffToken");
    setLoadingCheckout(true);
    try {
      const response = await fetch(`${baseUrl}/staff/process/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            _id: item._id || item.product,
            quantity: item.quantity,
            productName: item.productName,
          })),
          paymentMethod: paymentMethod,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Sale processed successfully!");
        return result;
      } else {
        toast.error(result.message || "Failed to process sale");
        return null;
      }
    } catch (error) {
      console.error("ProcessSales error:", error);
      toast.error("Network error while processing sale");
      return null;
    } finally {
      setLoadingCheckout(false);
    }
  };

  const staffOperationValue = {
    fetchInventory,
    ProcessSales,
    loadingCheckout,
    loadingInventory,
    errorInventory,
    allproducts,
  };

  return (
    <StaffOperationContext.Provider value={staffOperationValue}>
      {children}
    </StaffOperationContext.Provider>
  );
};

export default StaffOperationProvider;
