'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, BookOpen, Sun, Moon, Globe, Shield, User as UserIcon } from 'lucide-react'
import { usePanier } from '@/hooks/usePanier'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function getInitials(nom: string): string {
  const parts = nom.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return nom.charAt(0).toUpperCase()
}

function RoleBadge({ role }: { role: string }) {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-dark/10 text-brand-dark">
        <Shield className="w-2.5 h-2.5" /> Admin
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-orange/10 text-brand-orange">
      <UserIcon className="w-2.5 h-2.5" /> Client
    </span>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { items } = usePanier()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const qteTotale = items.reduce((acc, item) => acc + item.qte, 0)
  
  const navLinks = [
    { href: '/', label: t.header.home },
    { href: '/boutique', label: t.header.shop },
    { href: '/a-propos', label: t.header.about },
    { href: '/contact', label: t.header.contact },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-brand-cream-dark dark:border-gray-800 transition-colors">
      <div className="container-brand">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-orange text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-bold text-brand-dark dark:text-white leading-none block">Living Letters</span>
              <span className="text-brand-orange text-[10px] font-bold tracking-widest uppercase block">El Deah</span>
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href 
                    ? 'text-brand-orange' 
                    : 'text-brand-muted hover:text-brand-dark dark:text-gray-400 dark:hover:text-white'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Lang Toggle */}
            <button 
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-brand-muted hover:text-brand-orange transition-colors uppercase"
            >
              <Globe className="w-4 h-4" />
              {lang}
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-cream dark:bg-gray-800 text-brand-muted dark:text-gray-400 hover:text-brand-orange transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link href="/panier" className="relative w-10 h-10 flex items-center justify-center rounded-full bg-brand-cream dark:bg-gray-800 text-brand-muted dark:text-gray-400 hover:text-brand-orange transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {qteTotale > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-brand-orange text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-gray-900">
                  {qteTotale}
                </span>
              )}
            </Link>

            {/* User section */}
            <div className="hidden sm:block">
              {user ? (
                <div className="group relative">
                  {/* Cercle initiales + nom + badge */}
                  <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-brand-cream dark:hover:bg-gray-800 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                      user.role === 'ADMIN' ? 'bg-brand-dark' : ''
                    }`} style={user.role !== 'ADMIN' ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}>
                      {getInitials(user.nom)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-brand-dark dark:text-white leading-tight truncate max-w-[120px]">{user.nom}</p>
                      <RoleBadge role={user.role} />
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-brand-cream-dark dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {/* En-tête user dans le dropdown */}
                    <div className="px-4 py-3 border-b border-brand-cream-dark dark:border-gray-700">
                      <p className="font-semibold text-sm text-brand-dark dark:text-white truncate">{user.nom}</p>
                      <p className="text-xs text-brand-muted truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/compte/profil" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-dark dark:text-gray-200 hover:bg-brand-cream dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <UserIcon className="w-4 h-4 text-brand-muted" />
                        Mon profil
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-dark dark:text-gray-200 hover:bg-brand-cream dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Shield className="w-4 h-4 text-brand-muted" />
                          Administration
                        </Link>
                      )}
                      <div className="border-t border-brand-cream-dark dark:border-gray-700 my-1" />
                      <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/connexion" className="text-sm font-semibold text-brand-muted dark:text-gray-400 hover:text-brand-orange">
                    {t.header.login}
                  </Link>
                  <Link href="/inscription" className="btn-primary py-2 px-4 text-sm">
                    {t.header.register}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Btn */}
            <button className="md:hidden w-10 h-10 flex items-center justify-center text-brand-dark dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-brand-cream-dark dark:border-gray-800 shadow-xl">
          <nav className="flex flex-col p-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-brand-dark dark:text-gray-200 font-semibold border-b border-brand-cream-dark dark:border-gray-800 last:border-0">
                {link.label}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-brand-cream-dark dark:border-gray-800">
              <div className="flex justify-between items-center px-4 mb-4">
                <span className="text-sm font-semibold text-brand-muted">Langue :</span>
                <button 
                  onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
                  className="px-3 py-1 bg-brand-cream dark:bg-gray-800 rounded-lg text-sm font-bold uppercase"
                >
                  {lang === 'fr' ? 'English' : 'Français'}
                </button>
              </div>

              {user ? (
                <>
                  {/* Mobile : info user */}
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                      user.role === 'ADMIN' ? 'bg-brand-dark' : ''
                    }`} style={user.role !== 'ADMIN' ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}>
                      {getInitials(user.nom)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-brand-dark dark:text-white">{user.nom}</p>
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                  <Link href="/compte/profil" className="block px-4 py-3 font-medium text-brand-dark dark:text-gray-200" onClick={() => setMenuOpen(false)}>Mon profil</Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-3 font-medium text-brand-dark dark:text-gray-200" onClick={() => setMenuOpen(false)}>Administration</Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="w-full text-left px-4 py-3 font-medium text-red-600 dark:text-red-400">Déconnexion</button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link href="/connexion" className="btn-secondary w-full justify-center" onClick={() => setMenuOpen(false)}>{t.header.login}</Link>
                  <Link href="/inscription" className="btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>{t.header.register}</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
