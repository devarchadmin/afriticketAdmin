
import React from "react";
import { Providers } from "@/store/providers";
import MyApp from './app';
import "./global.css";


export const metadata = {
  title: 'AfrikTicket Organisation Portal',
  description: 'AfrikTicket Organisation Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <MyApp>{children}</MyApp>
        </Providers>
      </body>
    </html>
  );
}


