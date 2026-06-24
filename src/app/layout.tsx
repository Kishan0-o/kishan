import React from "react";
import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/navbar";
import MouseMoveEffect from "@/components/mouse-move-effect";
import JumpToTop from "@/components/jump-to-top";
import Footer from "@/components/footer";
import SmoothScroll from "@/components/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import FramerLazyMotion from "@/components/framer-lazy-motion";
import AnalyticsBeacon from "@/components/analytics-beacon";

const inter = Inter({ subsets: ["latin"] });
// const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Kishan Kumar – Motion Designer & Graphic Designer",
    template: "%s | Kishan Kumar",
  },
  description:
    "Turning raw footage into visual stories — with style, precision, and a touch of cinematic magic. Kishan Kumar specializes in CapCut, Premiere Pro, Photoshop, and DaVinci Resolve — delivering high-retention short-form videos, graphic designs, and scroll-stopping Meta ad creatives.",
  keywords: [
    "Kishan Kumar",
    "Motion Designer",
    "Graphic Designer",
    "Video Editor",
    "CapCut Editor",
    "Premiere Pro",
    "Photoshop",
    "DaVinci Resolve",
    "Color Grading",
    "Short Form Content",
    "Instagram Reels",
    "YouTube Shorts",
    "Meta Ad Creatives",
    "Visual Storytelling",
    "Freelance Video Editor",
    "Cinematic Editing",
    "Retention Pacing",
    "Dynamic Subtitles",
  ],
  authors: [{ name: "Kishan Kumar" }],
  creator: "Kishan Kumar",
  publisher: "Kishan Kumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kishan Kumar – Motion Designer & Graphic Designer",
    description:
      "Passionate Motion Designer and Graphic Designer delivering clean, cinematic edits and high-converting short-form visual content using CapCut, Premiere Pro, Photoshop, and DaVinci Resolve.",
    siteName: "Kishan Kumar Portfolio",
    images: [
      {
        url: "/og-image.png", // Ensure you add your own open graph preview image if you have one
        width: 1200,
        height: 630,
        alt: "Kishan Kumar - Motion Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishan Kumar – Motion Designer & Graphic Designer",
    description:
      "Crafting high-retention short-form edits, graphic design assets, and powerful Meta ad creatives. Let's make your content stand out.",
    creator: "@kishan0_0",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "Video Editing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#020817" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kishan Kumar",
              email: "098kishan@gmail.com",
              sameAs: [
                "https://linkedin.com/in/kishan--",
                "https://youtube.com/@vfxlyrical",
                "https://instagram.com/kishan0_o",
                "https://x.com/kishan0_0",
              ],
              jobTitle: "Motion Designer & Graphic Designer",
              knowsAbout: [
                "Video Editing",
                "Graphic Design",
                "Motion Graphics",
                "CapCut",
                "Adobe Premiere Pro",
                "Adobe Photoshop",
                "DaVinci Resolve",
                "Short-form Strategy",
                "Meta Ad Creatives",
                "Color Grading",
                "Retention Optimization",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen text-white`}
        style={{
          background: "#020817",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="grid-background-large min-h-screen">
          <SmoothScroll>
            <FramerLazyMotion>
              <MouseMoveEffect />
              <Navbar />
              <main className="">{children}</main>
              <Footer />
              <JumpToTop />
              <Toaster position="top-center" />
            </FramerLazyMotion>
          </SmoothScroll>
        </div>
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
