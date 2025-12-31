'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Eye, Filter } from 'lucide-react'
import { Programma, Cliente } from '@/types/database.types'
import { formatDate } from '@/lib/utils'

export default function ProgrammiPage() {
  const [programmi, setProgrammi] = useState<Programma[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStato, setFiltroStato] = useState<string>('TUTTI')

  useEffect(() => {
    loadProgrammi()
  }, [])

  const loadProgrammi = async () => {
    try {
      const res = await fetch('/api/programmi')
      const data = await res.json()
      setProgrammi(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setProgrammi([])
    } finally {
      setLoading(false)
    }
  }

  const programmiFiltrati = filtroStato === 'TUTTI' 
    ? programmi 
    : programmi.filter(p => p.stato === filtroStato)

  const getStatoColor = (stato: string) => {
    const colors = {
      'BOZZA': 'bg-gray-100 text-gray-700',
      'IN_REVISIONE': 'bg-yellow-100 text-yellow-700',
      'APPROVATO': 'bg-blue-100 text-blue-700',
      'ATTIVO': 'bg-green-100 text-green-700',
      'COMPLETATO': 'bg-purple-100 text-purple-700'
    }
    return colors[stato as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === 'PERIODIZZATO' ? '📈' : '📋'
  }

  if (loading) return <div className="p-8">Caricamento...</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Programmi Allenamento</h1>
        <p className="text-gray-600">Gestione programmi Base e Periodizzati</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">Totali</h3>
          <p className="text-3xl font-bold text-primary-600">{programmi.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">Attivi</h3>
          <p className="text-3xl font-bold text-green-600">
            {programmi.filter(p => p.stato === 'ATTIVO').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">In Revisione</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {programmi.filter(p => p.stato === 'IN_REVISIONE').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">Completati</h3>
          <p className="text-3xl font-bold text-purple-600">
            {programmi.filter(p => p.stato === 'COMPLETATO').length}
          </p>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex items-center gap-4 mb-6">
        <Filter size={20} className="text-gray-600" />
        <div className="flex gap-2">
          {['TUTTI', 'BOZZA', 'IN_REVISIONE', 'APPROVATO', 'ATTIVO', 'COMPLETATO'].map(stato => (
            <button
              key={stato}
              onClick={() => setFiltroStato(stato)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroStato === stato
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {stato}
            </button>
          ))}
        </div>
      </div>

      {/* Lista Programmi */}
      <div className="space-y-4">
        {programmiFiltrati.map((programma) => (
          <div key={programma.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{getTipoIcon(programma.tipo)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Programma {programma.tipo}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cliente ID: {programma.cliente_id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Stato:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatoColor(programma.stato)}`}>
                      {programma.stato.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {programma.data_inizio && (
                    <div>
                      <span className="text-gray-600">Inizio:</span>
                      <span className="ml-2 font-medium">{formatDate(programma.data_inizio)}</span>
                    </div>
                  )}
                  
                  {programma.data_fine && (
                    <div>
                      <span className="text-gray-600">Fine:</span>
                      <span className="ml-2 font-medium">{formatDate(programma.data_fine)}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-600">Creato:</span>
                    <span className="ml-2 font-medium">{formatDate(programma.created_at)}</span>
                  </div>
                </div>

                {programma.richieste_modifica && programma.richieste_modifica.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Modifiche richieste:</strong> {programma.richieste_modifica.length} revisioni
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Visualizza"
                >
                  <Eye size={20} className="text-gray-600" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {programmiFiltrati.length === 0 && (
          <div className="text-center py-16">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filtroStato === 'TUTTI' ? 'Nessun programma trovato' : `Nessun programma con stato "${filtroStato}"`}
            </h3>
            <p className="text-gray-500">I programmi generati appariranno qui</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Info:</strong> Da questa sezione potrai visualizzare, modificare ed esportare i programmi creati.
          L'integrazione completa sarà disponibile a breve.
        </p>
      </div>
    </div>
  )
}
