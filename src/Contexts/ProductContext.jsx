import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




export const productContext = createContext()



const ProductProvider = ({ children }) => {

    const baseUrl = import.meta.env.VITE_API_URL

    const [allproducts, setProduct] = useState([])
    const [loadPostProduct, setLoading] = useState(false)
    const [singleProduct, setSingleProduct] = useState({})
    const [loadUpdateProp, setUpdateProp] = useState(false)
    const [loadDeleteProd, setDeleteProd] = useState(false)
   
    const navigate = useNavigate()



    const postProduct = async (productData) => {

        setLoading(true)

        try {
            const payload = new FormData()
            payload.append("productName", productData.productName)
            payload.append("sku", productData.sku)
            payload.append("description", productData.description)
            payload.append("category", productData.category)
            payload.append("supplier", productData.supplier)
            payload.append("quantity", productData.quantity)
            payload.append("unitPrice", productData.unitPrice)
            payload.append("sellingPrice", productData.sellingPrice)
            payload.append("minimumStockLevel", productData.minimumStockLevel)
            payload.append("expiryDate", productData.expiryDate)
            if (productData?.productImage && productData?.productImage[0]) {
                payload.append("productImage", productData.productImage[0])

            }

            const response = await fetch(`${baseUrl}/admin/post_product`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accesToken")}`
                },
                body: payload
            })
            const data = await response.json()
            if (response.ok) {
                toast.success(`${data.Message || "Product Added Successfuly"}`)
                navigate("/admin/dashboard")
            }
            else {
                toast.error(`${data.Message || "Failed to add product"}`)
            }


        }
        catch (error) {
            console.log(error);

        }
        finally {
            setLoading(false)
        }
    }




    const fetchProducts = async () => {
        const token = localStorage.getItem("accesToken")
        try {
            const response = await fetch(`${baseUrl}/admin/all/products`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            // console.log(data);
            if (response.ok) {
                setProduct(data.products)
            }
            else {
                toast.error("Unable to fetch products")
            }
        } catch (error) {
            console.log(error);

        }
    }


    const fetchSingleProduct = async (id) => {
        const token = localStorage.getItem("accesToken")
        try {
            const response = await fetch(`${baseUrl}/admin/product/${id}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token} `
                }
            })

            const data = await response.json()

            if (response.ok) {
                setSingleProduct(data.product)
            }
            else {
                toast.error("Failed to fetch single product")
            }
        } catch (error) {
            console.log(error);

        }
    }



    const updateProduct = async (productData, id) => {

        setUpdateProp(true)
        const token = localStorage.getItem("accesToken")


        try {
            const payload = new FormData()
            payload.append("productName", productData.productName)
            payload.append("sku", productData.sku)
            payload.append("description", productData.description)
            payload.append("category", productData.category)
            payload.append("supplier", productData.supplier)
            payload.append("quantity", productData.quantity)
            payload.append("unitPrice", productData.unitPrice)
            payload.append("sellingPrice", productData.sellingPrice)
            payload.append("minimumStockLevel", productData.minimumStockLevel)
            payload.append("expiryDate", productData.expiryDate)
            if (productData?.productImage && productData?.productImage[0]) {
                payload.append("productImage", productData.productImage[0])

            }
            const response = await fetch(`${baseUrl}/admin/update_product/${id}`, {
                method: "PATCH",
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: payload
            })

            const data = await response.json()
            if (response.ok) {
                toast.success("Product Updated Successfully")
                navigate("/admin/dashboard")
            }
            else {
                toast.error("Failed to Update product")
            }
        } catch (error) {
            console.log(error);

        }
        finally {
            setUpdateProp(false)
        }

    }


    const deleteProduct = async (id) => {

        setDeleteProd(true)
        const token = localStorage.getItem("accesToken")

        try {
            const response = await fetch(`${baseUrl}/admin/delete_product/${id}`, {
                method: "DELETE", headers: {
                    authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()
            if (response.ok) {
                toast.success(data.Message)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            else {
                toast.error(data.Message)
            }
        } catch (error) {
            console.log(error);

        }

        finally {
            setDeleteProd(false)
        }
    }



   

    const productValue = {
        postProduct,
        fetchProducts,
        fetchSingleProduct,
        updateProduct,
        deleteProduct,
        loadDeleteProd,
        loadUpdateProp,
        singleProduct,
        loadPostProduct,
        allproducts
    }


    return (
        <>
            <productContext.Provider value={productValue}>{children}</productContext.Provider>
        </>
    )
}


export default ProductProvider