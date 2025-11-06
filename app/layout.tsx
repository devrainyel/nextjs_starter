import type { Metadata } from 'next';
import { Public_Sans, Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import './globals.css';
import Prism from './components/Prism';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DevSphere',
  description: 'The Show for Every Dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${publicSans.variable} ${inter.variable} min-h-screen antialiased`}
      >
        <Navbar />
        <div className='absolute inset-0 top-0 z-[-1] min-h-screen'>
          <Prism
            animationType='rotate'
            timeScale={0.5}
            height={2}
            baseWidth={3}
            scale={3}
            hueShift={0}
            colorFrequency={1}
            noise={0.5}
            glow={0.2}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
