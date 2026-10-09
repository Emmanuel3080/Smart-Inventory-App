import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, AlertCircle, Plus, X, Package } from 'lucide-react';
import { productContext } from '../Contexts/ProductContext';
import { toast } from 'sonner';
import ModernAdminHeader from '../Common/AdminHeader';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';

const productSchema = yup.object({
  productName: yup.string().required("Product name is required"),
  sku: yup.string().uppercase().required("SKU code is required"),
  description: yup.string().required("Item description is required"),
  category: yup
    .string()
    .oneOf(
      ["Electronics", "Groceries", "Clothing", "Furniture", "Pharmacy", "Stationery", "Accessories", "Other"],
      "Please select a valid category"
    )
    .required("Category designation is required"),
  supplier: yup
    .string()
    .required("An authorized supplier must be selected")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid supplier selection format"),
  quantity: yup
    .number()
    .typeError("Initial stock must be a number")
    .integer("Stock count cannot be fractional")
    .min(0, "Stock cannot be negative")
    .default(0),
  unitPrice: yup
    .number()
    .typeError("Unit cost price must be a number")
    .positive("Unit cost price must be greater than zero")
    .required("Unit purchase cost is required"),
  sellingPrice: yup
    .number()
    .typeError("Selling price must be a number")
    .positive("Selling price must be greater than zero")
    .required("Selling retail price is required")
    .test(
      "price-floor-integrity",
      "Selling price cannot be lower than the cost price",
      function (value) {
        const { unitPrice } = this.parent;
        return !unitPrice || value >= unitPrice;
      }
    ),
  minimumStockLevel: yup
    .number()
    .typeError("Reorder threshold must be a number")
    .integer("Must be a whole number")
    .min(0, "Safety threshold cannot be negative")
    .default(5),
  expiryDate: yup
    .date()
    .nullable()
    .required("Expiry date is required")
    .typeError("Please input a valid date format"),
});

