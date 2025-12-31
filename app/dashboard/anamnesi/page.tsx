'use client'

import { useState } from 'react'
import { ClipboardList, Plus, Eye } from 'lucide-react'

export default function AnamnesiPage() {
  const [showMessage, setShowMessage] = useState(false)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Anamnesi Clienti</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
        <div className="flex items-start gap-4">
          <ClipboardList className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Form Anamnesi Completo</h3>
            <p className="text-blue-800 mb-4">
              Integrazione del form HTML completo con 9 sezioni da Form_Anamnesi_Psicofisica.html
            </p>
            <button 
              onClick={() => setShowMessage(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="inline mr-2" />
              Invia Link Anamnesi a Cliente
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
          <p className="text-green-800">
            ✅ Link anamnesi inviato! Il cliente riceverà via email il form da compilare.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Anamnesi Compilate</h2>
        <div className="text-center py-12 text-gray-500">
          <ClipboardList size={64} className="mx-auto mb-4 opacity-30" />
          <p>Nessuna anamnesi compilata</p>
          <p className="text-sm mt-2">Le anamnesi compilate dai clienti appariranno qui</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>🚧 Sezione in sviluppo</strong> - Integrazione completa del form HTML con database in arrivo
        </p>
      </div>
    </div>
  )
}
