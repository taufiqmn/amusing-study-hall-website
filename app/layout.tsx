import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import Starfield from '@/components/Starfield'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amusing Study Hall — Free C, Java, Matrix & HSC Courses in Bangla",
  description: "Learn C programming, Java, Matrix, and HSC subjects for free with easy Bangla explanations, video lessons, quizzes, and progress tracking.",
  other: {
    'color-scheme': 'light dark',
    'google-site-verification': 'B4bC_JZscs8fg13i3jvF4sK8T3SDfB4k-qRHUg76Tkc',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Starfield />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}