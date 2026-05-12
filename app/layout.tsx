import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { ZkLoginProvider } from "@/contexts/ZkLoginContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flow Protocol",
  description: "Programmable payments on Sui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>
          <ZkLoginProvider>
            <Navbar />
            {children}
          </ZkLoginProvider>
        </Providers>
      </body>
    </html>
  );
}
