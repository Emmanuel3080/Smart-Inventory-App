import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Search,
  Receipt,
  Users,
  X,
  CreditCard,
  Layers,
  Sparkles,
} from "lucide-react";
import { productContext } from "../Contexts/ProductContext";
import ProductTableList from "../Components/ProductTableList";
import { TransactionContext } from "../Contexts/TransactionContext";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AdminContent = () => {
  const { fetchProducts, allproducts } = useContext(productContext);
  const { FetchTransactions, Transactions = [] } = useContext(TransactionContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [trxSearchQuery, setTrxSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    FetchTransactions();
  }, []);

  // Compute Core Metrics
  const metricsData = useMemo(() => {
    const list = allproducts || [];
    const totalProducts = list.length;

    const inventoryValue = list.reduce(
      (total, product) =>
        total +
        (Number(product.unitPrice) || 0) * (Number(product.quantity) || 0),
      0
    );

    const lowStockItems = list.filter((product) => {
      const quantity = Number(product.quantity) || 0;
      const minStock = Number(product.minimumStockLevel) || 10;
      return quantity <= minStock && quantity > 0;
    }).length;

    const outOfStockItems = list.filter(
      (product) => (Number(product.quantity) || 0) === 0
    ).length;

    const formattedInventoryValue = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(inventoryValue);

    return [
      {
        title: "Total Catalog Items",
        value: totalProducts,
        change: "Active inventory lines",
        icon: Package,
      },
      {
        title: "Total Stock Capital",
        value: formattedInventoryValue,
        change: "Valued at unit cost price",
        icon: DollarSign,
      },
      {
        title: "Low Stock Alert Floor",
        value: lowStockItems,
        change: "Approaching reorder point",
        icon: TrendingUp,
      },
      {
        title: "Out of Stock Items",
        value: outOfStockItems,
        change: "Requires vendor order",
        icon: AlertTriangle,
      },
    ];
  }, [allproducts]);

  // Compute Total Transactions Revenue
  const totalRevenue = useMemo(() => {
    return (Transactions || []).reduce(
      (acc, curr) => acc + (Number(curr.totalAmount) || 0),
      0
    );
  }, [Transactions]);

  // Filtered Transactions for the Modal
  const filteredTransactions = useMemo(() => {
    const q = trxSearchQuery.toLowerCase().trim();
    return (Transactions || []).filter((trx) => {
      const cashierName = `${trx?.cashier?.firstName || ""} ${trx?.cashier?.lastName || ""}`.toLowerCase();
      const method = (trx?.paymentMethod || "").toLowerCase();
      const productMatches = (trx?.items || []).some((item) =>
        item?.productName?.toLowerCase().includes(q)
      );
      return cashierName.includes(q) || method.includes(q) || productMatches;
    });
  }, [Transactions, trxSearchQuery]);

  return (
    <div className="relative min-h-screen text-stone-900 p-4 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Fast Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#E8E2D8] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded-full bg-[#F5EFE6] border border-[#E5DCCE] text-stone-700 text-xs font-medium tracking-wide">
              <Sparkles size={13} className="text-stone-600" />
              Administrative Command Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Inventory & Operations
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-normal mt-1">
              Real-time stock valuation, catalog governance, and transaction revenue audits.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/my_suppliers"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D8] hover:border-stone-400 text-stone-800 rounded-xl text-xs font-medium hover:bg-[#FAF7F2] transition-colors shadow-xs"
            >
              <Users size={15} className="text-stone-600" />
              Suppliers Directory
            </Link>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D8] hover:border-stone-400 text-stone-800 rounded-xl text-xs font-medium hover:bg-[#FAF7F2] transition-colors shadow-xs cursor-pointer"
            >
              <Receipt size={15} className="text-stone-600" />
              Transactions ({Transactions.length})
            </button>

            <Link
              to="/post_product"
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98]"
            >
              <Plus size={15} />
              Add New Product
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {metricsData.map((metric, i) => (
            <div
              key={i}
              className="bg-white border border-[#E8E2D8] p-5 sm:p-6 rounded-2xl shadow-xs transition-all hover:border-[#D8CFBF]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                    {metric.title}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
                    {metric.value}
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-500 font-normal">
                    {metric.change}
                  </p>
                </div>
                
                <div className="h-11 w-11 rounded-xl bg-[#F5EFE6] border border-[#E5DCCE] text-stone-800 flex items-center justify-center flex-shrink-0">
                  <metric.icon size={20} strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Catalog Section */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl shadow-xs p-5 sm:p-7 space-y-6">
          
          {/* Table Header & Search Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#F5EFE6] border border-[#E5DCCE] text-stone-800">
                  <Layers size={17} />
                </div>
                <h2 className="text-lg font-serif font-bold text-stone-900 tracking-tight">
                  Active Inventory Catalog
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Displaying <span className="font-semibold text-stone-800">{allproducts.length}</span> registered item{allproducts.length === 1 ? "" : "s"} with live stock status & unit economics
              </p>
            </div>

            {/* Table Search Input */}
            <div className="relative w-full sm:w-80">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Filter by product name, SKU or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none transition-all focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Product Table */}
          <ProductTableList allProducts={allproducts} searchQuery={searchQuery} />
        </div>

        {/* Transactions Audit Modal */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(28, 25, 23, 0.45)",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "20px",
              padding: "0",
              width: "92%",
              maxWidth: "880px",
              border: "1px solid #E8E2D8",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 20px 40px rgba(28, 25, 23, 0.12)",
              overflow: "hidden",
            },
          }}
          contentLabel="Transactions Audit Modal"
        >
          <div className="flex flex-col max-h-[85vh] text-stone-900">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-5 border-b border-[#E8E2D8] gap-4 bg-[#FAF7F2]">
              <div>
                <div className="flex items-center gap-2">
                  <Receipt size={18} className="text-stone-700" />
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Transactions & Cashier Revenue Audit
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Displaying <span className="font-semibold text-stone-800">{Transactions.length}</span> checkout records
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="bg-white border border-[#E8E2D8] px-4 py-2 rounded-xl flex flex-col shadow-xs">
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                    Total Gross Revenue
                  </span>
                  <span className="text-base font-bold text-stone-900">
                    ₦{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-[#EAE4D9] hover:text-stone-900 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Quick Search inside Modal */}
            <div className="px-6 py-3 border-b border-[#E8E2D8] bg-[#FAF7F2]/60 flex items-center gap-2">
              <Search size={14} className="text-stone-400" />
              <input
                type="text"
                placeholder="Search cashier name, payment method, or item name..."
                value={trxSearchQuery}
                onChange={(e) => setTrxSearchQuery(e.target.value)}
                className="w-full text-xs text-stone-900 placeholder-stone-400 outline-none bg-transparent"
              />
              {trxSearchQuery && (
                <button onClick={() => setTrxSearchQuery("")} className="text-stone-400 hover:text-stone-700">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Transactions Table Body */}
            <div className="overflow-y-auto flex-1 bg-white">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <Receipt size={28} className="mx-auto mb-2 text-stone-300" />
                  <p className="text-xs font-medium">No transaction records match query</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#FAF7F2] sticky top-0 border-b border-[#E8E2D8]">
                    <tr>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                        Staff Cashier
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                        Items Purchased
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                        Amount Paid
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                        Payment Mode
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2ECE1] text-xs">
                    {filteredTransactions.map((trx) => {
                      const trxDate = new Date(trx?.createdAt);
                      const formattedDate = trxDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      const formattedTime = trxDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr key={trx._id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-stone-900">
                                {trx?.cashier?.firstName} {trx?.cashier?.lastName}
                              </span>
                              <span className="text-[11px] text-stone-500">
                                {trx?.cashier?.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 max-w-xs">
                              {(trx?.items || []).map((item, idx) => (
                                <span key={idx} className="text-stone-700">
                                  <span className="font-semibold text-stone-900">
                                    {item.quantity}x
                                  </span>{" "}
                                  {item.productName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-stone-900 whitespace-nowrap text-sm">
                            ₦{(Number(trx?.totalAmount) || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#F5EFE6] text-stone-800 border border-[#E5DCCE]">
                              <CreditCard size={11} className="text-stone-600" />
                              {trx?.paymentMethod || "Cash"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col text-stone-700">
                              <span className="font-medium text-stone-900">{formattedDate}</span>
                              <span className="text-[10px] text-stone-500">{formattedTime}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-[#E8E2D8] bg-[#FAF7F2]">
              <span className="text-xs text-stone-500 font-normal">
                Encrypted audit stream • SME.OS
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminContent;
