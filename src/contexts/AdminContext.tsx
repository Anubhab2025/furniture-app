"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Customer, Product } from "@/src/types/index";
import { DUMMY_CUSTOMERS, DUMMY_PRODUCTS } from "@/src/utils/dummy-data";

interface AdminContextType {
  customers: Customer[];
  products: Product[];
  employees: any[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  const employees = [
    {
      id: "emp-1",
      name: "John Sales",
      email: "employee@furniture.com",
      role: "Sales Staff",
      status: "active",
      quotations: 12,
      conversionRate: 65,
    },
    {
      id: "emp-2",
      name: "Sarah Manager",
      email: "sarah@furniture.com",
      role: "Manager",
      status: "active",
      quotations: 28,
      conversionRate: 78,
    },
  ];

  /* ==================== Load from localStorage on mount ==================== */
  useEffect(() => {
    const loadData = () => {
      try {
        // Customers: prefer unified key, fallback to legacy and employee-specific keys
        const savedCustomers = localStorage.getItem("admin-customers");
        let customersData = savedCustomers ? JSON.parse(savedCustomers) : null;
        if (!customersData) {
          const legacyCustomers = localStorage.getItem("customers");
          const employeeCustomers = localStorage.getItem("employee-customers");
          const legacy = legacyCustomers ? JSON.parse(legacyCustomers) : [];
          const emp = employeeCustomers ? JSON.parse(employeeCustomers) : [];
          // Merge and de-duplicate by id, fallback to DUMMY if empty
          const map = new Map<string, any>();
          [...legacy, ...emp].forEach((c) => map.set(c.id, c));
          const merged = map.size > 0 ? Array.from(map.values()) : DUMMY_CUSTOMERS;
          customersData = merged;
          // Persist migration to unified key
          localStorage.setItem("admin-customers", JSON.stringify(customersData));
        }
        setCustomers(customersData);

        // Products: prefer unified key, fallback to legacy
        const savedProducts = localStorage.getItem("admin-products");
        let productsData = savedProducts ? JSON.parse(savedProducts) : null;
        if (!productsData) {
          const legacyProducts = localStorage.getItem("products");
          productsData = legacyProducts
            ? JSON.parse(legacyProducts)
            : DUMMY_PRODUCTS;
          // Persist migration to unified key
          localStorage.setItem("admin-products", JSON.stringify(productsData));
        }
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load data from localStorage:", error);
        setCustomers(DUMMY_CUSTOMERS);
        setProducts(DUMMY_PRODUCTS);
      }
    };

    loadData();
    setLoaded(true);
  }, []);

  /* ==================== Save to localStorage on change ==================== */
  useEffect(() => {
    if (!loaded) return;
    try {
      const json = JSON.stringify(customers);
      localStorage.setItem("admin-customers", json);
      localStorage.setItem("customers", json);
    } catch {}
  }, [customers, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      const json = JSON.stringify(products);
      localStorage.setItem("admin-products", json);
      localStorage.setItem("products", json);
    } catch {}
  }, [products, loaded]);

  /* ==================== CRUD: Customers ==================== */
  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => {
      const updated = [...prev, customer];
      try {
        const json = JSON.stringify(updated);
        localStorage.setItem("admin-customers", json);
        localStorage.setItem("customers", json);
      } catch {}
      return updated;
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      try {
        const json = JSON.stringify(updated);
        localStorage.setItem("admin-customers", json);
        localStorage.setItem("customers", json);
      } catch {}
      return updated;
    });
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        const json = JSON.stringify(updated);
        localStorage.setItem("admin-customers", json);
        localStorage.setItem("customers", json);
      } catch {}
      return updated;
    });
  };

  /* ==================== CRUD: Products ==================== */
  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = [...prev, product];
      try {
        const json = JSON.stringify(updated);
        localStorage.setItem("admin-products", json);
        localStorage.setItem("products", json);
      } catch {}
      return updated;
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        const json = JSON.stringify(updated);
        localStorage.setItem("admin-products", json);
        localStorage.setItem("products", json);
      } catch {}
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        const json = JSON.stringify(updated);
        localStorage.setItem("admin-products", json);
        localStorage.setItem("products", json);
      } catch {}
      return updated;
    });
  };

  return (
    <AdminContext.Provider
      value={{
        customers,
        products,
        employees,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}