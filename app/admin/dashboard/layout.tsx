import AdminNavBar from "@/components/Admin/AdminNavBar";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <AdminNavBar />
      <div>{children}</div>
    </main>
  );
}
