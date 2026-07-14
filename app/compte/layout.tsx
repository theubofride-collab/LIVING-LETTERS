'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, FileText, MapPin, ChevronRight } from 'lucide-react'

const sidebarLinks = [
  { href: '/compte/profil', label: 'Mon profil', icon: User },
  { href: '/compte/commandes', label: 'Mes commandes', icon: ShoppingBag },
  { href: '/compte/factures', label: 'Mes factures', icon: FileText },
  { href: '/compte/adresses', label: 'Mes adresses', icon: MapPin },
]

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen py-10" style={{ background: '#FFF5EC' }}>
      <div className="container-brand">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card p-2 sticky top-24">
              <div className="px-3 py-3 border-b border-brand-cream-dark mb-2">
                <p className="font-serif font-bold text-brand-dark text-sm">Mon espace</p>
              </div>
              <nav>
                {sidebarLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + '/')
                  return (
                    <Link key={href} href={href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'text-brand-or'
                          : 'text-brand-muted hover:text-brand-dark hover:bg-brand-cream'
                      }`}
                      style={active ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}>
                      <Icon className="w-4 h-4" />
                      {label}
                      {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Contenu */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
