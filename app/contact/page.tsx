'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 container-brand py-16 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
          <CheckCircle className="w-10 h-10 text-brand-or" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-dark">Message envoyé !</h2>
        <p className="text-brand-muted max-w-sm">Merci pour votre message. Notre équipe vous répondra dans les 48 heures.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF5EC' }}>
      <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
        <h1 className="font-serif text-4xl font-bold text-white mb-3">Contactez-nous</h1>
        <p className="text-white/60">Nous serions ravis d'entendre de vous. Posez vos questions, passez nous voir !</p>
      </section>

      <div className="container-brand py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Informations */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6">Nos coordonnées</h2>
            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Adresse', value: 'Damas terre rouge et melen en face du CHU' },
                { icon: Phone, label: 'Téléphone', value: '652884093 / 655157661' },
                { icon: Mail, label: 'Email', value: 'livingletters237@gmail.com' },
                { icon: Clock, label: 'Horaires', value: 'Lun-Sam : 8h00 — 18h00' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #EA580C, #9A3412)' }}>
                    <Icon className="w-5 h-5 text-brand-or" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">{label}</p>
                    <p className="font-medium text-brand-dark mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl" style={{ background: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.2)' }}>
              <p className="font-serif font-semibold text-brand-dark mb-2">Club de lecture</p>
              <p className="text-sm text-brand-muted">Rejoignez notre club de lecture mensuel. Sessions chaque premier samedi du mois. Inscription gratuite !</p>
            </div>
          </div>

          {/* Formulaire */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="contact-nom">Nom complet</label>
                  <input id="contact-nom" type="text" required className="input-field" placeholder="Votre nom"
                    value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
                </div>
                <div>
                  <label className="label" htmlFor="contact-email">Email</label>
                  <input id="contact-email" type="email" required className="input-field" placeholder="votre@email.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="contact-sujet">Sujet</label>
                <select id="contact-sujet" className="input-field"
                  value={form.sujet} onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}>
                  <option value="">Choisir un sujet</option>
                  <option>Commande / livraison</option>
                  <option>Club de lecture</option>
                  <option>Partenariat école</option>
                  <option>Partenariat éditeur</option>
                  <option>Accompagnement spirituel</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" required rows={5} className="input-field resize-none"
                  placeholder="Votre message…"
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" id="contact-submit" disabled={loading} className="btn-primary w-full justify-center">
                <Send className="w-4 h-4" />
                {loading ? 'Envoi en cours…' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
