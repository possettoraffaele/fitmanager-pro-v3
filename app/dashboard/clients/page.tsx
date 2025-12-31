'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Mail, Phone, Trash2, Edit, User } from 'lucide-react'
import { Cliente } from '@/types/database.types'
import { formatDate } from '@/lib/utils'

export default function ClientsPage() {
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)

  useEffect(() => {
    loadClienti()
  }, [])

  const loadClienti = async () => {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      setClienti(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading clients:', error)
      setClienti([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const clienteData = {
      nome: formData.get('nome') as string,
      cognome: formData.get('cognome') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      data_nascita: formData.get('data_nascita') as string,
      sesso: formData.get('sesso') as string,
      note: formData.get('note') as string,
    }

    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients'
      const method = editingClient ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClient ? { id: editingClient.id, ...clienteData } : clienteData),
      })

      if (res.ok) {
        setShowForm(false)
        setEditingClient(null)
        loadClienti()
        alert(editingClient ? 'Cliente aggiornato!' : 'Cliente creato!')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Errore nel salvare il cliente')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo cliente?')) return

    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadClienti()
        alert('Cliente eliminato!')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Errore nell\'eliminare il cliente')
    }
  }

  const filteredClienti = clienti.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cognome.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clienti</h1>
        <p className="text-gray-600">Gestisci i tuoi clienti</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cerca clienti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            setEditingClient(null)
            setShowForm(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Nuovo Cliente
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingClient ? 'Modifica Cliente' : 'Nuovo Cliente'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    defaultValue={editingClient?.nome}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    name="cognome"
                    defaultValue={editingClient?.cognome}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingClient?.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  defaultValue={editingClient?.telefono}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data di Nascita
                  </label>
                  <input
                    type="date"
                    name="data_nascita"
                    defaultValue={editingClient?.data_nascita}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sesso
                  </label>
                  <select
                    name="sesso"
                    defaultValue={editingClient?.sesso}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Seleziona...</option>
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <textarea
                  name="note"
                  rows={3}
                  defaultValue={editingClient?.note}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingClient(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingClient ? 'Aggiorna' : 'Crea Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista Clienti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClienti.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {cliente.nome} {cliente.cognome}
                  </h3>
                  {cliente.data_nascita && (
                    <p className="text-sm text-gray-500">
                      {formatDate(cliente.data_nascita)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {cliente.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Mail size={16} />
                <span className="truncate">{cliente.email}</span>
              </div>
            )}

            {cliente.telefono && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Phone size={16} />
                <span>{cliente.telefono}</span>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => {
                  setEditingClient(cliente)
                  setShowForm(true)
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Edit size={16} />
                Modifica
              </button>
              <button
                onClick={() => handleDelete(cliente.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClienti.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nessun cliente trovato
          </h3>
          <p className="text-gray-500 mb-6">
            {search ? 'Prova con un\'altra ricerca' : 'Inizia creando il tuo primo cliente'}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus size={20} />
              Crea Primo Cliente
            </button>
          )}
        </div>
      )}
    </div>
  )
}
