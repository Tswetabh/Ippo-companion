import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "Ippo — AI Student OS",
  description: "AI-powered Student Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body-md min-h-screen flex antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-sidebar-width min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
