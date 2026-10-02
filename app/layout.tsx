import type { Metadata } from "next";
import "mafs/core.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whiteboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
