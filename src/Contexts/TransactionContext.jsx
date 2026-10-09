import { createContext, useState } from "react";
import { toast } from "sonner";

export const TransactionContext = createContext()

const Transactionprovider = ({ children }) => {
    const baseUrl = import.meta.env.VITE_API_URL

    const [Transactions, setTransactions] = useState([])
    const [loadingTransactions, setLoadingTransactions] = useState(false) // Fixed initial state to boolean

    const FetchTransactions = async () => {
        setLoadingTransactions(true)
        try {
            const response = await fetch(`${baseUrl}/admin/all/transactions`,
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("accesToken")}`
                    }
                }
            )

            const result = await response.json()
            if (response.ok) {
                setTransactions(result.data)
            }
            else {
                toast.error(result?.message)
            }

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingTransactions(false)
        }
    }

    const TransactionValue = {
        FetchTransactions,
        Transactions,
        loadingTransactions
    }

    return (
        <>
            <TransactionContext.Provider value={TransactionValue}>{children}</TransactionContext.Provider>
        </>
    )
}

export default Transactionprovider