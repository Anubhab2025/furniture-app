"use client"

import type React from "react"

import { useAdmin } from "@/src/contexts/AdminContext"
import Image from "next/image"
import { useState } from "react"
import type { Product } from "@/types/index"

export default function CatalogPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [formData, setFormData] = useState<Partial<Product>>({
    title: "",
    category: "Sofa",
    price: 0,
    stock: 0,
    images: [],
    description: "",
  })

  const categories = ["Sofa", "Table", "Chair", "Bed", "Cabinet", "Shelf"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateProduct(editingId, formData)
      setEditingId(null)
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        title: formData.title || "",
        category: formData.category || "Sofa",
        price: formData.price || 0,
        stock: formData.stock || 0,
        images: formData.images || [],
        description: formData.description,
      }
      addProduct(newProduct)
    }
    setFormData({ title: "", category: "Sofa", price: 0, stock: 0, images: [], description: "" })
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setFormData(product)
    setEditingId(product.id)
    setShowForm(true)
  }

  const filtered = filterCategory === "all" ? products : products.filter((p) => p.category === filterCategory)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Furniture Catalog</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ title: "", category: "Sofa", price: 0, stock: 0, images: [], description: "" })
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <select
                value={formData.category || "Sofa"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) })}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative w-full h-48 bg-muted">
              <Image src={product.images[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-1">{product.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              {product.description && <p className="text-xs text-muted-foreground mb-3">{product.description}</p>}
              <p className="text-lg font-bold text-primary mb-3">₹{product.price.toLocaleString()}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                <span className={`text-xs font-medium ${product.stock > 5 ? "text-green-600" : "text-orange-600"}`}>
                  {product.stock > 5 ? "In Stock" : "Low Stock"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 text-primary hover:underline text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete this product?")) {
                      deleteProduct(product.id)
                    }
                  }}
                  className="flex-1 text-destructive hover:underline text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
