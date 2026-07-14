import Link from 'next/link'
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1C1410 0%, #3D2B1F 100%)' }}>
      {/* Verset */}
      <div className="border-b border-white/10 py-8">
        <div className="container-brand text-center">
          <p className="font-serif text-lg md:text-xl italic text-white/70 max-w-2xl mx-auto leading-relaxed">
            "Vous êtes vous-mêmes notre lettre, écrite dans nos cœurs, connue et lue de tous les hommes."
          </p>
          <p className="mt-2 text-brand-or text-sm font-semibold tracking-wide">— 2 Corinthiens 3 : 2-3</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container-brand py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Colonne 1 : Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-brand-or/40 bg-white/5">
                <BookOpen className="w-5 h-5 text-brand-or" />
              </div>
              <div>
                <span className="block font-serif text-base font-bold text-white">Living Letters</span>
                <span className="block text-[10px] text-brand-or tracking-widest uppercase">El Deah</span>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              Librairie chrétienne au service de votre croissance. Bibles, littérature chrétienne, développement personnel et leadership.
            </p>
            <p className="text-xs font-semibold text-brand-or tracking-wider uppercase italic">
              "Read, Think and Become"
            </p>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="font-serif text-white font-semibold mb-4 text-sm tracking-wide">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/boutique', label: 'Boutique' },
                { href: '/a-propos', label: 'À propos' },
                { href: '/contact', label: 'Contact' },
                { href: '/connexion', label: 'Mon compte' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-brand-or transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Services */}
          <div>
            <h4 className="font-serif text-white font-semibold mb-4 text-sm tracking-wide">Services</h4>
            <ul className="space-y-2.5">
              {[
                'Vente de livres',
                'Club de lecture',
                'Accompagnement spirituel',
                'Partenariats écoles',
                'Partenariats éditeurs',
                'Commandes en ligne',
              ].map((s) => (
                <li key={s} className="text-sm text-white/50">{s}</li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h4 className="font-serif text-white font-semibold mb-4 text-sm tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-or mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50">Damas terre rouge et melen en face du CHU</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-or flex-shrink-0" />
                <span className="text-sm text-white/50">652884093 / 655157661</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-or flex-shrink-0" />
                <span className="text-sm text-white/50">livingletters237@gmail.com</span>
              </li>
            </ul>
            {/* Réseaux */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { label: 'Fb', href: '#' },
                { label: 'Ig', href: '#' },
                { label: 'Yt', href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-brand-or hover:border-brand-or/40 hover:bg-brand-or/10 transition-all duration-200">
                  <span className="text-xs font-bold">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10 py-5">
        <div className="container-brand flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Living Letters — El Deah. Tous droits réservés.
          </p>
          <p className="text-xs text-white/20">
            Cameroun • Basé sur 2 Corinthiens 3:2-3
          </p>
        </div>
      </div>
    </footer>
  )
}
