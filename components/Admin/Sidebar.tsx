"use client";

import {
    LayoutDashboard,
    Store,
    BarChart2,
    Download,
    Activity,
    Users,
    ClipboardCheck,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NextImage from "next/image";

const navItems = [
    { href: "/adminPortal/overview", icon: <LayoutDashboard size={18} />, label: "Dashboard" },

    { href: "/adminPortal/overview/salons", icon: <Store size={18} />, label: "Salons" },

    { href: "/adminPortal/overview/analytics", icon: <BarChart2 size={18} />, label: "Users" },

    { href: "/adminPortal/overview/reports", icon: <Users size={18} />, label: "Customers" },

    { href: "/adminPortal/overview/reliability", icon: <Download size={18} />, label: "Reports" },

    { href: "/adminPortal/overview/settings", icon: <Activity size={18} />, label: "System Health" },

    { href: "/adminPortal/overview/pending-approvals", icon: <ClipboardCheck size={18} />, label: "Approvals" },
];


export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-card border-r border-border p-5 shadow-soft">
            <Link href="/" className="flex items-center gap-3 mb-10">
                <NextImage
                    src="/icons/9.png"
                    alt="StyGo logo"
                    width={40}
                    height={40}
                    className="rounded-xl"
                />

                <h1 className="text-2xl font-bold text-primary">StyGo Admin</h1>
            </Link>

            <nav className="flex flex-col space-y-2">
                {navItems.map(({ href, icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${pathname === href
                            ? "bg-primary text-primary-foreground shadow-medium"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                    >
                        {icon}
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>
        </aside>

    );
}
