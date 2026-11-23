import '@/styles/globals.css';
import '@/styles/animations.css';
import type { Metadata } from 'next';
import BackgroundDesign from '@/components/BackgroundDesign';
import { LanguageProvider } from '@/components/LanguageProvider';

export const metadata: Metadata = {
  title: 'GINCANA - Automated Investment Platform',
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
        <div id="google_translate_element" className="googleTranslate"></div>
        <LanguageProvider>{children}</LanguageProvider>
        <script
          dangerouslySetInnerHTML={{ __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage:'pt', includedLanguages:'pt,en,de', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
            }
          ` }}
        />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async defer></script>
      </body>
    </html>
  );
}
