import type { Metadata } from "next";
import { Lobster, Poppins } from "next/font/google";
import "./globals.css";

// As fontes sao baixadas do Google Fonts na hora do build e servidas
// pelo proprio Next: no dia da apresentacao, nao depende de internet.
const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  variable: "--fonte-lobster",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--fonte-poppins",
});

export const metadata: Metadata = {
  title: "Tetê Lanches | Cardápio",
  description:
    "Cadastro do cardápio do Tetê Lanches: Next.js, Spring Boot e PostgreSQL rodando no Docker.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${lobster.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}