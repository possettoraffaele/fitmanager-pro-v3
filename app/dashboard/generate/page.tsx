'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Sparkles, Eye, Check } from 'lucide-react'
import { Cliente, Anamnesi } from '@/types/database.types'

export default function GeneratePage() {
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState('')
  const [tipoProgramma, setTipoProgramma] = useState<'BASE' | 'PERIODIZZATO'>('BASE')
  const [step, setStep] = useState<'select' | 'preview' | 'generated'>('select')
  const [programmaPreview, setProgrammaPreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/clients?attivo=true')
      .then(r => r.json())
      .then(data => setClienti(Array.isArray(data) ? data : []))
  }, [])

  const handleGenerate = async () => {
    if (!selectedCliente) {
      alert('Seleziona un cliente!')
      return
    }

    setLoading(true)
    setStep('preview')

    // Simula preview programma
    setTimeout(() => {
      setProgrammaPreview(`PROGRAMMA ${tipoProgramma} GENERATO PER CLIENTE

🎯 OBIETTIVO: Ipertrofia Muscolare
📅 DURATA: 12 settimane
💪 FREQUENZA: 4 giorni/settimana

GIORNO A - PUSH
...esercizi...

GIORNO B - PULL  
...esercizi...

[Programma completo verrà generato con Claude API]
`)
      setLoading(false)
    }, 2000)
  }

  const handleApprove = () => {
    setStep('generated')
    alert('Programma salvato con successo!')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Genera Programma AI</h1>
        <p className="text-gray-600">Creazione programmi personalizzati con Claude</p>
      </div>

      {step === 'select' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleziona Cliente *
              </label>
              <select 
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Seleziona un cliente...</option>
                {clienti.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo di Programma *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTipoProgramma('BASE')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    tipoProgramma === 'BASE' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-1">Programma Base</h3>
                  <p className="text-sm text-gray-600">Scheda fissa 4-12 settimane</p>
                </button>

                <button
                  onClick={() => setTipoProgramma('PERIODIZZATO')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    tipoProgramma === 'PERIODIZZATO' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-1">Periodizzato</h3>
                  <p className="text-sm text-gray-600">4 fasi progressive</p>
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedCliente || loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={20} />
              {loading ? 'Generazione in corso...' : 'Genera Programma con AI'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Info:</strong> Il programma verrà generato utilizzando i dati anamnesi del cliente e i preamboli specifici per {tipoProgramma === 'BASE' ? 'programmi base' : 'programmi periodizzati'}.
            </p>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div className="max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="text-primary-600" size={24} />
              <h2 className="text-2xl font-bold">Anteprima Programma</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
              {programmaPreview}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('select')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Modifica
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check size={20} />
                Approva e Salva
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>🚧 Preview Simulata</strong> - L'integrazione Claude API completa sarà disponibile a breve
            </p>
          </div>
        </div>
      )}

      {step === 'generated' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Programma Creato!</h2>
            <p className="text-gray-600 mb-6">Il programma è stato salvato e assegnato al cliente</p>
            <button
              onClick={() => {
                setStep('select')
                setSelectedCliente('')
                setProgrammaPreview('')
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Crea Altro Programma
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
