'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Tags, Users, ShoppingBag, FileText,
  UserCheck, ArrowLeft, LogOut, ChevronLeft, Menu, X, Shield,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/livres', label: 'Livres', icon: BookOpen },
  { href: '/admin/categories', label: 'Catégories', icon: Tags },
  { href: '/admin/auteurs', label: 'Auteurs', icon: Users },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: UserCheck },
  { href: '/admin/factures', label: 'Factures', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href))

  const sidebar = (
    <aside className="w-64 h-screen bg-white border-r border-brand-cream-dark flex flex-col flex-shrink-0 sticky top-0">
      {/* Header sidebar */}
      <div className="px-5 pt-6 pb-4 border-b border-brand-cream-dark">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
            <BookOpen className="w-5 h-5 text-brand-or" />
          </div>
          <div>
            <span className="font-serif text-base font-bold text-brand-dark block leading-none">Living Letters</span>
            <span className="text-brand-orange text-[9px] font-bold tracking-widest uppercase">Administration</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                active
                  ? 'text-brand-or'
                  : 'text-brand-muted hover:bg-brand-cream hover:text-brand-dark'
              }`}
              style={active ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}>
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="px-3 pb-4 space-y-1 border-t border-brand-cream-dark pt-3">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-muted hover:bg-brand-cream hover:text-brand-dark transition-colors">
          <ArrowLeft className="w-[18px] h-[18px]" />
          Retour au site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-muted hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-[18px] h-[18px]" />
          Déconnexion
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-brand-cream">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64">{sidebar}</div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white/90 backdrop-blur-md border-b border-brand-cream-dark">
          <button onClick={() => setSidebarOpen(true)} className="text-brand-dark">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-sm text-brand-dark">Administration</span>
          <div className="w-6" />
        </div>

        {/* Top bar info admin */}
        <div className="hidden lg:flex items-center justify-between px-8 py-3 bg-white border-b border-brand-cream-dark">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-xs font-bold text-white">
              {user?.nom ? (user.nom.split(' ').length >= 2 ? (user.nom.split(' ')[0][0] + user.nom.split(' ')[1][0]).toUpperCase() : user.nom.charAt(0).toUpperCase()) : 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-dark">{user?.nom || 'Admin'}</p>
              <p className="text-[10px] text-brand-muted">{user?.email}</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-dark/10 text-brand-dark">
              <Shield className="w-2.5 h-2.5" /> Administrateur
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
