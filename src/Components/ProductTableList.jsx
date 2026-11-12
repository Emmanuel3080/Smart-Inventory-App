import React, { useContext, useState, useMemo } from 'react';
import { Edit3, Trash2, Package, AlertTriangle, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productContext } from '../Contexts/ProductContext';
import Modal from "react-modal";

Modal.setAppElement("#root");

const ProductTableList = ({ allProducts = [], searchQuery = "" }) => {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { deleteProduct, loadDeleteProd } = useContext(productContext);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    if (!searchQuery.trim()) return allProducts;

    const q = searchQuery.toLowerCase().trim();
    return allProducts.filter((product) => {
      const nameMatch = product.productName?.toLowerCase().includes(q);
      const skuMatch = product.sku?.toLowerCase().includes(q);
      const categoryMatch = product.category?.toLowerCase().includes(q);
      return nameMatch || skuMatch || categoryMatch;
    });
  }, [allProducts, searchQuery]);

  const handleDeleteClick = (id) => {
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;
    await deleteProduct(selectedProductId);
    setModalOpen(false);
    setSelectedProductId(null);
  };

  if (!allProducts || allProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E2D8] p-8 text-stone-900">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center mx-auto mb-4 text-stone-700 shadow-xs">
          <Package size={28} />
        </div>
        <h3 className="text-base font-serif font-bold text-stone-900">No inventory entries recorded yet</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Add your first product to track stock balances, price points, and reorder levels.
        </p>
        <Link
          to="/post_product"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#1F5C4A] hover:bg-[#174738] active:bg-[#103328] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F5C4A]"
        >
          <Plus size={15} />
          Register First Product
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Delete Confirmation Modal */}
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
            width: "90%",
            maxWidth: "440px",
            border: "1px solid #E8E2D8",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 40px rgba(28, 25, 23, 0.12)",
            overflow: "hidden",
          },
        }}
        contentLabel="Delete Product Modal"
      >
        <div className="p-6 sm:p-7 text-center text-stone-900">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 mb-4">
            <AlertTriangle size={24} />
          </div>

          <h2 className="text-lg font-serif font-bold text-stone-900 mb-1.5">Delete Product Record?</h2>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-6">
            This action will permanently remove this item from your inventory catalog. This action cannot be reversed.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-stone-700 font-medium text-xs hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={loadDeleteProd}
              onClick={handleConfirmDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#B91C1C] text-white font-semibold text-xs hover:bg-[#991B1B] transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C1C]"
            >
              {loadDeleteProd ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                "Yes, Delete Product"
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#E8E2D8] bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F2EDE4] border-b border-[#E8E2D8] text-[11px] font-semibold text-[#57534E] uppercase tracking-wider">
              <th className="px-5 py-3.5">Product Information</th>
              <th className="px-5 py-3.5">SKU</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Pricing & Margins</th>
              <th className="px-5 py-3.5">Stock Balance</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8E2D8] text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#78716C]">
                  <p className="text-xs font-medium">No products match your search filter</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const quantity = Number(product.quantity) || 0;
                const minStock = Number(product.minimumStockLevel) || 10;
                const unitPrice = Number(product.unitPrice) || 0;
                const sellingPrice = Number(product.sellingPrice) || 0;
                const profit = sellingPrice - unitPrice;
                const margin = unitPrice > 0 ? Math.round((profit / unitPrice) * 100) : 0;

                let statusLabel = "In Stock";
                let statusBadge = "bg-[#E6F4EA] text-[#15803D] border-[#15803D]/20";
                let dotColor = "bg-[#15803D]";

                if (quantity === 0) {
                  statusLabel = "Out of Stock";
                  statusBadge = "bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]/20";
                  dotColor = "bg-[#B91C1C]";
                } else if (quantity <= minStock) {
                  statusLabel = "Low Stock";
                  statusBadge = "bg-[#FFEDD5] text-[#C2410C] border-[#C2410C]/20";
                  dotColor = "bg-[#C2410C]";
                }

                return (
                  <tr key={product._id} className="hover:bg-[#FAF8F5] transition-colors group">
                    {/* 1. Product Info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.productImage ? (
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-10 h-10 object-cover rounded-lg border border-[#E8E2D8] flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#FAF7F2] rounded-lg border border-[#E8E2D8] flex items-center justify-center text-stone-600 font-medium text-xs flex-shrink-0">
                            <Package size={18} />
                          </div>
                        )}
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-stone-900 truncate">
                            {product.productName}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {product.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 2. SKU Code */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-stone-700 bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D8]">
                        {product.sku}
                      </span>
                    </td>

                    {/* 3. Category */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 border border-[#E5DCCE] bg-[#F5EFE6] text-stone-700 rounded-md font-medium text-[11px] whitespace-nowrap">
                        {product.category || "General"}
                      </span>
                    </td>

                    {/* 4. Financials */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-medium text-stone-500">Retail:</span>
                          <span className="font-bold text-stone-900 text-xs">
                            ₦{sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-medium text-stone-500">Cost:</span>
                          <span className="text-stone-500 font-normal text-[11px]">
                            ₦{unitPrice.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                            profit >= 0
                              ? 'bg-[#EEF5EE] text-emerald-800 border-emerald-200'
                              : 'bg-[#FDF2F2] text-rose-800 border-rose-200'
                          }`}>
                            Profit: ₦{profit.toLocaleString()} ({profit >= 0 ? `+${margin}%` : `${margin}%`})
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 5. Stock Count & Expiry */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-stone-900 text-xs">{quantity} units</p>
                        {product.expiryDate && (
                          <p className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                            <Calendar size={11} className="text-stone-400" />
                            Exp: {new Date(product.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* 6. Status Chip */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusBadge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        {statusLabel}
                      </span>
                    </td>

                    {/* 7. Action Controls */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/update/product/${product._id}`}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTableList;