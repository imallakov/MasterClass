import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { NavigationProvider } from "./context/NavigationContext";
import { PaymentProvider } from "./context/PaymentContext";
import AuthWrapper from "./components/AuthWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "дворецмастеров.рф",
  description: "дворецмастеров.рф",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthWrapper>
            <NavigationProvider>
              <PaymentProvider>{children}</PaymentProvider>
            </NavigationProvider>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
