import '@/styles/globals.css';
import type { Metadata } from 'next';
import BackgroundDesign from '@/components/BackgroundDesign';

export const metadata: Metadata = {
  title: 'AUTOTRADE - Automated Investment Platform',
  description: 'Automated Investment Platform for smart trading',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='font-sans'>
        <BackgroundDesign />
        {children}
      </body>
    </html>
  );
}
