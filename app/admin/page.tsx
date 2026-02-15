'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ProjectForm from '@/components/admin/ProjectForm'
import TestimonialForm from '@/components/admin/TestimonialForm'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials'>('projects')
  const [projects, setProjects] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
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
    const supabase = createClient()
    
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    const { data: testimonialsData } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    
    setProjects(projectsData || [])
    setTestimonials(testimonialsData || [])
  }

  const toggleVisibility = async (type: 'project' | 'testimonial', id: string, currentVisibility: boolean) => {
    const supabase = createClient()
    const table = type === 'project' ? 'projects' : 'testimonials'
    
    await supabase
      .from(table)
      .update({ visible: !currentVisibility })
      .eq('id', id)
    
    fetchData()
  }

  const deleteItem = async (type: 'project' | 'testimonial', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    const supabase = createClient()
    const table = type === 'project' ? 'projects' : 'testimonials'
    
    await supabase.from(table).delete().eq('id', id)
    fetchData()
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

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'projects'
                ? 'bg-gold text-charcoal'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'testimonials'
                ? 'bg-gold text-charcoal'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Testimonials ({testimonials.length})
          </button>
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
                  <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{project.location}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility('project', project.id, project.visible)}
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
                      onClick={() => deleteItem('project', project.id)}
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
                  <h3 className="text-lg font-serif font-bold text-charcoal mb-1">
                    {testimonial.client_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{testimonial.client_title}</p>
                  <p className="text-sm text-gold font-semibold mb-3">{testimonial.company}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">"{testimonial.content}"</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleVisibility('testimonial', testimonial.id, testimonial.visible)}
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
                      onClick={() => deleteItem('testimonial', testimonial.id)}
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
    </div>
  )
}
