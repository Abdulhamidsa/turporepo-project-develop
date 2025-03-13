/* eslint-disable import/order */
import '@repo/ui/globals.css';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';

import BackToPortfolioButton from '../components/BackToPortfolioButton';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ProFolio - Showcase & Grow Your Work',
  description:
    'Effortlessly create, deploy, and showcase your portfolio while connecting with a thriving community of professionals.',
  keywords: 'portfolio, professional, showcase, career, networking, community',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'ProFolio - Showcase & Grow Your Work',
    description:
      'Effortlessly create, deploy, and showcase your portfolio while connecting with a thriving community of professionals.',
    url: 'https://profolio-internal.vercel.app',
    siteName: 'ProFolio',
    images: [
      {
        url: 'https://profolio-internal.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ProFolio - Showcase Your Work',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <BackToPortfolioButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
