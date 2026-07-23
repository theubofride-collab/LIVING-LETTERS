'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, User, AlertCircle } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import { livreService } from '@/services/livreService'
import { commentaireService } from '@/services/commentaireService'
import { Livre, Commentaire } from '@/types'
import { usePanier } from '@/hooks/usePanier'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/hooks/useAuth'

function formatPrix(prix: number) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(prix)
}

export default function FicheLivrePage({ params }: { params: { slug: string } }) {
  const [qte, setQte] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'avis'>('description')
  const { addItem } = usePanier()
  const { showToast } = useToast()
  const { user } = useAuth()

  const [livre, setLivre] = useState<Livre | null>(null)
  const [commentaires, setCommentaires] = useState<Commentaire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newComment, setNewComment] = useState('')
  const [newNote, setNewNote] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const l = await livreService.getBySlug(params.slug)
        setLivre(l)
        const c = await commentaireService.getByLivre(l.id)
        setCommentaires(c)
      } catch {
        setError('Livre introuvable.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.slug])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !livre) return
    setIsSubmitting(true)
    try {
      const created = await commentaireService.create(livre.id, { note: newNote, commentaire: newComment })
      setCommentaires(prev => [created, ...prev])
      setNewComment('')
      setNewNote(5)
      showToast('Votre avis a été publié !')
    } catch {
      showToast('Erreur lors de l\'envoi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5EC' }}>
        <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !livre) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF5EC' }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-brand-muted mx-auto mb-3" />
          <p className="text-brand-muted">{error || 'Livre introuvable.'}</p>
          <Link href="/boutique" className="btn-primary mt-4 inline-flex">Retour à la boutique</Link>
        </div>
      </div>
    )
  }

  const hasRealImage = livre.couverture && (livre.couverture.startsWith('http') || livre.couverture.startsWith('data:'))

  return (
    <div className="min-h-screen" style={{ background: '#FFF5EC' }}>
      <div className="container-brand py-8">
        <Link href="/boutique" className="btn-ghost mb-6 inline-flex gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour à la boutique
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Couverture */}
          <div className="rounded-2xl overflow-hidden aspect-[3/4] max-h-[480px] flex items-center justify-center"
            style={{ background: hasRealImage ? 'transparent' : 'linear-gradient(135deg, #EA580C 0%, #9A3412 50%, #1C1410 100%)' }}>
            {hasRealImage ? (
              <img src={livre.couverture} alt={livre.nom} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-or/40"
                  style={{ background: 'rgba(200,162,74,0.15)' }}>
                  <span className="font-serif text-5xl text-brand-or">✦</span>
                </div>
                <p className="font-serif text-2xl font-bold text-white leading-snug">{livre.nom}</p>
                {livre.auteurs && livre.auteurs.length > 0 && (
                  <p className="text-brand-or/70 text-sm mt-2">{livre.auteurs.map(a => a.nom).join(', ')}</p>
                )}
              </div>
            )}
          </div>

          {/* Détails */}
          <div>
            {livre.categorie && (
              <span className="text-xs font-bold tracking-widest uppercase text-brand-or">{livre.categorie.nom}</span>
            )}
            <h1 className="font-serif text-3xl font-bold text-brand-dark mt-1 mb-2">{livre.nom}</h1>

            {livre.auteurs && livre.auteurs.length > 0 && (
              <p className="text-brand-muted text-sm mb-4">
                Par <span className="font-semibold text-brand-dark">{livre.auteurs.map(a => a.nom).join(', ')}</span>
              </p>
            )}

            {livre.notemoyenne != null && (
              <div className="flex items-center gap-2 mb-4">
                <StarRating value={Math.round(livre.notemoyenne)} readonly size="md" />
                <span className="text-sm font-semibold text-brand-dark">{livre.notemoyenne.toFixed(1)}</span>
                <span className="text-sm text-brand-muted">({livre.nbCommentaires ?? 0} avis)</span>
              </div>
            )}

            <p className="font-serif text-4xl font-bold mb-2" style={{ color: '#EA580C' }}>
              {formatPrix(livre.prix)}
            </p>

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${livre.stock > 5 ? 'bg-green-500' : livre.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${livre.stock > 5 ? 'text-green-700' : livre.stock > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                {livre.stock > 5 ? `En stock (${livre.stock} disponibles)` : livre.stock > 0 ? `Derniers exemplaires (${livre.stock})` : 'Épuisé'}
              </span>
            </div>

            {livre.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-brand-cream-dark rounded-xl overflow-hidden">
                  <button className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-brand-orange hover:bg-brand-cream transition-colors"
                    onClick={() => setQte(q => Math.max(1, q - 1))} aria-label="Diminuer">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-brand-dark text-sm">{qte}</span>
                  <button className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-brand-orange hover:bg-brand-cream transition-colors"
                    onClick={() => setQte(q => Math.min(livre.stock, q + 1))} aria-label="Augmenter">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  id="fiche-add-to-cart"
                  onClick={() => { addItem({ qte, panierId: 1, livreId: livre.id, livre }); showToast(`${livre.nom} ajouté au panier`) }}
                  className="btn-primary flex-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </button>
              </div>
            )}

            {livre.auteurs && livre.auteurs.map(auteur => (
              <div key={auteur.id} className="card-flat p-4 flex items-start gap-3 mt-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                  <User className="w-5 h-5 text-brand-or" />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{auteur.nom}</p>
                  <p className="text-xs text-brand-muted">{auteur.profession}</p>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{auteur.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Onglets Description / Avis */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-card">
          <div className="flex border-b border-brand-cream-dark">
            {(['description', 'avis'] as const).map((tab) => (
              <button key={tab} id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors capitalize ${activeTab === tab ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-brand-muted hover:text-brand-dark'}`}>
                {tab === 'avis' ? `Avis (${commentaires.length})` : 'Description'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-brand-dark-soft leading-relaxed">{livre.description}</p>
              </div>
            )}
            {activeTab === 'avis' && (
              <div className="space-y-5">
                {commentaires.length === 0 && (
                  <p className="text-brand-muted text-sm text-center py-8">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>
                )}
                {commentaires.map((c) => (
                  <div key={c.id} className="border-b border-brand-cream-dark pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                          {c.utilisateur?.nom?.[0] ?? 'A'}
                        </div>
                        <span className="font-semibold text-sm text-brand-dark">{c.utilisateur?.nom ?? 'Anonyme'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating value={c.note} readonly size="sm" />
                        <span className="text-xs text-brand-muted">
                          {new Date(c.dateAvis).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-brand-dark-soft leading-relaxed">{c.commentaire}</p>
                  </div>
                ))}

                <div className="mt-8 pt-8 border-t border-brand-cream-dark">
                  <h3 className="font-serif font-bold text-lg mb-4">Laissez votre avis</h3>
                  {user ? (
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Votre note</label>
                        <select
                          className="input-field max-w-[150px]"
                          value={newNote}
                          onChange={(e) => setNewNote(Number(e.target.value))}
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Très bien</option>
                          <option value="3">3 - Bien</option>
                          <option value="2">2 - Moyen</option>
                          <option value="1">1 - Décevant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Votre commentaire</label>
                        <textarea
                          required
                          rows={4}
                          className="input-field resize-none"
                          placeholder="Qu'avez-vous pensé de ce livre ?"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                      >
                        {isSubmitting ? 'Envoi...' : 'Publier mon avis'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-brand-cream p-6 rounded-xl text-center">
                      <p className="text-brand-muted mb-4">Vous devez être connecté pour laisser un avis.</p>
                      <Link href="/connexion" className="btn-secondary inline-flex">
                        Se connecter
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
