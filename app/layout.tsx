import type { Metadata } from "next";
import { Bellefair, DM_Sans } from "next/font/google";
import "./globals.css";

const bellefair = Bellefair({
  weight: "400",
  variable: "--font-bellefair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ari Wijaya Putra — Professional Web Developer",
  description:
    "Software engineer yang senang mengubah ide kompleks menjadi pengalaman yang sederhana.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${bellefair.variable} ${dmSans.variable} antialiased`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
