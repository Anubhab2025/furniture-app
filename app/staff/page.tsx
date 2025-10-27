"use client"

import { useEmployee } from "@/src/contexts/EmployeeContext"
import { useAuth } from "@/src/contexts/AuthContext"

export default function StaffDashboard() {
  const { quotations } = useEmployee()
  const { user } = useAuth()

  const todayQuotations = quotations.filter((q) => {
    const today = new Date().toDateString()
    return new Date(q.createdAt).toDateString() === today
  })

  const pendingQuotations = quotations.filter((q) => q.status === "draft")
  const sentQuotations = quotations.filter((q) => q.status === "sent")

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', padding: '1.5rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '2rem', height: '2rem', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}>👤</span>
            Welcome, {user?.name}
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Here's your sales overview</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Today's Quotations</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>{todayQuotations.length}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>📄</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Pending</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>{pendingQuotations.length}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>⏰</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Sent</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>{sentQuotations.length}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>💬</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Monthly Target</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>₹50K</p>
              </div>
              <span style={{ fontSize: '2rem' }}>📈</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <a
              href="/staff/create-quotation"
              style={{
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              Create New Quotation
            </a>
            <a
              href="/staff/customers"
              style={{
                background: 'linear-gradient(to right, #16a34a, #15803d)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>👥</span>
              Manage Customers
            </a>
          </div>
        </div>

        {/* Recent Quotations */}
        <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📄</span>
              Recent Quotations
            </h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {quotations.slice(0, 5).map((quot, index) => (
                  <tr key={quot.id} style={{ background: index % 2 === 0 ? 'white' : '#f8fafc', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: '#1e293b' }}>{quot.id}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '2rem', height: '2rem', background: 'linear-gradient(to right, #2563eb, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                          <span style={{ color: 'white', fontWeight: '600', fontSize: '0.75rem' }}>{quot.customerId.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#1e293b' }}>Customer {quot.customerId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: '#1e293b' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>💰</span>
                        ₹{quot.total.toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: quot.status === 'approved' ? '#dcfce7' : quot.status === 'sent' ? '#dbeafe' : quot.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                        color: quot.status === 'approved' ? '#166534' : quot.status === 'sent' ? '#1e40af' : quot.status === 'rejected' ? '#dc2626' : '#d97706'
                      }}>
                        {quot.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>⏰</span>
                        {new Date(quot.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {quotations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1e293b', marginBottom: '0.5rem' }}>No quotations yet</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Get started by creating your first quotation.</p>
              <a
                href="/staff/create-quotation"
                style={{
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                Create Quotation
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}