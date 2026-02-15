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

type TabType = 'projects' | 'testimonials' | 'stone_types' | 'products'

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
      const [projectsData, testimonialsData, stoneTypesData, productsData] = await Promise.all([
        adminApi('fetch', 'projects'),
        adminApi('fetch', 'testimonials'),
        adminApi('fetch', 'stone_types'),
        adminApi('fetch', 'products'),
      ])

      setProjects(projectsData || [])
      setTestimonials(testimonialsData || [])
      setStoneTypes(stoneTypesData || [])
      setProducts(productsData || [])
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
              {tab.label} ({tab.count})
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