const categories = [
  "Electronics",
  "Groceries",
  "Clothing",
  "Furniture",
  "Pharmacy",
  "Stationery",
  "Accessories",
  "Other",
];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [preview, setPreview] = useState(null);

  const { fetchSingleProduct, singleProduct, updateProduct, loadUpdateProp } =
    useContext(productContext);

  const baseUrl = import.meta.env.VITE_API_URL;

  const loadSuppliers = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/suppliers/all`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("accesToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSuppliers(data.suppliers || []);
      } else {
        toast.error("Unable to load suppliers");
      }
    } catch (error) {
      console.error("Failed fetching supplier records", error);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const {
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (id) {
      fetchSingleProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (singleProduct && singleProduct._id) {
      let formattedDate = "";
      if (singleProduct.expiryDate) {
        try {
          formattedDate = new Date(singleProduct.expiryDate).toISOString().split("T")[0];
        } catch {
          formattedDate = "";
        }
      }

      reset({
        productName: singleProduct.productName || "",
        sku: singleProduct.sku || "",
        description: singleProduct.description || "",
        category: singleProduct.category || "",
        supplier: singleProduct.supplier?._id || singleProduct.supplier || "",
        quantity: singleProduct.quantity || 0,
        unitPrice: singleProduct.unitPrice || 0,
        sellingPrice: singleProduct.sellingPrice || 0,
        minimumStockLevel: singleProduct.minimumStockLevel || 0,
        expiryDate: formattedDate,
      });

      if (singleProduct.productImage) {
        setPreview(singleProduct.productImage);
      }
    }
  }, [singleProduct, reset]);

  const productImageFile = watch("productImage");

  useEffect(() => {
    if (productImageFile && productImageFile.length > 0) {
      const file = productImageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [productImageFile]);

  const removeImage = () => {
    setPreview(null);
    setValue("productImage", null);
  };

  const handleErr = (err) => {
    const firstErr = Object.values(err)[0]?.message;
    if (firstErr) {
      toast.error(firstErr);
    }
  };

  const onSubmit = async (data) => {
    try {
      await updateProduct(data, singleProduct?._id || id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 pb-20 selection:bg-stone-200 selection:text-stone-900">
      <ModernAdminHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors group px-3.5 py-1.5 rounded-xl bg-white border border-[#E8E2D8] hover:border-stone-400 shadow-xs"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 text-stone-500" />
            Back to Inventory Catalog
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#E8E2D8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Update Product Specifications
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Modify pricing levels, safety stock thresholds, and product catalog metadata.
          </p>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit, handleErr)}
          className="bg-white border border-[#E8E2D8] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#E8E2D8]"
          noValidate
        >
          {/* Section 1: Core Specifications */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8]">
                <Package size={15} className="text-stone-700" />
              </div>
              <span>1. Item Specifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Product Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Logitech MX Master 3S Mouse"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                    errors.productName
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("productName")}
                />
                {errors.productName && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.productName.message}
                  </p>
                )}
              </div>

              {/* SKU Tracking Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  SKU Tracking Code <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. LOGI-MSE-MX3-BLK"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs font-mono uppercase text-stone-900 placeholder-stone-400 outline-none transition-all ${
                    errors.sku
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("sku")}
                />
                {errors.sku && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.sku.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Item Description <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Detailed inventory description, package contents, dimensions..."
                className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs text-stone-900 placeholder-stone-400 outline-none transition-all ${
                  errors.description
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Category Classification <span className="text-rose-600">*</span>
                </label>
                <select
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs text-stone-900 outline-none transition-all ${
                    errors.category
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("category")}
                >
                  <option value="" className="text-stone-400">Select industry category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.category.message}
                  </p>
                )}
              </div>

              {/* Supplier Node */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    Supplier Route <span className="text-rose-600">*</span>
                  </label>
                  <Link
                    to="/add/supplier"
                    className="text-[11px] font-medium text-stone-700 hover:text-stone-900 inline-flex items-center gap-0.5"
                  >
                    <Plus size={12} /> Add new
                  </Link>
                </div>
                <select
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs text-stone-900 outline-none transition-all ${
                    errors.supplier
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("supplier")}
                >
                  <option value="" className="text-stone-400">Select registered supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup._id} value={sup._id}>
                      {sup.supplierName} ({sup.companyName})
                    </option>
                  ))}
                </select>
                {errors.supplier && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.supplier.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Financials & Stock Quantities */}
          <div className="p-6 sm:p-8 space-y-5 bg-[#FAF7F2]/40">
            <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8]">
                <span className="text-stone-800 text-xs font-bold">₦</span>
              </div>
              <span>2. Stock Balances & Pricing (NGN)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Initial Stock */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Current Units <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs font-semibold text-stone-900 outline-none transition-all ${
                    errors.quantity
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <p className="text-[11px] font-medium text-rose-600">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Unit Cost Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Cost Price (₦) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs font-semibold text-stone-900 outline-none transition-all ${
                    errors.unitPrice
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("unitPrice")}
                />
                {errors.unitPrice && (
                  <p className="text-[11px] font-medium text-rose-600">
                    {errors.unitPrice.message}
                  </p>
                )}
              </div>

              {/* Selling Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Selling Price (₦) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs font-semibold text-stone-900 outline-none transition-all ${
                    errors.sellingPrice
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("sellingPrice")}
                />
                {errors.sellingPrice && (
                  <p className="text-[11px] font-medium text-rose-600">
                    {errors.sellingPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Minimum Stock Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Low Stock Alert Floor <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="5"
                  min="0"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs font-semibold text-stone-900 outline-none transition-all ${
                    errors.minimumStockLevel
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("minimumStockLevel")}
                />
                {errors.minimumStockLevel && (
                  <p className="text-[11px] font-medium text-rose-600">
                    {errors.minimumStockLevel.message}
                  </p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Expiry Date <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  className={`w-full px-3.5 py-2.5 bg-[#FAF7F2] border rounded-xl text-xs text-stone-900 outline-none transition-all ${
                    errors.expiryDate
                      ? 'border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                      : 'border-[#E8E2D8] focus:bg-white focus:border-stone-400 focus:ring-2 focus:ring-stone-200'
                  }`}
                  {...register("expiryDate")}
                />
                {errors.expiryDate && (
                  <p className="text-[11px] font-medium text-rose-600">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Product Image Upload with Preview */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D8]">
                <ImageIcon size={15} className="text-stone-700" />
              </div>
              <span>3. Product Imagery</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Thumbnail Container */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#FAF7F2] border-2 border-dashed border-[#E8E2D8] flex items-center justify-center overflow-hidden flex-shrink-0 group">
                {preview ? (
                  <>
                    <img src={preview} alt="Product Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs hover:bg-rose-700 cursor-pointer"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={28} className="text-stone-400" />
                )}
              </div>

              <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                <label
                  htmlFor="product-image-input"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E2D8] bg-white hover:bg-[#FAF7F2] text-stone-800 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <ImageIcon size={15} />
                  Choose Product Image
                </label>
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  {...register("productImage")}
                />
                <p className="text-[11px] text-stone-500">
                  PNG, JPG, or WEBP up to 5MB. Cloud hosted automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="p-5 sm:p-6 bg-[#FAF7F2] flex items-center justify-end gap-3 border-t border-[#E8E2D8]">
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-stone-700 text-xs font-medium hover:bg-[#FAF7F2] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loadUpdateProp}
              className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loadUpdateProp ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Updating Product...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Updated Specifications</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;