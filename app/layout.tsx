'use client';
import localFont from "next/font/local";
import "./globals.css";
import { Auth0Provider } from '@auth0/auth0-react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		<Auth0Provider
		domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL || ''}
		clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
		authorizationParams={{
			redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
			audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
			scope: "read:current_user email",
		}}
	>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
		</Auth0Provider>
  );
}
