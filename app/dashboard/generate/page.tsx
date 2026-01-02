'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  User, 
  ClipboardList, 
  Send, 
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  Copy,
  Save,
  MessageSquare,
  Bot,
  RefreshCw,
  FileJson
} from 'lucide-react';

interface Cliente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
}

interface Anamnesi {
  id: string;
  cliente_id: string;
  obiettivo_principale: string;
  livello_esperienza: string;
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function GeneratePage() {
  // Step management
  const [step, setStep] = useState(1);
  
  // Data
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [anamnesiList, setAnamnesiList] = useState<Anamnesi[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [selectedAnamnesi, setSelectedAnamnesi] = useState<string>('');
  const [tipoProgramma, setTipoProgramma] = useState<'base' | 'periodizzato'>('base');
  const [istruzioniAggiuntive, setIstruzioniAggiuntive] = useState('');
  const [programmiPrecedenti, setProgrammiPrecedenti] = useState('');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  
  // Result state
  const [jsonResult, setJsonResult] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [programmaName, setProgrammaName] = useState('');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClienti();
  }, []);

  useEffect(() => {
    if (selectedCliente) {
      fetchAnamnesiByCliente(selectedCliente);
    } else {
      setAnamnesiList([]);
      setSelectedAnamnesi('');
    }
  }, [selectedCliente]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchClienti = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClienti(data);
      }
    } catch (error) {
      console.error('Error fetching clienti:', error);
    }
  };

  const fetchAnamnesiByCliente = async (clienteId: string) => {
    try {
      const response = await fetch(`/api/anamnesi?cliente_id=${clienteId}`);
      if (response.ok) {
        const data = await response.json();
        setAnamnesiList(data);
        if (data.length > 0) {
          setSelectedAnamnesi(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching anamnesi:', error);
    }
  };

  const generateProgram = async () => {
    if (!selectedCliente || !selectedAnamnesi) {
      alert('Seleziona un cliente e un\'anamnesi');
      return;
    }

    setIsGenerating(true);
    setStep(3);
    setMessages([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: selectedCliente,
          anamnesi_id: selectedAnamnesi,
          tipo_programma: tipoProgramma,
          istruzioni_aggiuntive: istruzioniAggiuntive,
          programmi_precedenti: programmiPrecedenti,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella generazione');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.risposta,
      };

      setMessages([assistantMessage]);
      setConversationHistory([
        { role: 'user', content: `Genera programma ${tipoProgramma} per ${data.cliente.nome} ${data.cliente.cognome}` },
        assistantMessage,
      ]);

      // Try to extract JSON from response
      extractJSON(data.risposta);

    } catch (error: any) {
      console.error('Error generating program:', error);
      setMessages([{
        role: 'assistant',
        content: `❌ Errore: ${error.message || 'Impossibile generare il programma'}`,
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_history: conversationHistory,
          user_message: inputMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella risposta');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.risposta,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(data.conversation_history);

      // Try to extract JSON from response
      extractJSON(data.risposta);

    } catch (error: any) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Errore: ${error.message}`,
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const extractJSON = (text: string) => {
    // Try to find JSON in the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      setJsonResult(jsonMatch[1].trim());
    } else {
      // Try to find a JSON object directly
      const jsonObjectMatch = text.match(/\{[\s\S]*"cliente"[\s\S]*\}/);
      if (jsonObjectMatch) {
        setJsonResult(jsonObjectMatch[0]);
      }
    }
  };

  const copyJSON = () => {
    if (jsonResult) {
      navigator.clipboard.writeText(jsonResult);
      alert('JSON copiato negli appunti!');
    }
  };

  const saveProgram = async () => {
    if (!jsonResult || !programmaName) {
      alert('Inserisci un nome per il programma');
      return;
    }

    setIsSaving(true);

    try {
      let parsedJSON;
      try {
        parsedJSON = JSON.parse(jsonResult);
      } catch {
        parsedJSON = jsonResult;
      }

      const response = await fetch('/api/programmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: selectedCliente,
          anamnesi_id: selectedAnamnesi,
          nome: programmaName,
          tipo: tipoProgramma,
          stato: 'bozza',
          contenuto_json: parsedJSON,
          data_inizio: parsedJSON?.['data inizio scheda'] || null,
          data_fine: parsedJSON?.['data fine scheda'] || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nel salvataggio');
      }

      alert('✅ Programma salvato con successo!');
      
    } catch (error: any) {
      console.error('Error saving program:', error);
      alert(`❌ Errore: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedCliente('');
    setSelectedAnamnesi('');
    setTipoProgramma('base');
    setIstruzioniAggiuntive('');
    setProgrammiPrecedenti('');
    setMessages([]);
    setConversationHistory([]);
    setJsonResult('');
    setProgrammaName('');
  };

  const getClienteName = () => {
    const cliente = clienti.find(c => c.id === selectedCliente);
    return cliente ? `${cliente.nome} ${cliente.cognome}` : '';
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            Genera Programma AI
          </h1>
          <p className="text-gray-600 mt-1">Crea programmi personalizzati con l'intelligenza artificiale</p>
        </div>
        {step > 1 && (
          <button
            onClick={resetWizard}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Ricomincia
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${step >= s 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'}
            `}>
              {step > s ? <Check size={20} /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-16 mb-8 text-sm">
        <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Seleziona Cliente
        </span>
        <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Configura
        </span>
        <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Genera
        </span>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col">
        {/* Step 1: Select Client */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="text-blue-600" />
                Seleziona Cliente
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    value={selectedCliente}
                    onChange={(e) => setSelectedCliente(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleziona un cliente...</option>
                    {clienti.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} {cliente.cognome} - {cliente.email}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCliente && anamnesiList.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anamnesi *
                    </label>
                    <select
                      value={selectedAnamnesi}
                      onChange={(e) => setSelectedAnamnesi(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {anamnesiList.map((anamnesi) => (
                        <option key={anamnesi.id} value={anamnesi.id}>
                          {new Date(anamnesi.created_at).toLocaleDateString('it-IT')} - 
                          {anamnesi.obiettivo_principale || 'Obiettivo non specificato'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCliente && anamnesiList.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      ⚠️ Questo cliente non ha ancora un'anamnesi compilata.
                      <br />
                      <a href="/dashboard/anamnesi" className="text-blue-600 hover:underline">
                        Compila prima l'anamnesi →
                      </a>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedCliente || !selectedAnamnesi}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continua
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList className="text-blue-600" />
                Configura Programma
              </h2>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Cliente:</strong> {getClienteName()}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo di Programma *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTipoProgramma('base')}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        tipoProgramma === 'base'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">📋 Programma Base</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Scheda singola non periodizzata per 4-12 settimane
                      </p>
                    </button>
                    <button
                      onClick={() => setTipoProgramma('periodizzato')}
                      className={`p-4 border-2 rounded-xl text-left transition-all ${
                        tipoProgramma === 'periodizzato'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">📈 Programma Periodizzato</p>
                      <p className="text-sm text-gray-500 mt-1">
                        4 fasi progressive con periodizzazione scientifica
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Istruzioni Aggiuntive
                  </label>
                  <textarea
                    value={istruzioniAggiuntive}
                    onChange={(e) => setIstruzioniAggiuntive(e.target.value)}
                    placeholder="Es: Focus su braccia, evitare esercizi con bilanciere..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programmi Precedenti (opzionale)
                  </label>
                  <textarea
                    value={programmiPrecedenti}
                    onChange={(e) => setProgrammiPrecedenti(e.target.value)}
                    placeholder="Incolla qui i programmi precedenti del cliente per dare contesto all'AI..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} />
                  Indietro
                </button>
                <button
                  onClick={generateProgram}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                >
                  <Sparkles size={18} />
                  Genera Programma
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Chat & Results */}
        {step === 3 && (
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Chat Section */}
            <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col min-h-0">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="text-blue-600" />
                  Chat con AI - {getClienteName()}
                </h2>
                <p className="text-sm text-gray-500">
                  Tipo: {tipoProgramma === 'periodizzato' ? 'Periodizzato (4 fasi)' : 'Base'}
                </p>
              </div>

              {/* Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.length === 0 && isGenerating && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                      <p className="mt-4 text-gray-600">Generazione in corso...</p>
                      <p className="text-sm text-gray-400">Potrebbe richiedere qualche minuto</p>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Bot size={18} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isGenerating && messages.length > 0 && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot size={18} className="text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Scrivi un messaggio per modificare o approvare..."
                    disabled={isGenerating || messages.length === 0}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isGenerating || !inputMessage.trim() || messages.length === 0}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Suggerimenti: "Approvo, dammi il JSON", "Modifica il giorno A", "Aggiungi più esercizi per le gambe"
                </p>
              </div>
            </div>

            {/* JSON Result Section */}
            <div className="w-96 bg-white rounded-xl shadow-sm flex flex-col min-h-0">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileJson className="text-green-600" />
                  JSON Output
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {jsonResult ? (
                  <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto whitespace-pre-wrap">
                    {jsonResult}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FileJson size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Il JSON apparirà qui</p>
                      <p className="text-xs">quando l'AI lo genererà</p>
                    </div>
                  </div>
                )}
              </div>

              {jsonResult && (
                <div className="p-4 border-t border-gray-100 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Programma
                    </label>
                    <input
                      type="text"
                      value={programmaName}
                      onChange={(e) => setProgrammaName(e.target.value)}
                      placeholder="Es: Scheda Ipertrofia Gennaio"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyJSON}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Copy size={16} />
                      Copia
                    </button>
                    <button
                      onClick={saveProgram}
                      disabled={isSaving || !programmaName}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                    >
                      {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Salva
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
