import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, ArrowRight, Users, BookMarked, Heart, Star, ChevronRight } from 'lucide-react'
import BookCard from '@/components/ui/BookCard'
import { MOCK_LIVRES, MOCK_CATEGORIES } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'Accueil — Living Letters, Librairie Chrétienne',
  description: 'Découvrez notre sélection de bibles, livres chrétiens, développement personnel et leadership au Cameroun.',
}

const featuredBooks = MOCK_LIVRES.slice(0, 4)
const services = [
  { icon: BookOpen, title: 'Librairie physique', desc: 'Venez nous rendre visite à Yaoundé pour parcourir notre catalogue complet.', color: '#EA580C' },
  { icon: Users, title: 'Club de lecture', desc: 'Rejoignez notre communauté de lecteurs chrétiens pour des sessions enrichissantes.', color: '#C8A24A' },
  { icon: Heart, title: 'Accompagnement spirituel', desc: 'Nos équipes vous guident dans le choix de ressources adaptées à votre parcours.', color: '#EA580C' },
  { icon: BookMarked, title: 'Partenariats', desc: 'Collaborations avec écoles et éditeurs pour l\'accès à la culture chrétienne.', color: '#C8A24A' },
]

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden py-24 md:py-36 bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(234, 88, 12, 0.85) 0%, rgba(154, 52, 18, 0.90) 100%), url("/hero-bg.png")' }}>
        {/* Décoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white" />
        </div>

        <div className="container-brand relative z-10 text-center">
          {/* Logo / icon hero */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 border-2 border-brand-or/40"
            style={{ background: 'rgba(200,162,74,0.15)' }}>
            <BookOpen className="w-10 h-10 text-brand-or" />
          </div>

          {/* Slogan */}
          <p className="text-brand-or font-semibold tracking-widest uppercase text-sm mb-3">El Deah — Living Letters</p>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Read, Think<br />
            <span style={{ background: 'linear-gradient(90deg, #C8A24A, #DDB96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              and Become
            </span>
          </h1>

          <p className="mt-6 text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Votre librairie chrétienne au cœur du Cameroun — Bibles, littérature chrétienne, développement personnel et leadership.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/boutique" id="hero-cta-boutique" className="btn-gold text-base px-8 py-4">
              Explorer la boutique
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/a-propos" id="hero-cta-apropos" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-base font-semibold border-2 border-white/20 text-white/80 hover:border-brand-or/60 hover:text-brand-or transition-all duration-200">
              Notre histoire
            </Link>
          </div>

          {/* Verset */}
          <div className="mt-16 max-w-xl mx-auto">
            <p className="font-serif text-base italic text-white/50 leading-relaxed">
              "Vous êtes vous-mêmes notre lettre, écrite dans nos cœurs…"
            </p>
            <p className="text-brand-or text-xs font-semibold tracking-wider mt-2">2 Corinthiens 3:2-3</p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 bg-white border-b border-brand-cream-dark">
        <div className="container-brand">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Titres disponibles' },
              { value: '1200+', label: 'Clients satisfaits' },
              { value: '7', label: 'Catégories' },
              { value: '5 ans', label: 'D\'expérience' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl font-bold" style={{ color: '#EA580C' }}>{stat.value}</p>
                <p className="text-sm text-brand-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVRES MIS EN AVANT ===== */}
      <section className="py-16 md:py-24">
        <div className="container-brand">
          <div className="text-center mb-12">
            <h2 className="section-title">Sélection du moment</h2>
            <p className="section-subtitle">Des ouvrages choisis pour nourrir votre foi et votre esprit</p>
            <span className="divider-gold" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((livre) => (
              <BookCard key={livre.id} livre={livre} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/boutique" id="home-voir-tout" className="btn-secondary inline-flex items-center gap-2">
              Voir tout le catalogue
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VISION / MISSION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-brand">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-or font-semibold text-sm tracking-wider uppercase mb-3">Notre identité</p>
              <h2 className="section-title mb-6">
                La connaissance qui vient de Dieu
              </h2>
              <p className="text-brand-muted leading-relaxed mb-6">
                Le nom <strong className="text-brand-orange">El Deah</strong> (אֵל דֵּעָה) signifie littéralement "Dieu de la connaissance" en hébreu. 
                Notre librairie est fondée sur la conviction que lire, réfléchir et grandir sont des actes profondément spirituels.
              </p>
              <p className="text-brand-muted leading-relaxed mb-8">
                Notre logo — un livre ouvert portant une flamme — illustre cette vérité : la Parole de Dieu est vivante, 
                elle éclaire chaque lecteur et le transforme de l'intérieur.
              </p>
              <Link href="/a-propos" className="btn-primary inline-flex">
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                <p className="font-serif text-2xl font-bold text-brand-or mb-2">Vision</p>
                <p className="text-white/70 text-sm leading-relaxed">Être la référence des ressources chrétiennes au Cameroun et en Afrique centrale.</p>
              </div>
              <div className="p-6 rounded-2xl border-2 border-brand-or/30" style={{ background: 'rgba(200,162,74,0.05)' }}>
                <p className="font-serif text-2xl font-bold text-brand-orange mb-2">Mission</p>
                <p className="text-brand-muted text-sm leading-relaxed">Mettre la connaissance de Dieu à portée de tous, sans distinction d'âge ou de statut.</p>
              </div>
              <div className="p-6 rounded-2xl border border-brand-cream-dark col-span-2">
                <p className="font-serif text-lg font-bold text-brand-dark mb-2">Notre verset fondateur</p>
                <p className="text-brand-muted text-sm italic leading-relaxed">
                  "Vous êtes vous-mêmes notre lettre, écrite dans nos cœurs, connue et lue de tous les hommes."
                </p>
                <p className="text-brand-or text-xs font-semibold mt-2">— 2 Corinthiens 3:2-3</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATÉGORIES ===== */}
      <section className="py-16 md:py-20" style={{ background: '#F0EBE0' }}>
        <div className="container-brand">
          <div className="text-center mb-10">
            <h2 className="section-title">Nos catégories</h2>
            <p className="section-subtitle">Une sélection couvrant tous les domaines de la vie chrétienne</p>
            <span className="divider-gold" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/boutique?categorieId=${cat.id}`}
                id={`home-cat-${cat.id}`}
                className="card text-center hover:border-brand-or group p-5"
              >
                <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                  <BookOpen className="w-5 h-5 text-brand-or" />
                </div>
                <p className="font-serif font-semibold text-brand-dark text-sm group-hover:text-brand-orange transition-colors">{cat.nom}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-brand">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos services</h2>
            <p className="section-subtitle">Plus qu'une librairie, un espace de croissance et de communauté</p>
            <span className="divider-gold" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="card text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: s.color === '#EA580C' ? 'linear-gradient(135deg, #EA580C, #9A3412)' : 'linear-gradient(135deg, #C8A24A, #A8832A)' }}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-brand-dark mb-2">{s.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== TÉMOIGNAGES ===== */}
      <section className="py-16 md:py-20" style={{ background: 'linear-gradient(135deg, #EA580C 0%, #9A3412 100%)' }}>
        <div className="container-brand text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-2">Ce que disent nos lecteurs</h2>
          <span className="block w-12 h-1 rounded-full mx-auto mt-3 mb-10" style={{ background: '#C8A24A' }} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { nom: 'Sarah K.', ville: 'Yaoundé', note: 5, texte: 'Living Letters a transformé ma bibliothèque spirituelle. Des livres de qualité et un service exceptionnel !' },
              { nom: 'Jean-Paul M.', ville: 'Douala', note: 5, texte: 'Enfin une librairie chrétienne sérieuse au Cameroun. Le club de lecture est une vraie bénédiction.' },
              { nom: 'Grace T.', ville: 'Bafoussam', note: 5, texte: 'Je commande régulièrement en ligne. Livraison rapide et livres en parfait état. Je recommande !' },
            ].map((t) => (
              <div key={t.nom} className="p-6 rounded-2xl bg-white/10 border border-white/20 text-left">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.note)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-or text-brand-or" />
                  ))}
                </div>
                <p className="text-white/80 text-sm italic leading-relaxed mb-4">"{t.texte}"</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.nom}</p>
                  <p className="text-white/40 text-xs">{t.ville}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-16 bg-white">
        <div className="container-brand text-center">
          <h2 className="section-title mb-4">Prêt à commencer votre lecture ?</h2>
          <p className="section-subtitle mb-8">Explorez notre catalogue et trouvez le livre qui changera votre vie.</p>
          <Link href="/boutique" id="home-cta-final" className="btn-primary text-base px-10 py-4 inline-flex">
            Découvrir la boutique
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
