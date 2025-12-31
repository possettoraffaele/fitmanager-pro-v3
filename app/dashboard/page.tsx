'use client'
export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard FitManager Pro v3.0
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Clienti Totali</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-secondary-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Misurazioni</h3>
          <p className="text-3xl font-bold text-secondary-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Programmi Attivi</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
      </div>

      <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-primary-900 mb-3">
          🎉 Benvenuto in FitManager Pro v3.0!
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>✅ <strong>Nuove Funzionalità:</strong></p>
          <ul className="ml-6 space-y-1">
            <li>• Gestione Misurazioni Bioimpedenziometriche</li>
            <li>• Tracking composizione corporea e circonferenze</li>
            <li>• Grafici evoluzione peso e massa grassa</li>
            <li>• Integrazione con AI per programmi personalizzati</li>
          </ul>
          <p className="mt-4">
            <strong>Inizia ora:</strong> Vai su <em>Clienti</em> per aggiungere il tuo primo cliente!
          </p>
        </div>
      </div>
    </div>
  )
}
