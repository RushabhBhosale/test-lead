import './globals.css';

export const metadata = {
  title: 'Homestead | Property & Leads',
  description: 'A simple real estate property and lead manager.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
