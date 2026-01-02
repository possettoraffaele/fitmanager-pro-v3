'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ClipboardList, 
  Dumbbell, 
  Activity,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Stats {
  totaleClienti: number;
  anamnesiCompilate: number;
  programmiAttivi: number;
  misurazioniMese: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totaleClienti: 0,
    anamnesiCompilate: 0,
    programmiAttivi: 0,
    misurazioniMese: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setStats({
          totaleClienti: data.length || 0,
          anamnesiCompilate: 0, // Da implementare
          programmiAttivi: 0,
          misurazioniMese: 0
        });
      }
    } catch (error) {
      console.error('Errore caricamento stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Clienti Totali',
      value: stats.totaleClienti,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/dashboard/clients'
    },
    {
      label: 'Anamnesi Compilate',
      value: stats.anamnesiCompilate,
      icon: ClipboardList,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      href: '/dashboard/anamnesi'
    },
    {
      label: 'Programmi Attivi',
      value: stats.programmiAttivi,
      icon: Dumbbell,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      href: '/dashboard/programmi'
    },
    {
      label: 'Misurazioni Mese',
      value: stats.misurazioniMese,
      icon: Activity,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      href: '/dashboard/misurazioni'
    }
  ];

  const quickActions = [
    {
      label: 'Nuovo Cliente',
      description: 'Aggiungi un nuovo cliente al gestionale',
      icon: Users,
      href: '/dashboard/clients?new=true',
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Nuova Anamnesi',
      description: 'Compila una nuova scheda anamnesi',
      icon: ClipboardList,
      href: '/dashboard/anamnesi?new=true',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      label: 'Genera Programma AI',
      description: 'Crea un programma con intelligenza artificiale',
      icon: Sparkles,
      href: '/dashboard/generate',
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Nuova Misurazione',
      description: 'Registra nuovi parametri bioimpedenziometrici',
      icon: Activity,
      href: '/dashboard/misurazioni?new=true',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Benvenuto in FitManager Pro</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="stat-card hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    {loading ? (
                      <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="stat-value">{stat.value}</p>
                    )}
                  </div>
                  <div className={`stat-icon ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm text-slate-500 group-hover:text-primary-600 transition-colors">
                  <span>Visualizza</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <div className="card hover:shadow-lg transition-all cursor-pointer group h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ultimi aggiornamenti */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Attività Recente
            </h3>
          </div>
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Nessuna attività recente</p>
            <p className="text-sm mt-1">Le attività appariranno qui</p>
          </div>
        </div>

        {/* Promemoria */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Suggerimenti AI
            </h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-800">
                💡 Usa la funzione <strong>&quot;Genera AI&quot;</strong> per creare programmi di allenamento personalizzati in pochi secondi.
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                📊 Registra le misurazioni dei clienti per tracciare i progressi nel tempo.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-800">
                📋 Un&apos;anamnesi completa migliora la qualità dei programmi generati.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
