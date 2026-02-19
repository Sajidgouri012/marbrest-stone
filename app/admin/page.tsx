'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react'
import { adminApi } from '@/lib/adminApi'
import ProjectForm from '@/components/admin/ProjectForm'
import TestimonialForm from '@/components/admin/TestimonialForm'
import StoneTypeForm from '@/components/admin/StoneTypeForm'
import ProductForm from '@/components/admin/ProductForm'

type TabType = 'projects' | 'testimonials' | 'stone_types' | 'products' | 'settings' | 'inquiries'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('projects')
  const [projects, setProjects] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [stoneTypes, setStoneTypes] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [settings, setSettings] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [quoteRequests, setQuoteRequests] = useState<any[]>([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [showStoneTypeForm, setShowStoneTypeForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      fetchData()
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  const fetchData = async () => {
    try {
      const [projectsData, testimonialsData, stoneTypesData, productsData, settingsData, inquiriesData, quoteRequestsData] = await Promise.all([
        adminApi('fetch', 'projects'),
        adminApi('fetch', 'testimonials'),
        adminApi('fetch', 'stone_types'),
        adminApi('fetch', 'products'),
        adminApi('fetch', 'settings'),
        adminApi('fetch', 'contact_inquiries'),
        adminApi('fetch', 'quote_requests'),
      ])

      setProjects(projectsData || [])
      setTestimonials(testimonialsData || [])
      setStoneTypes(stoneTypesData || [])
      setProducts(productsData || [])
      setSettings(settingsData || [])
      setInquiries(inquiriesData || [])
      setQuoteRequests(quoteRequestsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const toggleVisibility = async (table: string, id: string, currentVisibility: boolean) => {
    try {
      await adminApi('update', table, { visible: !currentVisibility }, id)
      fetchData()
    } catch (error: any) {
      console.error('Error toggling visibility:', error)
      alert('Failed to update visibility: ' + error.message)
    }
  }

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      await adminApi('delete', table, undefined, id)
      fetchData()
    } catch (error: any) {
      console.error('Error deleting item:', error)
      alert('Failed to delete: ' + error.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Admin Login</h1>
            <p className="text-gray-600 mb-6">Enter your password to access the admin panel</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gold text-charcoal font-semibold py-3 hover:bg-gold-light transition-colors"
              >
                LOGIN
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-charcoal text-white hover:bg-charcoal-light transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'projects' as TabType, label: 'Projects', count: projects.length },
            { key: 'testimonials' as TabType, label: 'Testimonials', count: testimonials.length },
            { key: 'stone_types' as TabType, label: 'Stone Types', count: stoneTypes.length },
            { key: 'products' as TabType, label: 'Products', count: products.length },
            { key: 'inquiries' as TabType, label: 'Inquiries', count: inquiries.length },
            { key: 'settings' as TabType, label: 'Settings', count: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-gold text-charcoal'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}{tab.count !== null ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingItem(null)
                  setShowProjectForm(true)
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-colors"
              >
                <Plus size={20} />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white p-6 shadow-lg">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-serif font-bold text-charcoal">
                      {project.title}
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Order: {project.display_order ?? 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{project.location}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility('projects', project.id, project.visible)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {project.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-sm">{project.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(project)
                        setShowProjectForm(true)
                      }}
                      className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem('projects', project.id)}
                      className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingItem(null)
                  setShowTestimonialForm(true)
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-colors"
              >
                <Plus size={20} />
                <span>Add New Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-serif font-bold text-charcoal">
                      {testimonial.client_name}
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Order: {testimonial.display_order ?? 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{testimonial.client_title}</p>
                  <p className="text-sm text-gold font-semibold mb-3">{testimonial.company}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">"{testimonial.content}"</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility('testimonials', testimonial.id, testimonial.visible)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {testimonial.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-sm">{testimonial.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(testimonial)
                        setShowTestimonialForm(true)
                      }}
                      className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem('testimonials', testimonial.id)}
                      className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stone_types' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingItem(null)
                  setShowStoneTypeForm(true)
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-colors"
              >
                <Plus size={20} />
                <span>Add New Stone Type</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stoneTypes.map((type) => (
                <div key={type.id} className="bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-bold text-charcoal">
                      {type.name}
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Order: {type.display_order}
                    </span>
                  </div>
                  <p className="text-sm text-gold font-medium mb-2">/{type.slug}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{type.description || 'No description'}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility('stone_types', type.id, type.visible)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {type.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-sm">{type.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(type)
                        setShowStoneTypeForm(true)
                      }}
                      className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem('stone_types', type.id)}
                      className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingItem(null)
                  setShowProductForm(true)
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-colors"
              >
                <Plus size={20} />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-6 shadow-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-xl font-serif font-bold text-charcoal mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gold font-semibold">
                      {product.stone_type?.name || 'No type'}
                    </p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Order: {product.display_order ?? 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.origin}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.features.map((f: string, i: number) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility('products', product.id, product.visible)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {product.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span className="text-sm">{product.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingItem(product)
                        setShowProductForm(true)
                      }}
                      className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteItem('products', product.id)}
                      className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">Inquiries & Quote Requests</h2>
              <p className="text-gray-600">Manage customer inquiries and quote requests</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Total Inquiries: <span className="font-bold text-charcoal text-lg">{inquiries.length + quoteRequests.length}</span>
                </div>
              </div>
              <div className="flex gap-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="px-4 py-2 font-semibold text-charcoal border-b-2 border-gold"
                >
                  Contact Inquiries ({inquiries.length})
                </button>
                <button
                  onClick={() => {
                    const quoteTab = document.getElementById('quote-requests-tab')
                    if (quoteTab) quoteTab.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 font-semibold text-gray-600 hover:text-charcoal"
                >
                  Quote Requests ({quoteRequests.length})
                </button>
              </div>
            </div>

            {/* Contact Inquiries */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Contact Inquiries</h3>
              {inquiries.length === 0 ? (
                <div className="bg-white p-12 text-center shadow-lg">
                  <p className="text-gray-600">No contact inquiries yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white p-6 shadow-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-serif font-bold text-charcoal">
                              {inquiry.name}
                            </h3>
                            <select
                              value={inquiry.status}
                              onChange={async (e) => {
                                try {
                                  await adminApi('update', 'contact_inquiries', { status: e.target.value }, inquiry.id)
                                  fetchData()
                                } catch (error) {
                                  console.error('Error updating status:', error)
                                  alert('Failed to update status')
                                }
                              }}
                              className={`px-3 py-1 text-sm font-semibold rounded ${
                                inquiry.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : inquiry.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="deal_done">Deal Done</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Email:</span>{' '}
                              <a href={`mailto:${inquiry.email}`} className="text-gold hover:underline">
                                {inquiry.email}
                              </a>
                            </div>
                            {inquiry.phone && (
                              <div>
                                <span className="text-gray-500">Phone:</span>{' '}
                                <a href={`tel:${inquiry.phone}`} className="text-gold hover:underline">
                                  {inquiry.phone}
                                </a>
                              </div>
                            )}
                            {inquiry.company && (
                              <div>
                                <span className="text-gray-500">Company:</span> {inquiry.company}
                              </div>
                            )}
                            {inquiry.project_type && (
                              <div>
                                <span className="text-gray-500">Project Type:</span> {inquiry.project_type}
                              </div>
                            )}
                            {inquiry.budget && (
                              <div>
                                <span className="text-gray-500">Budget:</span> {inquiry.budget}
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Date:</span>{' '}
                              {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div className="mb-3">
                            <span className="text-gray-500 text-sm">Message:</span>
                            <p className="text-gray-700 mt-1">{inquiry.message}</p>
                          </div>
                          {inquiry.notes && (
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-500 text-sm">Notes:</span>
                              <p className="text-gray-700 mt-1">{inquiry.notes}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem('contact_inquiries', inquiry.id)}
                          className="ml-4 px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quote Requests */}
            <div id="quote-requests-tab">
              <h3 className="text-lg font-semibold text-charcoal mb-4">Product Quote Requests</h3>
              {quoteRequests.length === 0 ? (
                <div className="bg-white p-12 text-center shadow-lg">
                  <p className="text-gray-600">No quote requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quoteRequests.map((quote) => (
                    <div key={quote.id} className="bg-white p-6 shadow-lg border-l-4 border-gold">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-serif font-bold text-charcoal">
                              {quote.name}
                            </h3>
                            <select
                              value={quote.status}
                              onChange={async (e) => {
                                try {
                                  await adminApi('update', 'quote_requests', { status: e.target.value }, quote.id)
                                  fetchData()
                                } catch (error) {
                                  console.error('Error updating status:', error)
                                  alert('Failed to update status')
                                }
                              }}
                              className={`px-3 py-1 text-sm font-semibold rounded ${
                                quote.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : quote.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : quote.status === 'quoted'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quote Sent</option>
                              <option value="converted">Converted</option>
                            </select>
                          </div>
                          
                          <div className="bg-gold/10 px-3 py-2 rounded mb-3">
                            <span className="text-sm font-semibold text-charcoal">Product:</span>{' '}
                            <span className="text-sm text-charcoal">{quote.product_name}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Email:</span>{' '}
                              <a href={`mailto:${quote.email}`} className="text-gold hover:underline">
                                {quote.email}
                              </a>
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span>{' '}
                              <a href={`tel:${quote.phone}`} className="text-gold hover:underline">
                                {quote.phone}
                              </a>
                            </div>
                            <div>
                              <span className="text-gray-500">Date:</span>{' '}
                              {new Date(quote.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>

                          {quote.requirements && (
                            <div className="mb-3">
                              <span className="text-gray-500 text-sm">Requirements:</span>
                              <p className="text-gray-700 mt-1">{quote.requirements}</p>
                            </div>
                          )}

                          {quote.notes && (
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="text-gray-500 text-sm">Admin Notes:</span>
                              <p className="text-gray-700 mt-1">{quote.notes}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteItem('quote_requests', quote.id)}
                          className="ml-4 px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="bg-white p-8 shadow-lg max-w-3xl">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">General Settings</h2>
              
              <div className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.key} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-charcoal capitalize">
                          {setting.key.replace(/_/g, ' ')}
                        </h3>
                        {setting.description && (
                          <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                        )}
                      </div>
                      
                      {(setting.key === 'show_product_categories' || setting.key === 'show_portfolio_categories') && (
                        <button
                          onClick={async () => {
                            const newValue = setting.value === 'true' ? 'false' : 'true'
                            try {
                              await fetch('/api/admin', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  action: 'update_setting',
                                  data: { key: setting.key, value: newValue }
                                })
                              })
                              fetchData()
                            } catch (error) {
                              console.error('Error updating setting:', error)
                              alert('Failed to update setting')
                            }
                          }}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            setting.value === 'true' ? 'bg-gold' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              setting.value === 'true' ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Current value: </span>
                      <span className="font-medium text-charcoal">
                        {setting.value === 'true' ? 'Enabled' : setting.value === 'false' ? 'Disabled' : setting.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showProjectForm && (
        <ProjectForm
          project={editingItem}
          onClose={() => {
            setShowProjectForm(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowProjectForm(false)
            setEditingItem(null)
            fetchData()
          }}
        />
      )}

      {showTestimonialForm && (
        <TestimonialForm
          testimonial={editingItem}
          onClose={() => {
            setShowTestimonialForm(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowTestimonialForm(false)
            setEditingItem(null)
            fetchData()
          }}
        />
      )}

      {showStoneTypeForm && (
        <StoneTypeForm
          stoneType={editingItem}
          onClose={() => {
            setShowStoneTypeForm(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowStoneTypeForm(false)
            setEditingItem(null)
            fetchData()
          }}
        />
      )}

      {showProductForm && (
        <ProductForm
          product={editingItem}
          stoneTypes={stoneTypes}
          onClose={() => {
            setShowProductForm(false)
            setEditingItem(null)
          }}
          onSave={() => {
            setShowProductForm(false)
            setEditingItem(null)
            fetchData()
          }}
        />
      )}
    </div>
  )
}
