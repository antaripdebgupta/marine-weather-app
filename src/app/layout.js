import '../styles/globals.css';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export const metadata = {
  title: 'Marine Forecast',
  description:
    'A real-time marine weather web application that provides detailed forecasts for wave height, wind speed, and ocean conditions to help sailors, fishermen, and coastal users plan safely.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="custom-scrollbar">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
