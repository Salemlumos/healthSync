import "./globals.css";
import "./animations.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./Providers/AuthProvider";
import pt_BR from "antd/es/locale/pt_BR";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Healthsync - Saúde",
  description: "Plataforma de atendimento médico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="bg-slate-200">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Quicksand" }} className={inter.className}>
        <AuthProvider>
          <ConfigProvider
            locale={pt_BR}
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#16A34A",
                // borderRadius: 2,
                // Alias Token
                // colorBgContainer: "#f6ffed",
              },
              components: {
                Button: {
                  // colorPrimary: "#00b96b",
                  algorithm: true, // Enable algorithm
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
