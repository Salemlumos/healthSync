import type { Metadata } from "next";
import Navbar from "../components/Navbar";
export const metadata: Metadata = {
  title: "HealthSync - Menu",
  description: "Menu Principal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ease-in flex w-full h-full scr">
      <Navbar />
      {children}
    </div>
  );
}
