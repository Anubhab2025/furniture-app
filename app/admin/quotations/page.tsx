"use client";

import { DUMMY_QUOTATIONS } from "@/src/utils/dummy-data";
import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "@/src/contexts/AdminContext";
import type { Quotation, QuotationItem } from "@/src/types/index";
import { generateQuotationPDF } from "@/src/utils/pdfGenerator";
import {
  Eye,
  X,
  Package,
  DollarSign,
  Percent,
  Calendar,
  User,
  Camera,
  Upload,
  FileText,
  Search,
} from "lucide-react";
import Image from "next/image";

export default function QuotationsPage() {
  const { customers, products } = useAdmin();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("employee-quotations");
      const data = saved ? JSON.parse(saved) : DUMMY_QUOTATIONS;
      setQuotations(data);
    } catch {
      setQuotations(DUMMY_QUOTATIONS);
    }
  }, []);

  /* ────────────────────── Filtered Quotations ────────────────────── */
  const filteredQuotations = useMemo(() => {
    if (!searchQuery.trim()) return quotations;

    const query = searchQuery.toLowerCase().trim();
    return quotations.filter((quot) => {
      const customer = customers.find(c => c.id === quot.customerId);
      const customerName = customer?.name?.toLowerCase() || "";
      const customerPhone = customer?.phone || "";
      const amount = quot.total.toString();
      const date = new Date(quot.createdAt).toLocaleDateString().toLowerCase();
      const id = quot.id.toLowerCase();

      return (
        id.includes(query) ||
        customerName.includes(query) ||
        customerPhone.includes(query) ||
        amount.includes(query) ||
        date.includes(query)
      );
    });
  }, [quotations, customers, searchQuery]);

  const getCustomerName = (id: string) => {
    return customers.find((c) => c.id === id)?.name || `Customer ${id}`;
  };

  const getCustomerPhone = (id: string) => {
    return customers.find((c) => c.id === id)?.phone || "—";
  };

  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const closeModal = () => setSelectedQuotation(null);

  const generatePDF = async (quotation: Quotation) => {
    try {
      const customer = customers.find(c => c.id === quotation.customerId);
      await generateQuotationPDF(quotation, customer, products);
    } catch (error) {
      console.error('Error generating PDF:', error);
      const printContent = `
        Quotation #${quotation.id}
        Customer: ${getCustomerName(quotation.customerId)}
        Phone: ${getCustomerPhone(quotation.customerId)}
        Date: ${new Date(quotation.createdAt).toLocaleDateString()}
        Status: ${quotation.status.toUpperCase()}

        Items:
        ${quotation.items
          .map((item) => {
            const product = getProduct(item.productId);
            return `${
              product?.title || item.customTitle || "Custom Item"
            } - Qty: ${item.quantity} - Price: ₹${item.price} - Total: ₹${(
              item.price * item.quantity -
              (item.discount || 0)
            ).toLocaleString()}`;
          })
          .join("\n")}

        Subtotal: ₹${quotation.subtotal.toLocaleString()}
        Tax (18%): ₹${quotation.tax.toLocaleString()}
        ${
          quotation.discount > 0
            ? `Discount: -₹${quotation.discount.toLocaleString()}`
            : ""
        }
        Total: ₹${quotation.total.toLocaleString()}
      `;

      const blob = new Blob([printContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${quotation.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          All Quotations
        </h1>

        {/* ───── SEARCH BAR ───── */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name, Phone, Amount, Date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-slate-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Search className="w-3 h-3" />
            {filteredQuotations.length} of {quotations.length} quotations
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  {["ID", "Customer", "Amount", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-4 px-6 font-semibold text-slate-700 text-sm uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotations.map((quot, i) => (
                  <tr
                    key={quot.id}
                    className={`hover:bg-slate-50 transition-all ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="py-4 px-6 font-mono text-sm text-slate-900">
                      {quot.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className=":w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {getCustomerName(quot.customerId)[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {getCustomerName(quot.customerId)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getCustomerPhone(quot.customerId)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      ₹{quot.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(quot.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedQuotation(quot)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden max-h-[70vh] overflow-y-auto pr-2 smooth-scroll-container">
          <div className="space-y-4 pb-4">
            {filteredQuotations.map((quot, i) => (
              <div
                key={quot.id}
                className={`bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl shadow-lg p-5 transition-all ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {getCustomerName(quot.customerId)[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {getCustomerName(quot.customerId)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getCustomerPhone(quot.customerId)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quot.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : quot.status === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : quot.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {quot.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">ID</span>
                    <span className="font-mono text-slate-900">{quot.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </span>
                    <span className="font-semibold text-slate-900">
                      ₹{quot.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Date
                    </span>
                    <span className="text-slate-700">
                      {new Date(quot.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedQuotation(quot)}
                      className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition py-2 px-4 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => generatePDF(quot)}
                      className="flex-1 flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition py-2 px-4 border border-green-200 rounded-lg hover:bg-green-50"
                    >
                      <FileText className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredQuotations.length === 0 && (
          <div className="text-center py-16">
            {searchQuery ? (
              <>
                <Search className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No quotations found
                </h3>
                <p className="text-slate-500 mb-4">
                  Try adjusting your search.
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
                <Package className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No Quotations Yet
                </h3>
                <p className="text-slate-500">
                  Create your first quotation to see it here.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* === MODAL === */}
      {(selectedQuotation || isModalClosing) && selectedQuotation && (
        <div
          className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 ${
            isModalClosing
              ? "bg-black/30 animate-out fade-out duration-300"
              : "bg-black/50 sm:bg-black/60 animate-in fade-in duration-300"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] sm:max-h-[85vh] md:max-h-[90vh] overflow-y-auto ${
              isModalClosing
                ? "animate-out zoom-out-95 duration-300"
                : "animate-in zoom-in-95 duration-300"
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isModalClosing
                ? "modalFadeOut 0.3s ease-in forwards"
                : "modalZoomIn 0.3s ease-out forwards",
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
                  Quotation {selectedQuotation.id}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Created on{" "}
                  {new Date(selectedQuotation.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={() => generatePDF(selectedQuotation)}
                  className="flex items-center gap-1 sm:gap-2 text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm transition px-3 sm:px-4 py-2 border border-green-200 rounded-lg hover:bg-green-50"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Customer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 text-xs sm:text-sm">Name</p>
                    <p className="font-medium text-slate-900 text-sm sm:text-base">
                      {getCustomerName(selectedQuotation.customerId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs sm:text-sm">Phone</p>
                    <p className="font-medium text-slate-900 text-sm sm:text-base">
                      {getCustomerPhone(selectedQuotation.customerId)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items with Photos */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Items ({selectedQuotation.items.length})
                </h3>
                <div className="space-y-4">
                  {selectedQuotation.items.map((item: QuotationItem) => {
                    const product = getProduct(item.productId);
                    const photoSrc = item.customPhoto || product?.image;

                    return (
                      <div
                        key={item.productId}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex gap-5">
                          {/* Photo */}
                          <div className="w-28 h-28 bg-slate-100 rounded-xl overflow-hidden border flex-shrink-0">
                            {photoSrc ? (
                              <Image
                                src={photoSrc}
                                alt={
                                  product?.title || item.customTitle || "Item"
                                }
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                {item.customTitle ? (
                                  <Camera className="w-10 h-10" />
                                ) : (
                                  <Package className="w-10 h-10" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold text-slate-900">
                              {product?.title ||
                                item.customTitle ||
                                "Custom Item"}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-slate-500">Qty</p>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Price</p>
                                <p className="font-medium">
                                  ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500">Discount</p>
                                <p className="font-medium text-red-600">
                                  {item.discount ? `-₹${item.discount}` : "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500">Total</p>
                                <p className="font-semibold text-slate-900">
                                  ₹
                                  {(
                                    item.price * item.quantity -
                                    (item.discount || 0)
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{selectedQuotation.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (18%)</span>
                    <span className="font-medium">
                      ₹{selectedQuotation.tax.toLocaleString()}
                    </span>
                  </div>
                  {selectedQuotation.discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount</span>
                      <span>
                        -₹{selectedQuotation.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                    <span className="text-lg font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                      ₹{selectedQuotation.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold ${
                    selectedQuotation.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : selectedQuotation.status === "sent"
                      ? "bg-blue-100 text-blue-800"
                      : selectedQuotation.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedQuotation.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom smooth scrolling styles */}
      <style jsx global>{`
        .smooth-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.4) rgba(0, 0, 0, 0.03);
        }

        .smooth-scroll-container::-webkit-scrollbar {
          width: 6px;
        }

        .smooth-scroll-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 10px;
        }

        .smooth-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.4);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .smooth-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.6);
        }

        .smooth-scroll-container {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .smooth-scroll-container > div > div {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .smooth-scroll-container > div > div:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        @keyframes modalZoomIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalFadeOut {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
        }

        @media (max-width: 640px) {
          .modal-content {
            margin: 8px;
            max-height: calc(100vh - 16px);
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .smooth-scroll-container > div > div:hover {
            transform: none;
          }

          .smooth-scroll-container > div > div:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
        }
      `}</style>
    </div>
  );
}