import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./colors.scss";

import NavProvider from "./context/NavContext";
import UserProvider from "./context/UserContext";
import { ChakraProvider } from '@chakra-ui/react';
import ModalProvider from "./context/ModalContext";
import ConfigProvider from "./context/ConfigContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu site",
  description: "Construindo o meu site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ChakraProvider>
          <NavProvider>
            <ConfigProvider>
              <UserProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </UserProvider>
            </ConfigProvider>
          </NavProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
