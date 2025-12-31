'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Activity, 
  FileText, 
  Dumbbell,
  LogOut,
  Scale
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/auth')
  }

  const menuItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Clienti', 
      href: '/dashboard/clients', 
      icon: Users 
    },
    { 
      name: 'Misurazioni', 
      href: '/dashboard/misurazioni', 
      icon: Scale 
    },
    { 
      name: 'Anamnesi', 
      href: '/dashboard/anamnesi', 
      icon: ClipboardList 
    },
    { 
      name: 'Genera Programma', 
      href: '/dashboard/generate', 
      icon: Dumbbell 
    },
    { 
      name: 'Programmi', 
      href: '/dashboard/programmi', 
      icon: FileText 
    },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-primary-700 to-primary-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-primary-600">
        <h1 className="text-2xl font-bold">FitManager Pro</h1>
        <p className="text-sm text-primary-200 mt-1">v3.0</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-white text-primary-700 shadow-lg' 
                  : 'text-primary-100 hover:bg-primary-600'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-600">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-primary-100 hover:bg-primary-600 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Esci</span>
        </button>
      </div>
    </div>
  )
}
