import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: 'Smart Doorbell - %s',
    default: 'Smart Doorbell',
  },
  description: "Monitor and control your smart doorbell",
  authors: [{ name: "Hayeen" }],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
              {children}
              <Toaster />
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
