import { Fira_Code, JetBrains_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import './globals.css';

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

const DigitalRain = dynamic(() => import('@/components/DigitalRain'), { ssr: false });

export const metadata: Metadata = {
  title: 'AI Console',
  description: 'Terminal bridge + portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${jetbrainsMono.variable} ${firaCode.variable} ${jetbrainsMono.className} h-full scroll-smooth bg-black font-mono antialiased text-zinc-100`}
      >
        <DigitalRain />
        <div className="relative z-[1] min-h-full">{children}</div>
      </body>
    </html>
  );
}
