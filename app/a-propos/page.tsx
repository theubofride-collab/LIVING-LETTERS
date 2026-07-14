import type { Metadata } from 'next'
import { BookOpen, Flame, Globe, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'À propos — Living Letters El Deah',
  description: "Découvrez l'histoire, la vision et la mission de Living Letters, librairie chrétienne au Cameroun fondée sur 2 Corinthiens 3:2-3.",
}

export default function AProposPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FFF5EC' }}>
      {/* Hero */}
      <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
        <p className="text-brand-or text-xs font-bold tracking-widest uppercase mb-3">Notre histoire</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">À propos de Living Letters</h1>
        <p className="text-white/60 max-w-xl mx-auto">Une librairie née d'une conviction profonde : la connaissance de Dieu transforme les hommes.</p>
      </section>

      {/* Verset fondateur */}
      <section className="py-12 bg-white">
        <div className="container-brand max-w-3xl text-center">
          <p className="font-serif text-2xl md:text-3xl italic text-brand-dark leading-relaxed">
            "Vous êtes vous-mêmes notre lettre, écrite dans nos cœurs, connue et lue de tous les hommes ; vous manifestez que vous êtes une lettre de Christ…"
          </p>
          <p className="text-brand-or font-semibold mt-4">— 2 Corinthiens 3:2-3</p>
          <span className="divider-gold mt-4" />
        </div>
      </section>

      {/* El Deah */}
      <section className="py-16 md:py-24">
        <div className="container-brand">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Signification du logo */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-3xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                <div className="text-center">
                  <BookOpen className="w-10 h-10 text-brand-or mx-auto" />
                  <Flame className="w-6 h-6 text-brand-or mx-auto -mt-2" />
                </div>
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">Notre logo</h2>
              <p className="text-brand-muted leading-relaxed max-w-sm">
                Un livre ouvert surmonté d'une flamme — symbole de la Parole de Dieu qui illumine et transforme. 
                Le livre représente la connaissance, la flamme représente l'Esprit qui donne vie à ce que nous lisons.
              </p>
            </div>

            {/* Signification El Deah */}
            <div>
              <p className="text-brand-or text-xs font-bold tracking-widest uppercase mb-3">Le nom El Deah</p>
              <h2 className="section-title mb-4">אֵל דֵּעָה</h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                <strong className="text-brand-dark">El Deah</strong> est un terme hébreu tiré de 1 Samuel 2:3 qui signifie 
                <em>"Dieu de la connaissance"</em> ou <em>"Dieu du savoir"</em>. C'est l'un des noms de Dieu dans l'Ancien Testament.
              </p>
              <p className="text-brand-muted leading-relaxed mb-4">
                Ce nom reflète notre conviction que toute vraie connaissance trouve sa source en Dieu, et que la lecture 
                chrétienne est une forme d'adoration et de croissance spirituelle.
              </p>
              <p className="text-brand-muted leading-relaxed">
                <em>"Car l'Éternel est un Dieu qui sait tout, et c'est lui qui pèse les actions."</em> — 1 Samuel 2:3
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container-brand">
          <div className="text-center mb-12">
            <h2 className="section-title">Vision & Mission</h2>
            <span className="divider-gold" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                <Globe className="w-7 h-7 text-brand-or" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-3">Notre vision</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Être la référence en matière de ressources chrétiennes de qualité en Afrique centrale, 
                en commençant par le Cameroun, pour une génération de chrétiens éclairés et engagés.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #C8A24A, #A8832A)' }}>
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-3">Notre mission</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Mettre à la portée de chaque chrétien camerounais, sans distinction d'âge ou de niveau, 
                des ressources bibliques et spirituelles de haute qualité pour grandir dans la foi.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                <Heart className="w-7 h-7 text-brand-or" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-3">Nos valeurs</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Excellence, intégrité, accessibilité et amour du prochain. Nous croyons que chaque livre 
                vendu peut changer une vie et contribuer au renouveau spirituel de notre nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Slogan */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
        <div className="container-brand text-center">
          <p className="font-serif text-5xl md:text-6xl font-bold text-brand-or mb-4">"Read."</p>
          <p className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">"Think."</p>
          <p className="font-serif text-5xl md:text-6xl font-bold text-brand-or">"Become."</p>
          <p className="mt-8 text-white/50 text-sm">Le slogan de Living Letters — El Deah</p>
        </div>
      </section>
    </div>
  )
}
