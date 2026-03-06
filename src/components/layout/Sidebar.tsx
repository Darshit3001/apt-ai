"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/uiStore";
import {
    Home,
    Search,
    Tag,
    Trophy,
    LayoutGrid,
    Zap,
    Users,
    Map,
    Mail,
    ShoppingBag,
    HelpCircle,
    Plus,
    ChevronLeft,
    ChevronRight,
    Linkedin,
} from "lucide-react";

const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Tag, label: "Deals", href: "/deals" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: LayoutGrid, label: "Categories", href: "/categories" },
    { icon: Zap, label: "Trending", href: "/trending" },
    { icon: Users, label: "Collections", href: "/collections" },
    { icon: Map, label: "Map", href: "/map" },
];

const bottomItems = [
    { icon: Mail, label: "Newsletter", href: "/newsletter" },
    { icon: ShoppingBag, label: "Merch", href: "/merch" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: Users, label: "Community", href: "/community", external: false },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar } = useUIStore();

    return (
        <aside
            className={`hidden lg:flex flex-col h-screen sticky top-0 z-40 border-r border-[var(--border-default)] bg-[var(--bg-primary)] transition-all duration-300 ${sidebarCollapsed ? "w-[68px]" : "w-[200px]"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-[var(--border-default)]">
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-8 h-8 rounded-lg shadow-lg transition-transform group-hover:scale-110 object-cover"
                    />
                    {!sidebarCollapsed && (
                        <span className="text-sm font-bold text-gradient font-[var(--font-display)] leading-tight">
                            MatchMyAI Tool
                        </span>
                    )}
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? "bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] shadow-sm"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                                }`}
                            title={item.label}
                        >
                            <item.icon
                                size={20}
                                className={`shrink-0 transition-colors ${isActive
                                    ? "text-[var(--color-primary-light)]"
                                    : "text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]"
                                    }`}
                            />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {/* Submit Tool button */}
                <div className="pt-3 pb-1">
                    <Link
                        href="/submit"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all duration-200 ${sidebarCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <Plus size={20} className="shrink-0" />
                        {!sidebarCollapsed && <span>Submit Tool</span>}
                    </Link>
                </div>
            </nav>

            {/* Bottom Items */}
            <div className="py-3 px-2 space-y-1 border-t border-[var(--border-default)]">
                {bottomItems.map((item) => {
                    const linkClass = "flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-200";
                    if (item.external) {
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkClass}
                                title={item.label}
                            >
                                <item.icon size={18} className="shrink-0" />
                                {!sidebarCollapsed && <span>{item.label}</span>}
                            </a>
                        );
                    }
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={linkClass}
                            title={item.label}
                        >
                            <item.icon size={18} className="shrink-0" />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}

                {/* Collapse toggle */}
                <button
                    onClick={toggleSidebar}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all duration-200 w-full"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight size={18} className="shrink-0" />
                    ) : (
                        <>
                            <ChevronLeft size={18} className="shrink-0" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
