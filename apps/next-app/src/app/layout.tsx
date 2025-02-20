import '@repo/ui/globals.css';
import { ThemeProvider } from 'next-themes';
/* eslint-disable import/order */
import { Inter } from 'next/font/google';

import { Footer } from '../components/footer';
import { Nav } from '../components/nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ProFolio',
  description: 'Discover amazing projects and talented professionals',
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
        </ThemeProvider>
      </body>
    </html>
  );
}
