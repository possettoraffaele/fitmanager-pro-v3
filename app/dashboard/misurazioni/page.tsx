'use client'

import { useState, useEffect } from 'react'
import { Plus, Scale, Camera, TrendingUp } from 'lucide-react'
import { Misurazione, Cliente } from '@/types/database.types'
import { formatDate } from '@/lib/utils'

export default function MisurazioniPage() {
  const [misurazioni, setMisurazioni] = useState<Misurazione[]>([])
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [misRes, cliRes] = await Promise.all([
        fetch('/api/misurazioni'),
        fetch('/api/clients?attivo=true')
      ])
      setMisurazioni(Array.isArray(await misRes.json()) ? await misRes.json() : [])
      setClienti(Array.isArray(await cliRes.json()) ? await cliRes.json() : [])
    } catch (error) {
      console.error(error)
      setMisurazioni([])
      setClienti([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      cliente_id: formData.get('cliente_id'),
      data_misurazione: formData.get('data_misurazione'),
      fase_programma: formData.get('fase_programma') || null,
      peso_kg: parseFloat(formData.get('peso_kg') as string),
      massa_grassa_perc: formData.get('massa_grassa_perc') ? parseFloat(formData.get('massa_grassa_perc') as string) : null,
      muscolo_scheletrico_perc: formData.get('muscolo_scheletrico_perc') ? parseFloat(formData.get('muscolo_scheletrico_perc') as string) : null,
      massa_muscolare_kg: formData.get('massa_muscolare_kg') ? parseFloat(formData.get('massa_muscolare_kg') as string) : null,
      acqua_corporea_perc: formData.get('acqua_corporea_perc') ? parseFloat(formData.get('acqua_corporea_perc') as string) : null,
      metabolismo_basale_kcal: formData.get('metabolismo_basale_kcal') ? parseInt(formData.get('metabolismo_basale_kcal') as string) : null,
      bmi: formData.get('bmi') ? parseFloat(formData.get('bmi') as string) : null,
      proteine_perc: formData.get('proteine_perc') ? parseFloat(formData.get('proteine_perc') as string) : null,
      grasso_addominale_livello: formData.get('grasso_addominale_livello') ? parseInt(formData.get('grasso_addominale_livello') as string) : null,
      massa_ossea_kg: formData.get('massa_ossea_kg') ? parseFloat(formData.get('massa_ossea_kg') as string) : null,
      eta_metabolica: formData.get('eta_metabolica') ? parseInt(formData.get('eta_metabolica') as string) : null,
      livello_capacita_stoccaggio: formData.get('livello_capacita_stoccaggio') ? parseInt(formData.get('livello_capacita_stoccaggio') as string) : null,
      note: formData.get('note')
    }

    try {
      const res = await fetch('/api/misurazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setShowForm(false)
        loadData()
        alert('Misurazione salvata!')
      }
    } catch (error) {
      console.error(error)
      alert('Errore')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Misurazioni Bioimpedenziometriche Feelfit</h1>
        <p className="text-gray-600">Dati completi dalla bilancia bluetooth</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">Totale</h3>
          <p className="text-3xl font-bold text-primary-600">{misurazioni.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">Questo Mese</h3>
          <p className="text-3xl font-bold text-secondary-600">
            {misurazioni.filter(m => new Date(m.data_misurazione).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-600 mb-2">Clienti</h3>
          <p className="text-3xl font-bold text-green-600">{new Set(misurazioni.map(m => m.cliente_id)).size}</p>
        </div>
      </div>

      <button onClick={() => setShowForm(true)} className="mb-6 flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
        <Plus size={20} /> Nuova Misurazione
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">Nuova Misurazione Feelfit</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-1">
                  <label className="block text-sm font-medium mb-2">Cliente *</label>
                  <select name="cliente_id" required className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Seleziona...</option>
                    {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Data *</label>
                  <input type="date" name="data_misurazione" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fase</label>
                  <select name="fase_programma" className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Nessuna</option>
                    <option value="PRE">PRE</option>
                    <option value="FASE_1">FASE 1</option>
                    <option value="FASE_2">FASE 2</option>
                    <option value="FASE_3">FASE 3</option>
                    <option value="FASE_4">FASE 4</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">📊 Dati Bioimpedenziometrici Feelfit</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Peso (kg) *</label>
                    <input type="number" step="0.01" name="peso_kg" required className="w-full px-4 py-2 border rounded-lg" placeholder="74.25" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Massa Grassa (%)</label>
                    <input type="number" step="0.1" name="massa_grassa_perc" className="w-full px-4 py-2 border rounded-lg" placeholder="12.8" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">BMI</label>
                    <input type="number" step="0.1" name="bmi" className="w-full px-4 py-2 border rounded-lg" placeholder="24.2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Muscolo Scheletrico (%)</label>
                    <input type="number" step="0.1" name="muscolo_scheletrico_perc" className="w-full px-4 py-2 border rounded-lg" placeholder="56.3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Massa Muscolare (kg)</label>
                    <input type="number" step="0.01" name="massa_muscolare_kg" className="w-full px-4 py-2 border rounded-lg" placeholder="61.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Proteine (%)</label>
                    <input type="number" step="0.1" name="proteine_perc" className="w-full px-4 py-2 border rounded-lg" placeholder="19.9" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">BMR (kcal)</label>
                    <input type="number" name="metabolismo_basale_kcal" className="w-full px-4 py-2 border rounded-lg" placeholder="1768" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Grasso Addominale (1-15)</label>
                    <input type="number" name="grasso_addominale_livello" min="1" max="15" className="w-full px-4 py-2 border rounded-lg" placeholder="7" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Idratazione (%)</label>
                    <input type="number" step="0.1" name="acqua_corporea_perc" className="w-full px-4 py-2 border rounded-lg" placeholder="63" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Massa Ossea (kg)</label>
                    <input type="number" step="0.01" name="massa_ossea_kg" className="w-full px-4 py-2 border rounded-lg" placeholder="3.24" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Età Metabolica</label>
                    <input type="number" name="eta_metabolica" className="w-full px-4 py-2 border rounded-lg" placeholder="24" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cap. Stoccaggio (1-10)</label>
                    <input type="number" name="livello_capacita_stoccaggio" min="1" max="10" className="w-full px-4 py-2 border rounded-lg" placeholder="5" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">📸 Foto Poses (Coming Soon)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div>• Laterale Sinistra</div>
                  <div>• Laterale Destra</div>
                  <div>• Frontale Rilassata</div>
                  <div>• Posteriore Rilassata</div>
                  <div>• Frontale Doppio Bicipite</div>
                  <div>• Posteriore Latspread</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <textarea name="note" rows={3} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Annulla</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Salva</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {misurazioni.map((mis) => (
          <div key={mis.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{formatDate(mis.data_misurazione)}</h3>
                {mis.fase_programma && (
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm mt-2">{mis.fase_programma}</span>
                )}
              </div>
              <Scale className="text-primary-600" size={32} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Peso</p>
                <p className="text-lg font-bold">{mis.peso_kg} kg</p>
              </div>
              {mis.massa_grassa_perc && (
                <div>
                  <p className="text-gray-600">Grasso</p>
                  <p className="text-lg font-bold text-red-600">{mis.massa_grassa_perc}%</p>
                </div>
              )}
              {mis.massa_muscolare_kg && (
                <div>
                  <p className="text-gray-600">Muscolo</p>
                  <p className="text-lg font-bold text-green-600">{mis.massa_muscolare_kg} kg</p>
                </div>
              )}
              {mis.bmi && (
                <div>
                  <p className="text-gray-600">BMI</p>
                  <p className="text-lg font-bold">{mis.bmi}</p>
                </div>
              )}
              {mis.metabolismo_basale_kcal && (
                <div>
                  <p className="text-gray-600">BMR</p>
                  <p className="text-lg font-bold text-blue-600">{mis.metabolismo_basale_kcal} kcal</p>
                </div>
              )}
              {mis.eta_metabolica && (
                <div>
                  <p className="text-gray-600">Età Metab.</p>
                  <p className="text-lg font-bold">{mis.eta_metabolica}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {misurazioni.length === 0 && (
          <div className="text-center py-12">
            <Scale className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nessuna misurazione</h3>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mt-4">
              <Plus size={20} /> Prima Misurazione
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
