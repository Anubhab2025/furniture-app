"use client";

import type React from "react";
import { useAdmin } from "@/src/contexts/AdminContext";
import { useEmployee } from "@/src/contexts/EmployeeContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Plus,
  User,
  Mail,
  Phone,
  MessageCircle,
  Edit3,
  X,
  Camera,
  Upload,
  Trash2,
  Save,
  Search,
  Filter,
} from "lucide-react";
import Image from "next/image";
import type { Quotation, QuotationItem } from "@/src/types/index";

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdmin();
  const { createQuotation } = useEmployee();
  const { user } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any | null>(null);
  const [showQuotationModal, setShowQuotationModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Fallback persist
  useEffect(() => {
    try {
      localStorage.setItem("admin-customers", JSON.stringify(customers));
    } catch {}
  }, [customers]);

  /* ────────────────────── Filtered Customers ────────────────────── */
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase().trim();
    return customers.filter((c) => {
      return (
        c.id.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        c.phone.includes(query) ||
        (c.whatsapp && c.whatsapp.includes(query))
      );
    });
  }, [customers, searchQuery]);

  /* ────────────────────── Add / Edit Customer ────────────────────── */
  const resetForm = () => {
    setFormData({ name: "", phone: "", whatsapp: "", email: "" });
    setShowAddForm(false);
    setEditingCustomer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Name and Phone are required fields");
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
      try {
        const next = customers.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        );
        localStorage.setItem("admin-customers", JSON.stringify(next));
      } catch {}
      alert("Customer updated!");
    } else {
      const newCustomer = {
        id: `cust-${Date.now()}`,
        ...formData,
        tags: ["new"],
        assignedEmployeeId: user?.id ?? "emp-1",
        createdAt: new Date().toISOString(),
      };
      addCustomer(newCustomer);
      try {
        const next = [...customers, newCustomer];
        localStorage.setItem("admin-customers", JSON.stringify(next));
      } catch {}
      alert("Customer added!");
    }
    resetForm();
  };

  const openEdit = (customer: any) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      whatsapp: customer.whatsapp,
    });
    setEditingCustomer(customer);
  };

  const confirmDelete = (customer: any) => {
    if (window.confirm(`Delete ${customer.name}? This cannot be undone.`)) {
      deleteCustomer(customer.id);
      try {
        const next = customers.filter((c) => c.id !== customer.id);
        localStorage.setItem("admin-customers", JSON.stringify(next));
      } catch {}
      alert("Customer deleted");
    }
  };

  /* ────────────────────── Quotation Modal ────────────────────── */
  const openQuotation = (customerId: string) => setShowQuotationModal(customerId);
  const closeQuotation = () => setShowQuotationModal(null);

  const scrollLockRef = useRef(0);
  const modalOpen = Boolean(showAddForm || editingCustomer || viewingCustomer || showQuotationModal);

  useEffect(() => {
    const body = document.body;
    if (modalOpen) {
      scrollLockRef.current = window.scrollY;
      body.classList.add("scroll-lock");
      body.style.top = `-${scrollLockRef.current}px`;
    } else {
      body.classList.remove("scroll-lock");
      body.style.top = "";
      window.scrollTo(0, scrollLockRef.current);
    }
    return () => {
      body.classList.remove("scroll-lock");
      body.style.top = "";
    };
  }, [modalOpen]);

  return (
    <div className="custom-scroll min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="hidden sm:flex text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent items-center gap-2">
            <User className="w-7 h-7 md:w-8 md:h-8" />
            My Customers
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>

        {/* ───── Search & Filter Bar ───── */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Filter className="w-3 h-3" />
            <span>
              {filteredCustomers.length} of {customers.length} customers
            </span>
          </div>
        </div>

        {/* ───── Add / Edit Form Modal ───── */}
        {(showAddForm || editingCustomer) && (
          <div className="custom-scroll fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {editingCustomer ? "Edit Customer" : "New Customer"}
                </h2>
                <button onClick={resetForm} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <InputField
                  label="Name *"
                  type="text"
                  placeholder="Customer name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <InputField
                  label="Phone *"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <InputField
                  label="WhatsApp"
                  type="tel"
                  placeholder="WhatsApp number"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingCustomer ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ───── View Customer Modal ───── */}
        {viewingCustomer && (
          <div className="custom-scroll fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Customer Details
                </h2>
                <button
                  onClick={() => setViewingCustomer(null)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {viewingCustomer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {viewingCustomer.name}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {viewingCustomer.id}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{viewingCustomer.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{viewingCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>{viewingCustomer.whatsapp || "—"}</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      openEdit(viewingCustomer);
                      setViewingCustomer(null);
                    }}
                    className="flex-1 bg-green-100 text-green-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      openQuotation(viewingCustomer.id);
                      setViewingCustomer(null);
                    }}
                    className="flex-1 bg-indigo-100 text-indigo-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Quotation
                  </button>
                  <button
                    onClick={() => confirmDelete(viewingCustomer)}
                    className="flex-1 bg-red-100 text-red-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── Customer List ───── */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-5 py-4 md:px-6 md:py-5 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-green-500" />
              Customer List ({filteredCustomers.length})
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Email", "Phone", "WhatsApp", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c, i) => (
                  <CustomerRow
                    key={c.id}
                    customer={c}
                    index={i}
                    openQuotation={openQuotation}
                    openEdit={openEdit}
                    openView={(cust) => setViewingCustomer(cust)}
                    deleteCustomer={() => confirmDelete(c)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {filteredCustomers.map((c, i) => (
              <div
                key={c.id}
                className={`p-4 rounded-xl border ${
                  i % 2 === 0 ? "bg-white border-gray-100" : "bg-gray-50 border-transparent"
                } shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-500">{c.id}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{c.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>{c.whatsapp || "—"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex items-center justify-center gap-1 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openQuotation(c.id)}
                    className="flex items-center justify-center gap-1 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 px-4">
              {searchQuery ? (
                <>
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No customers found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search query.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No customers yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by adding your first customer.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    Add Customer
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ───── Quotation Modal ───── */}
      {showQuotationModal && (
        <QuotationModal
          customerId={showQuotationModal}
          onClose={closeQuotation}
          createQuotation={createQuotation}
          user={user}
        />
      )}
    </div>
  );
}

/* ────────────────────── Reusable Input ────────────────────── */
function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 text-sm"
      />
    </div>
  );
}

/* ────────────────────── Desktop Row ────────────────────── */
function CustomerRow({
  customer,
  index,
  openQuotation,
  openEdit,
  openView,
  deleteCustomer,
}: {
  customer: any;
  index: number;
  openQuotation: (id: string) => void;
  openEdit: (cust: any) => void;
  openView: (cust: any) => void;
  deleteCustomer: () => void;
}) {
  return (
    <tr
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-gray-100 transition-colors duration-200`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="w-4 h-4 text-gray-400 mr-2" />
          {customer.email || "—"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex items-center">
          <Phone className="w-4 h-4 text-gray-400 mr-2" />
          {customer.phone}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div className="flex items-center">
          <MessageCircle className="w-4 h-4 text-green-500 mr-2" />
          {customer.whatsapp || "—"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => openEdit(customer)}
            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openQuotation(customer.id)}
            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition"
            title="Create Quotation"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={deleteCustomer}
            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ────────────────────── Quotation Modal (unchanged) ────────────────────── */
// ... [Keep your existing QuotationModal component exactly as is]

/* ────────────────────── Quotation Modal ────────────────────── */
function QuotationModal({
  customerId,
  onClose,
  createQuotation,
  user,
}: {
  customerId: string;
  onClose: () => void;
  createQuotation: (q: Quotation) => void;
  user: any;
}) {
  const { products, customers } = useAdmin();

  const [items, setItems] = useState<QuotationItem[]>([]);
  const [tax] = useState(18);
  const [showCamera, setShowCamera] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lock background scroll while modal is open (covers iOS Safari quirks)
  useEffect(() => {
    const body = document.body;
    const scrollY = window.scrollY;

    const original = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement | null;
    const originalViewportContent = viewport?.getAttribute("content") ?? null;

    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }

    return () => {
      body.style.overflow = original.overflow;
      body.style.position = original.position;
      body.style.top = original.top;
      body.style.width = original.width;

      window.scrollTo(0, scrollY);

      if (viewport && originalViewportContent) {
        viewport.setAttribute("content", originalViewportContent);
      }
    };
  }, []);

  const addCustomItem = () => {
    const id = `custom-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      { productId: id, quantity: 1, price: 0, discount: 0, customTitle: "" },
    ]);
  };

  const updateItem = (productId: string, updates: Partial<QuotationItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, ...updates } : i))
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const openCamera = async (productId: string) => {
    try {
      // Check if we're in a secure context (required for camera access)
      if (!window.isSecureContext) {
        alert("Camera access requires a secure context (HTTPS or localhost)");
        return;
      }

      // Request camera permissions
      const permissionResult = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      if (permissionResult.state === "denied") {
        alert(
          "Camera permission was denied. Please enable it in your browser settings."
        );
        return;
      }

      setShowCamera(productId);

      try {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => {
            console.error("Error playing video stream:", e);
            alert(
              "Error accessing camera. Please make sure no other app is using it."
            );
            closeCamera();
          });
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert(
          "Could not access the camera. Please check your permissions and try again."
        );
        setShowCamera(null);
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      alert("Error checking camera permissions. Please try again.");
      setShowCamera(null);
    }
  };

  const capturePhoto = (productId: string) => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      updateItem(productId, { customPhoto: base64 });
      closeCamera();
    }
  };

  const closeCamera = () => {
    setShowCamera(null);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
    }
  };

  const handleFileUpload = (
    productId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      updateItem(productId, { customPhoto: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const subtotal = items.reduce(
    (s, i) => s + i.price * i.quantity - i.discount,
    0
  );
  const taxAmount = Math.round((subtotal * tax) / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }
    const quotation: Quotation = {
      id: `quot-${Date.now()}`,
      customerId,
      employeeId: user?.id || "emp-1",
      items,
      subtotal,
      tax: taxAmount,
      discount: 0,
      total,
      status: "draft",
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createQuotation(quotation);
    alert("Quotation saved as draft!");
    onClose();
  };

  const customer = customers.find((c) => c.id === customerId);

  return (
    <div className="custom-scroll fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="custom-scroll bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] md:h-[100vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
        <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Create Quotation
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-2">Customer</h3>
              <p className="text-sm">
                {customer?.name} - {customer?.phone}
              </p>
            </div>

            <button
              onClick={addCustomItem}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>

            {items.length > 0 && (
              <div className="space-y-4">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={item.productId}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          {product ? (
                            <h4 className="font-semibold text-gray-800">
                              {product.title}
                            </h4>
                          ) : (
                            <input
                              type="text"
                              placeholder="Item title"
                              value={item.customTitle || ""}
                              onChange={(e) =>
                                updateItem(item.productId, {
                                  customTitle: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{Number(item.price || 0).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 p-2 rounded-lg hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {showCamera === item.productId && (
                        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                          <div className="bg-white p-5 rounded-2xl w-full max-w-sm">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold">Take Photo</h4>
                              <button
                                onClick={closeCamera}
                                className="p-1 rounded hover:bg-gray-100"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              className="w-full h-56 rounded-lg bg-gray-200"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => capturePhoto(item.productId)}
                                className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-1"
                              >
                                <Camera className="w-4 h-4" />
                                Capture
                              </button>
                              <button
                                onClick={closeCamera}
                                className="flex-1 bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <label className="text-xs text-gray-500 block mb-3 font-medium">
                          Custom Photo
                        </label>
                        <div className="flex gap-4 items-start">
                          <div className="flex-shrink-0">
                            {item.customPhoto ? (
                              <div className="relative group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-green-200 shadow-md">
                                  <Image
                                    src={item.customPhoto}
                                    alt="Item photo"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                    Photo added
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <Camera className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                              <button
                                onClick={() => openCamera(item.productId)}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                              >
                                <Camera className="w-4 h-4" />
                                Take Photo
                              </button>
                              <label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                                <Upload className="w-4 h-4" />
                                Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileUpload(item.productId, e)
                                  }
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {item.customPhoto && (
                              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                                <div className="flex items-center gap-2 text-green-700">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium">
                                    Photo successfully added!
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    updateItem(item.productId, {
                                      customPhoto: undefined,
                                    })
                                  }
                                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Remove photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {["Qty", "Price", "Disc"].map((lbl, idx) => {
                          const key = ["quantity", "price", "discount"][
                            idx
                          ] as keyof QuotationItem;
                          return (
                            <div key={lbl}>
                              <label className="text-xs text-gray-500 block mb-1">
                                {lbl}
                              </label>
                              <input
                                type="number"
                                min={idx === 0 ? 1 : 0}
                                value={item[key] || ""}
                                onChange={(e) =>
                                  updateItem(item.productId, {
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-3 sticky top-24">
              <h3 className="font-semibold mb-2 text-gray-800 text-sm">
                Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs">Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-xs">Tax (18%)</span>
                  <span className="font-medium">
                    ₹{taxAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-800 text-sm">Total</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2 mt-3 p-1">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-1.5 rounded-lg font-semibold text-xs"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded-lg font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
