import localFont from "next/font/local";
import "./globals.css";
import BlurLayout from "@/components/ui/blurLayout";

export const metadata = {
  title: "Xexadons",
  description: "NFT Market pllace",
};

const clashDisplay = localFont({
    src: [
        {
            path: "../fonts/ClashDisplay-Variable.woff2",
            weight: "900",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "../fonts/ClashDisplay-Extralight.woff2",
            weight: "200",
            style: "normal",
        },
        
    ],
});

export default function RootLayout({ children }) {
  return (
      <html lang="en">
          <body className={clashDisplay.className}>
              <BlurLayout />
              {children}
          </body>
      </html>
  );
}
