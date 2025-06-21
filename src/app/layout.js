import '../styles/globals.css';

export const metadata = {
  title: 'Marine Forecast',
  description:
    'A real-time marine weather web application that provides detailed forecasts for wave height, wind speed, and ocean conditions to help sailors, fishermen, and coastal users plan safely.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
