import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShadowReply AI — Réponses stratégiques générées par IA',
  description:
    'Reçois 3 réponses stratégiques à chaque message. Détaché, charismatique, assertif. Maîtrise tes conversations.',
  keywords: [
    'IA',
    'réponses',
    'messages',
    'communication',
    'stratégie',
    'dating',
    'business',
    'conflict',
  ],
  authors: [{ name: 'ShadowReply AI' }],
  openGraph: {
    title: 'ShadowReply AI',
    description: 'Réponses stratégiques générées par IA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#15151f',
              color: '#f4f4f5',
              border: '1px solid #27272a',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#15151f',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#15151f',
              },
            },
          }}
        />
      </body>
    </html>
  );
}