import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'
import { PanierProvider } from '@/context/PanierContext'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: {
    default: 'Living Letters — Librairie Chrétienne | El Deah',
    template: '%s | Living Letters',
  },
  description: 'Librairie chrétienne au Cameroun — Bibles, littérature chrétienne, développement personnel et leadership. Read, Think and Become.',
  keywords: ['librairie chrétienne', 'Cameroun', 'bibles', 'livres chrétiens', 'El Deah', 'Living Letters'],
  authors: [{ name: 'Living Letters El Deah' }],
  openGraph: {
    title: 'Living Letters — Librairie Chrétienne',
    description: 'Votre librairie chrétienne au Cameroun. Read, Think and Become.',
    type: 'website',
    locale: 'fr_CM',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased text-brand-dark dark:text-gray-100 bg-brand-cream dark:bg-gray-950 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <PanierProvider>
              <ToastProvider>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </ToastProvider>
            </PanierProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
