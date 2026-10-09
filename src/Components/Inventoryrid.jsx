import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Layers,
  RefreshCw,
  Package,
  Boxes,
  XCircle,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  Banknote,
  ArrowRight,
  Receipt,
  Loader2,
} from 'lucide-react';
import { StaffOperationContext } from '../Contexts/StaffOperationContext';
import { toast } from 'sonner';
import Modal from "react-modal";

Modal.setAppElement("#root");

const InventoryGrid = () => {
  const {
    fetchInventory,
    allproducts = [],
    ProcessSales,
    loadingCheckout,
  } = useContext(StaffOperationContext);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Cart State (Persisted in localStorage)
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('sales_cart_items');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('sales_cart_items', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [items]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchInventory();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchInventory();
    setLoading(false);
    toast.success("Inventory stock refreshed");
  };

  // Add Item to Cart
  const pushCart = (productToAdd) => {
    const availableStock = Number(productToAdd.quantity) || 0;

    if (availableStock <= 0) {
      toast.error("This item is currently out of stock!");
      return;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i._id === productToAdd._id);

      if (existingIndex >= 0) {
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            const currentQty = item.quantity ?? 0;
            if (currentQty < availableStock) {
              toast.success(`Added another ${productToAdd.productName} to cart`);
              return { ...item, quantity: currentQty + 1 };
            } else {
              toast.error("Cannot add more: maximum available stock reached!");
              return item;
            }
          }
          return item;
        });
      }

      toast.success(`${productToAdd.productName} added to cart`);
      return [
        ...prevItems,
        {
          ...productToAdd,
          quantity: 1,
          stock: availableStock,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // Process Sales Checkout
  const handleCheckOut = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const result = await ProcessSales(items, paymentMethod);
      if (result) {
        setItems([]);
        localStorage.removeItem('sales_cart_items');
        setCheckoutModalOpen(false);
        setIsCartOpen(false);
        await fetchInventory(); // Refresh stock counts immediately
      }
    } catch (error) {
      console.error("Checkout process error:", error);
    }
  };

  // Summary Metrics
  const summary = useMemo(() => {
    const list = allproducts || [];
    let outOfStock = 0;
    let lowStock = 0;
    list.forEach((p) => {
      const qty = Number(p.quantity) || 0;
      const min = Number(p.minimumStockLevel) || 10;
      if (qty === 0) outOfStock += 1;
      else if (qty <= min) lowStock += 1;
    });
    return {
      total: list.length,
      outOfStock,
      lowStock,
      healthyStock: list.length - (outOfStock + lowStock),
    };
  }, [allproducts]);

  // Categories list
  const categories = useMemo(() => {
    return ['All', ...new Set((allproducts || []).map((p) => p.category).filter(Boolean))];
  }, [allproducts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return (allproducts || []).filter((product) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.productName?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const qty = Number(product.quantity) || 0;
      const min = Number(product.minimumStockLevel) || 10;
      const isOutOfStock = qty === 0;
      const isLowStock = !isOutOfStock && qty <= min;

      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = !isOutOfStock && !isLowStock;
      if (stockFilter === 'Low Stock') matchesStock = isLowStock;
      if (stockFilter === 'Out of Stock') matchesStock = isOutOfStock;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [allproducts, searchQuery, selectedCategory, stockFilter]);

  // Cart Totals
  const totalPrice = useMemo(() => {
    return items.reduce(
      (acc, item) =>
        acc + (Number(item.sellingPrice || item.price) || 0) * (item.quantity ?? 1),
      0
    );
  }, [items]);

  const totalCartCount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity ?? 1), 0);
  }, [items]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-stone-900">
      
      {/* Top Header & Fast Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Sales & POS Terminal
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Search items, verify live stock balances, and ring up customer purchases at the counter.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E8E2D8] text-stone-700 text-xs font-medium rounded-xl hover:bg-[#FAF7F2] hover:border-stone-400 hover:text-stone-900 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={14} className={`text-stone-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stock</span>
          </button>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-xl shadow-xs transition-colors active:scale-[0.98] cursor-pointer"
          >
            <ShoppingCart size={15} />
            <span>Sales Cart</span>
            {totalCartCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white text-stone-900 font-bold text-[11px] shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Real-time Inventory Health Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Items */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">Total Items</span>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">{summary.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] text-stone-700 shadow-xs flex items-center justify-center">
            <Boxes size={20} />
          </div>
        </div>

        {/* Healthy Stock */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">Healthy Stock</span>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">{summary.healthyStock}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EEF5EE] border border-emerald-200 text-emerald-800 shadow-xs flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">Low Stock Alert</span>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">{summary.lowStock}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FDF6ED] border border-amber-200 text-amber-800 shadow-xs flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-[#E8E2D8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">Out of Stock</span>
            <p className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">{summary.outOfStock}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F2] border border-rose-200 text-rose-800 shadow-xs flex items-center justify-center">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex items-center flex-1">
          <Search className="absolute left-3.5 text-stone-400 pointer-events-none" size={15} />
          <input
            type="text"
            placeholder="Search catalog by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-stone-900 text-xs placeholder-stone-400 focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200 outline-none transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative flex items-center md:w-52">
          <Layers className="absolute left-3.5 text-stone-400 pointer-events-none" size={15} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl text-stone-800 text-xs font-medium focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200 outline-none cursor-pointer appearance-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Pills */}
        <div className="flex gap-1 p-1 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl overflow-x-auto">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStockFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                stockFilter === status
                  ? 'bg-stone-900 text-stone-50 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#EAE4D9]/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* POS Product Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-[#E8E2D8]">
          <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-stone-600">Loading catalog items...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E2D8] shadow-xs p-6">
          <Package className="mx-auto text-stone-400 mb-3" size={36} />
          <h3 className="text-base font-serif font-bold text-stone-900">No products match current filters</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All" categories, or resetting the stock status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((product) => {
            const currentStock = Number(product.quantity) || 0;
            const minThreshold = Number(product.minimumStockLevel) || 10;
            const isOutOfStock = currentStock === 0;
            const isLowStock = !isOutOfStock && currentStock <= minThreshold;

            const badgeConfig = isOutOfStock
              ? { label: 'Out of Stock', bg: 'bg-[#FDF2F2] text-rose-800 border-rose-200', dot: 'bg-rose-600' }
              : isLowStock
              ? { label: 'Low Stock', bg: 'bg-[#FDF6ED] text-amber-800 border-amber-200', dot: 'bg-amber-600' }
              : { label: 'In Stock', bg: 'bg-[#EEF5EE] text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' };

            return (
              <div
                key={product._id}
                className="flex flex-col bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#D8CFBF] transition-all p-4.5 shadow-xs relative group"
              >
                {/* Header: Image & Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-13 h-13 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {product.productImage ? (
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={22} className="text-stone-400" />
                    )}
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${badgeConfig.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
                    {badgeConfig.label}
                  </span>
                </div>

                {/* Name & Description */}
                <div className="mb-2">
                  <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {product.description || "General retail merchandise"}
                  </p>
                </div>

                {/* SKU & Category Chips */}
                <div className="flex items-center justify-between mb-3 text-[10px]">
                  <span className="font-mono text-stone-700 bg-[#FAF7F2] border border-[#E8E2D8] px-2 py-0.5 rounded font-medium">
                    {product.sku}
                  </span>
                  <span className="font-medium border border-[#E5DCCE] bg-[#F5EFE6] text-stone-700 px-2 py-0.5 rounded">
                    {product.category || "General"}
                  </span>
                </div>

                {/* Pricing & Current Stock Balance */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-[#E8E2D8] text-xs mb-3">
                  <div>
                    <span className="text-[10px] font-medium text-stone-500 uppercase">Selling Price</span>
                    <p className="font-bold text-stone-900 text-base">
                      ₦{(Number(product.sellingPrice) || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-stone-500 uppercase">Available</span>
                    <p className={`font-medium text-xs mt-0.5 ${isOutOfStock ? 'text-rose-700 font-semibold' : 'text-stone-700'}`}>
                      {currentStock} unit{currentStock === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => pushCart(product)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    isOutOfStock
                      ? "bg-[#FAF7F2] text-stone-400 cursor-not-allowed border border-[#E8E2D8]"
                      : "bg-stone-900 hover:bg-stone-800 text-stone-50 active:scale-[0.98]"
                  }`}
                >
                  <Plus size={14} />
                  {isOutOfStock ? "Sold Out" : "Add to Sale Cart"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Drawer Overlay & Panel */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-[#E8E2D8] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out text-stone-900 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Drawer Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex justify-between items-center bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <ShoppingCart size={16} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-stone-900">Current Sales Cart</h2>
              <p className="text-xs text-stone-500 font-normal">
                {totalCartCount} item{totalCartCount === 1 ? '' : 's'} selected
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-[#EAE4D9] hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center p-6">
              <div className="w-14 h-14 bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl flex items-center justify-center text-stone-400 mb-3">
                <ShoppingCart size={28} />
              </div>
              <p className="text-stone-900 font-serif font-bold text-sm">Your cart is currently empty</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Select products from the catalog to ring up a new customer sale.
              </p>
            </div>
          ) : (
            items.map((item, index) => {
              const itemPrice = Number(item.sellingPrice || item.price) || 0;
              const itemQty = item.quantity ?? 1;
              const maxStock = item.stock ?? item.quantity ?? 9999;
              const atMaxStock = itemQty >= maxStock;

              return (
                <div
                  key={index}
                  className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex flex-col gap-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-lg border border-[#E8E2D8] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-semibold text-stone-600 border border-[#E8E2D8]">
                          {index + 1}
                        </div>
                      )}

                      <div className="truncate">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {item.productName}
                        </h4>
                        <span className="text-[11px] font-normal text-stone-600 mt-0.5 block">
                          ₦{itemPrice.toLocaleString()} each
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== index))}
                      className="text-stone-400 hover:text-rose-700 p-1 rounded transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8]">
                    <div className="flex items-center border border-[#E8E2D8] rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => {
                          setItems(
                            items
                              .map((cartItem, i) => {
                                if (i === index) {
                                  const currentQty = cartItem.quantity ?? 1;
                                  if (currentQty > 1) {
                                    return { ...cartItem, quantity: currentQty - 1 };
                                  }
                                  return null;
                                }
                                return cartItem;
                              })
                              .filter(Boolean)
                          );
                        }}
                        className="px-2.5 py-1 text-stone-700 hover:bg-[#FAF7F2] transition-colors font-medium text-xs cursor-pointer"
                        title="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-stone-900 bg-[#FAF7F2] min-w-[2rem] text-center">
                        {itemQty}
                      </span>
                      <button
                        onClick={() => {
                          setItems(
                            items.map((cartItem, i) => {
                              if (i === index) {
                                const currentQty = cartItem.quantity ?? 1;
                                const max = cartItem.stock ?? 9999;
                                if (currentQty < max) {
                                  return { ...cartItem, quantity: currentQty + 1 };
                                } else {
                                  toast.error("Reached maximum available stock!");
                                }
                              }
                              return cartItem;
                            })
                          );
                        }}
                        disabled={atMaxStock}
                        className="px-2.5 py-1 text-stone-700 hover:bg-[#FAF7F2] transition-colors font-medium text-xs disabled:opacity-30 cursor-pointer"
                        title="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        ₦{(itemPrice * itemQty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Drawer Action Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8E2D8] bg-[#FAF7F2] space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-stone-600">Order Subtotal:</span>
              <span className="font-bold text-2xl text-stone-900">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setItems([])}
                className="w-1/3 py-2.5 px-3 border border-[#E8E2D8] bg-white text-stone-700 rounded-xl text-xs font-medium hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-2/3 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Pay</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Payment Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onRequestClose={() => setCheckoutModalOpen(false)}
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
            maxWidth: "500px",
            border: "1px solid #E8E2D8",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 40px rgba(28, 25, 23, 0.12)",
            overflow: "hidden",
            color: "#1C1917",
          },
        }}
        contentLabel="Checkout Modal"
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4.5 border-b border-[#E8E2D8] bg-[#FAF7F2]">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Finalize Sale & Payment</h3>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                {totalCartCount} item{totalCartCount === 1 ? '' : 's'} in checkout register
              </p>
            </div>
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 hover:bg-[#EAE4D9] hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5">
            {/* Order Items Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Line Items
              </span>
              <div className="max-h-36 overflow-y-auto flex flex-col divide-y divide-[#E8E2D8] border border-[#E8E2D8] rounded-xl bg-[#FAF7F2]">
                {items.map((item, idx) => {
                  const itemPrice = Number(item.sellingPrice || item.price) || 0;
                  const itemQty = item.quantity ?? 0;
                  return (
                    <div key={idx} className="flex justify-between items-center gap-2 px-3.5 py-2.5 text-xs">
                      <span className="text-stone-700 truncate">
                        <strong className="text-stone-900 font-semibold">{itemQty}x</strong> {item.productName}
                      </span>
                      <span className="font-bold text-stone-900 whitespace-nowrap">
                        ₦{(itemPrice * itemQty).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Amount Banner */}
            <div className="flex justify-between items-center bg-[#FAF7F2] border border-[#E8E2D8] p-4 rounded-xl text-stone-900">
              <span className="text-xs uppercase font-medium tracking-wider text-stone-500">
                Grand Total Due
              </span>
              <span className="text-2xl font-bold text-stone-900">₦{totalPrice.toLocaleString()}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Select Customer Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'Card', label: 'POS Card', icon: CreditCard },
                  { id: 'Transfer', label: 'Transfer', icon: Receipt },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = paymentMethod === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-medium border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-stone-900 text-stone-900 font-bold shadow-xs'
                          : 'bg-white border-[#E8E2D8] text-stone-600 hover:border-stone-400 hover:text-stone-900'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 px-6 py-4.5 border-t border-[#E8E2D8] bg-[#FAF7F2]">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="w-1/3 py-2.5 border border-[#E8E2D8] text-stone-700 bg-white rounded-xl text-xs font-medium hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCheckOut}
              disabled={loadingCheckout}
              className="w-2/3 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingCheckout ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Recording Transaction...</span>
                </>
              ) : (
                "Complete Sale & Record"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryGrid;