'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Activity, 
  Dumbbell, 
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clients', label: 'Clienti', icon: Users },
  { href: '/dashboard/anamnesi', label: 'Anamnesi', icon: ClipboardList },
  { href: '/dashboard/misurazioni', label: 'Misurazioni', icon: Activity },
  { href: '/dashboard/programmi', label: 'Programmi', icon: Dumbbell },
  { href: '/dashboard/generate', label: 'Genera AI', icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('fitmanager_auth');
    router.push('/auth');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={`p-4 border-b border-slate-200/80 ${collapsed ? 'px-3' : ''}`}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-slate-800">FitManager</h1>
              <span className="text-xs text-slate-500">Pro v4.0</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${active 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : ''}`} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button (desktop only) */}
      <div className="hidden md:block p-3 border-t border-slate-200/80">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Comprimi</span>
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-slate-200"
      >
        <Menu className="w-6 h-6 text-slate-600" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="h-full flex flex-col">
          <NavContent />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden md:flex flex-col h-screen bg-white border-r border-slate-200 shadow-sm
          transition-all duration-300 ease-in-out sticky top-0
          ${collapsed ? 'w-[72px]' : 'w-64'}
        `}
      >
        <NavContent />
      </aside>
    </>
  );
}
