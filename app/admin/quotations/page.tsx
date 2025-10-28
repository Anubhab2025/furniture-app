"use client";

import { DUMMY_QUOTATIONS } from "@/src/utils/dummy-data";
import { useState, useEffect } from "react";
import { useAdmin } from "@/src/contexts/AdminContext";
import type { Quotation, QuotationItem } from "@/src/types/index";
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
} from "lucide-react";
import Image from "next/image";

export default function QuotationsPage() {
  const { customers, products } = useAdmin();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("employee-quotations");
      const data = saved ? JSON.parse(saved) : DUMMY_QUOTATIONS;
      setQuotations(data);
    } catch {
      setQuotations(DUMMY_QUOTATIONS);
    }
  }, []);

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

  return (
    <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          All Quotations
        </h1>

        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  {["ID", "Customer", "Amount", "Status", "Date", "Actions"].map((h) => (
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
                {quotations.map((quot, i) => (
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
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Empty State */}
        {quotations.length === 0 && (
          <div className="text-center py-16">
            <Package className="mx-auto w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Quotations Yet
            </h3>
            <p className="text-slate-500">
              Create your first quotation to see it here.
            </p>
          </div>
        )}
      </div>

      {/* === MODAL === */}
      {selectedQuotation && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Quotation {selectedQuotation.id}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
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
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Customer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Name</p>
                    <p className="font-medium text-slate-900">
                      {getCustomerName(selectedQuotation.customerId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600">Phone</p>
                    <p className="font-medium text-slate-900">
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
                                alt={product?.title || item.customTitle || "Item"}
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
                              {product?.title || item.customTitle || "Custom Item"}
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
                      <span>-₹{selectedQuotation.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                    <span className="text-lg font-bold text-slate-900">Total</span>
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
    </div>
  );
}