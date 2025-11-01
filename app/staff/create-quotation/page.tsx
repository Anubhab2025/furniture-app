"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useEmployee } from "@/src/contexts/EmployeeContext";
import { useAdmin } from "@/src/contexts/AdminContext";
import { useAuth } from "@/src/contexts/AuthContext";
import type { Quotation, QuotationItem } from "@/types/index";
import Image from "next/image";
import { Camera, Upload, Trash2, Plus, X } from "lucide-react"; // Assuming lucide-react for icons; install if needed

export default function CreateQuotationPage() {
  const { createQuotation } = useEmployee();
  const { products, customers } = useAdmin(); // Fixed: Fetch customers from useAdmin for consistency
  const { user } = useAuth();

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [tax, setTax] = useState(18);
  const [showCamera, setShowCamera] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addCustomItem = () => {
    const customId = `custom-${Date.now()}`;
    setItems([
      ...items,
      {
        productId: customId,
        quantity: 1,
        price: 0,
        discount: 0,
        customTitle: "",
      },
    ]);
  };

  const updateItem = (productId: string, updates: Partial<QuotationItem>) => {
    setItems(
      items.map((i) => (i.productId === productId ? { ...i, ...updates } : i))
    );
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const openCamera = async (productId: string) => {
    setShowCamera(productId);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const capturePhoto = (productId: string) => {
    if (videoRef.current && canvasRef.current) {
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
    }
  };

  const closeCamera = () => {
    setShowCamera(null);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleFileUpload = (
    productId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        updateItem(productId, { customPhoto: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  );
  const taxAmount = Math.round((subtotal * tax) / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = () => {
    if (!selectedCustomer || items.length === 0) {
      alert("Please select a customer and add items");
      return;
    }

    const quotation: Quotation = {
      id: `quot-${Date.now()}`,
      customerId: selectedCustomer,
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
    alert("Quotation created successfully!");
    setItems([]);
    setSelectedCustomer("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create Quotation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Custom Item Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Select Customer
              </h2>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              >
                <option value="">Choose a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addCustomItem}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Item
            </button>

            {/* Selected Items */}
            {items.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Selected Items ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <div
                        key={item.productId}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 mr-2">
                            {product ? (
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {product.title}
                              </h3>
                            ) : (
                              <input
                                type="text"
                                value={item.customTitle || ""}
                                onChange={(e) =>
                                  updateItem(item.productId, {
                                    customTitle: e.target.value,
                                  })
                                }
                                placeholder="Enter item title"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white font-semibold text-gray-800"
                              />
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Camera Modal */}
                        {showCamera === item.productId && (
                          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
                              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-500" />
                                Take Photo
                              </h3>
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-64 object-cover rounded-xl mb-4 bg-gray-200"
                              />
                              <canvas ref={canvasRef} className="hidden" />
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={() => capturePhoto(item.productId)}
                                  className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                  <Camera className="w-4 h-4" />
                                  Capture
                                </button>
                                <button
                                  onClick={closeCamera}
                                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-5 pb-5 border-b border-gray-100">
                          <label className="text-xs text-gray-500 block mb-3 font-medium">
                            Custom Photo (Visible to Customer)
                          </label>
                          <div className="flex gap-4 items-start">
                            {item.customPhoto ? (
                              <div className="relative w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
                                <Image
                                  src={item.customPhoto || "/placeholder.svg"}
                                  alt="Custom photo"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                                No photo
                              </div>
                            )}
                            <div className="flex-1 space-y-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openCamera(item.productId)}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                  <Camera className="w-4 h-4" />
                                  Take Photo
                                </button>
                                <label className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm font-medium cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md">
                                  <Upload className="w-4 h-4" />
                                  Upload Photo
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
                                <button
                                  onClick={() =>
                                    updateItem(item.productId, {
                                      customPhoto: undefined,
                                    })
                                  }
                                  className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Remove Photo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 block mb-2 font-medium">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(item.productId, {
                                  quantity:
                                    Number.parseInt(e.target.value) || 1,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-2 font-medium">
                              Price (Editable Rate)
                            </label>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                updateItem(item.productId, {
                                  price: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-2 font-medium">
                              Discount
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={item.discount}
                              onChange={(e) =>
                                updateItem(item.productId, {
                                  discount:
                                    Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Summary
              </h2>

              <div className="space-y-4 mb-8 pb-8 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({tax}%)</span>
                  <span className="text-gray-900 font-semibold">
                    ₹{taxAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-8 text-lg">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Save as Draft
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
