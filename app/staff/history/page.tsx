"use client"

import type { Quotation, QuotationItem } from "@/types/index"
import { useEmployee } from "@/src/contexts/EmployeeContext"
import { useAdmin } from "@/src/contexts/AdminContext"
import { useState, useRef, useEffect } from "react"
import { History, Filter, Edit3, Eye, Clock, DollarSign, User, Plus, Camera, Upload, Trash2, X, Send, MessageCircle, Mail } from "lucide-react"
import Image from "next/image"

export default function HistoryPage() {
  const { quotations, updateQuotation, sendQuotation } = useEmployee()
  const { customers, products } = useAdmin()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
  const [sendingQuotation, setSendingQuotation] = useState<Quotation | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [sendMethod, setSendMethod] = useState<"whatsapp" | "email">("whatsapp")
  const [items, setItems] = useState<QuotationItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(18)
  const [showCamera, setShowCamera] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const filtered = filterStatus === "all" ? quotations : quotations.filter((q) => q.status === filterStatus)

  // Sync form state when editingQuotation changes
  useEffect(() => {
    if (editingQuotation) {
      setSelectedCustomer(editingQuotation.customerId)
      setItems(editingQuotation.items.map(i => ({ ...i })))
      setDiscount(editingQuotation.discount || 0)
      setTax(18)
      setShowCamera(null)
    }
  }, [editingQuotation])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <DollarSign className="w-3 h-3 text-green-600 mr-1" />
      case "sent": return <Eye className="w-3 h-3 text-blue-600 mr-1" />
      case "rejected": return <Clock className="w-3 h-3 text-red-600 mr-1" />
      default: return <Clock className="w-3 h-3 text-yellow-600 mr-1" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800"
      case "sent": return "bg-blue-100 text-blue-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-yellow-100 text-yellow-800"
    }
  }

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer ? customer.name : `Customer ${customerId}`
  }

  const openEdit = (quot: Quotation) => {
    setEditingQuotation(quot)
  }

  const closeEdit = () => {
    setEditingQuotation(null)
    setSelectedCustomer("")
    setItems([])
    setDiscount(0)
    setTax(18)
    setShowCamera(null)
    if (videoRef.current?.srcObject) {
      ;(videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
    }
  }

  const openSend = (quot: Quotation) => {
    setSendingQuotation(quot)
    setSelectedCustomer(quot.customerId)
    setSendMethod("whatsapp")
  }

  const closeSend = () => {
    setSendingQuotation(null)
    setSelectedCustomer("")
  }

  const handleSend = () => {
    if (!sendingQuotation || !selectedCustomer) return
    const customer = customers.find(c => c.id === selectedCustomer)
    if (!customer) return

    if (sendQuotation) {
      sendQuotation(sendingQuotation, sendMethod, customer)
    }
    
    const updatedQuot = { ...sendingQuotation, status: "sent" }
    updateQuotation(updatedQuot)
    
    alert(`Quotation sent via ${sendMethod} to ${customer.name}!`)
    closeSend()
  }

  const addCustomItem = () => {
    const customId = `custom-${Date.now()}`
    setItems([
      ...items,
      { productId: customId, quantity: 1, price: 0, discount: 0, customTitle: "" },
    ])
  }

  const updateItem = (productId: string, updates: Partial<QuotationItem>) => {
    setItems(
      items.map((i) => (i.productId === productId ? { ...i, ...updates } : i))
    )
  }

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId))
  }

  const openCamera = async (productId: string) => {
    try {
      setShowCamera(productId)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera error:", error)
      alert("Unable to access camera")
      setShowCamera(null)
    }
  }

  const capturePhoto = (productId: string) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const base64 = canvas.toDataURL("image/jpeg", 0.8)
        updateItem(productId, { customPhoto: base64 })
        closeCamera()
      }
    }
  }

  const closeCamera = () => {
    setShowCamera(null)
    if (videoRef.current?.srcObject) {
      ;(videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
    }
  }

  const handleFileUpload = (
    productId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        updateItem(productId, { customPhoto: base64 })
      }
      reader.readAsDataURL(file)
    }
 file
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  )
  const taxAmount = Math.round((subtotal * tax) / 100)
  const total = subtotal + taxAmount - discount

  const handleUpdateSubmit = () => {
    if (!selectedCustomer || items.length === 0) {
      alert("Please select a customer and add items")
      return
    }

    if (!editingQuotation) return

    const updatedQuotation: Quotation = {
      ...editingQuotation,
      customerId: selectedCustomer,
      items,
      subtotal,
      tax: taxAmount,
      discount,
      total,
      updatedAt: new Date().toISOString(),
    }

    updateQuotation(updatedQuotation)
    alert("Quotation updated successfully!")
    closeEdit()
  }

  // Send Modal
  if (sendingQuotation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Send Quotation {sendingQuotation.id} - {getCustomerName(selectedCustomer)}
              </h2>
              <button onClick={closeSend} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Select Customer</h3>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Send Via</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSendMethod("whatsapp")}
                    className={`flex-1 p-3 rounded-lg border ${sendMethod === "whatsapp" ? "bg-green-100 border-green-500 text-green-700" : "border-gray-200 text-gray-700"} hover:bg-gray-50 transition-all`}
                  >
                    <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setSendMethod("email")}
                    className={`flex-1 p-3 rounded-lg border ${sendMethod === "email" ? "bg-blue-100 border-blue-500 text-blue-700" : "border-gray-200 text-gray-700"} hover:bg-gray-50 transition-all`}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-1" />
                    Email
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleSend}
                  disabled={!selectedCustomer}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Now
                </button>
                <button
                  onClick={closeSend}
                  className="w-full bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit Modal
  if (editingQuotation) {
    const currentCustomer = customers.find(c => c.id === editingQuotation.customerId)
    const displayCustomerName = currentCustomer?.name || `Customer ${editingQuotation.customerId}`

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Quotation {editingQuotation.id} - {displayCustomerName}
              </h2>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Customer</h3>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a customer...</option>
                    {customers.length === 0 ? (
                      <option disabled>Loading customers...</option>
                    ) : (
                      customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} - {c.phone}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <button
                  onClick={addCustomItem}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Item
                </button>

                {items.length > 0 && (
                  <div className="space-y-4">
                    {items.map((item) => {
                      const product = products?.find((p) => p.id === item.productId)
                      return (
                        <div key={item.productId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 mr-2">
                              {product ? (
                                <h3 className="font-semibold text-gray-800">{product.title}</h3>
                              ) : (
                                <input
                                  type="text"
                                  value={item.customTitle || ""}
                                  onChange={(e) =>
                                    updateItem(item.productId, { customTitle: e.target.value })
                                  }
                                  placeholder="Enter item title"
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold"
                                />
                              )}
                              <p className="text-sm text-gray-500">₹{item.price.toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {showCamera === item.productId && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                              <div className="bg-white p-4 rounded-xl max-w-md w-full">
                                <h4 className="text-lg font-semibold mb-3">Take Photo</h4>
                                <video
                                  ref={videoRef}
                                  autoPlay
                                  playsInline
                                  className="w-full h-48 object-cover rounded mb-3"
                                />
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={() => capturePhoto(item.productId)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
                                  >
                                    <Camera className="w-4 h-4" />
                                    Capture
                                  </button>
                                  <button
                                    onClick={closeCamera}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mb-4 pb-4 border-b border-gray-100">
                            <label className="text-xs text-gray-500 block mb-2">Custom Photo</label>
                            <div className="flex gap-3 items-start">
                              {item.customPhoto ? (
                                <div className="relative w-16 h-16 bg-gray-100 rounded border overflow-hidden">
                                  <Image
                                    src={item.customPhoto}
                                    alt="Custom photo"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                                  No photo
                                </div>
                              )}
                              <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openCamera(item.productId)}
                                    className="bg-green-500 text-white px-3 py-2 rounded text-sm flex items-center gap-1 hover:bg-green-600"
                                  >
                                    <Camera className="w-4 h-4" />
                                    Take
                                  </button>
                                  <label className="bg-blue-500 text-white px-3 py-2 rounded text-sm cursor-pointer flex items-center gap-1 hover:bg-blue-600">
                                    <Upload className="w-4 h-4" />
                                    Upload
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFileUpload(item.productId, e)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                                {item.customPhoto && (
                                  <button
                                    onClick={() => updateItem(item.productId, { customPhoto: undefined })}
                                    className="text-red-500 text-xs hover:underline flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Qty</label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.productId, { quantity: parseInt(e.target.value) || 1 })}
                                className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Price</label>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItem(item.productId, { price: parseInt(e.target.value) || 0 })}
                                className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Discount</label>
                              <input
                                type="number"
                                min="0"
                                value={item.discount}
                                onChange={(e) => updateItem(item.productId, { discount: parseInt(e.target.value) || 0 })}
                                className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-4 sticky top-0">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax ({tax}%)</span>
                      <span className="font-semibold">₹{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Discount</span>
                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-right"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mb-6 text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleUpdateSubmit}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold"
                    >
                      Update Quotation
                    </button>
                    <button
                      onClick={closeEdit}
                      className="w-full bg-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-400 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <History className="w-8 h-8" />
            Quotation History
          </h1>
        </div>

        <div className="flex justify-end mb-6">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white/50 text-sm font-medium"
            >
              <option value="all">All Quotations</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5 text-green-500" />
              Quotations ({filtered.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((quot, index) => (
                  <tr key={quot.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{quot.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">{getCustomerName(quot.customerId).charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{getCustomerName(quot.customerId)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        {quot.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                        ₹{quot.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quot.status)}`}
                      >
                        {getStatusIcon(quot.status)}
                        {quot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(quot.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openEdit(quot)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openSend(quot)}
                          className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotations yet</h3>
              <p className="text-gray-500 mb-6">Your quotation history will appear here once you create some.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}