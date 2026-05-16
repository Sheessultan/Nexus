import { Fira_Code, Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import BinaryRain from '@/components/BinaryRain';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-console-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'NEXUS INTELLIGENCE',
  description: 'Terminal bridge + portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} ${inter.variable} ${jetbrainsMono.variable} ${firaCode.variable} h-full scroll-smooth bg-transparent font-sans antialiased text-zinc-100`}
      >
        <BinaryRain />
        <div className="relative z-[1] min-h-full">{children}</div>
      </body>
    </html>
  );
}
