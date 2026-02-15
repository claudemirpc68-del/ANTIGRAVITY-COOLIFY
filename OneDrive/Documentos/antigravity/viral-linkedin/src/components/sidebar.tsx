"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LayoutDashboard,
    MessageSquare,
    Layout as CarouselIcon,
    Calendar as CalendarIcon,
    BarChart3,
    Image as GalleryIcon,
    Settings,
    LogOut,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: MessageSquare, label: "Chat IA", href: "/chat" },
    { icon: BarChart3, label: "Análise", href: "/analyze" },
    { icon: CarouselIcon, label: "Carrossel", href: "/carousel" },
    { icon: CalendarIcon, label: "Calendário", href: "/calendar" },
    { icon: GalleryIcon, label: "Galeria", href: "/gallery" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <aside
            className={cn(
                "relative flex flex-col h-screen border-r bg-card transition-all duration-300 ease-in-out z-20",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 h-16 border-b">
                <div className="min-w-[32px] h-8 rounded bg-primary flex items-center justify-center">
                    <Sparkles className="text-white w-5 h-5" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg tracking-tight truncate">
                        LinkedIn<span className="text-primary font-black uppercase italic"> Viral</span>
                    </span>
                )}
            </div>

            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md hidden md:flex"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </Button>

            {/* Menu Principal */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Tooltip key={item.href} delayDuration={0} disableHoverableContent={!collapsed}>
                                <TooltipTrigger asChild>
                                    <Link href={item.href}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start",
                                                isActive && "bg-primary/10 text-primary font-semibold hover:bg-primary/20",
                                                collapsed ? "px-2" : "px-4"
                                            )}
                                        >
                                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                            {!collapsed && <span className="ml-3">{item.label}</span>}
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                {collapsed && (
                                    <TooltipContent side="right">{item.label}</TooltipContent>
                                )}
                            </Tooltip>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Footer / Settings */}
            <div className="p-4 border-t space-y-2">
                <Button
                    variant="ghost"
                    size={collapsed ? "icon" : "default"}
                    className={cn("w-full justify-start", collapsed ? "px-2" : "px-4")}
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    {!collapsed && <span className="ml-3">Trocar Tema</span>}
                </Button>
            </div>
        </aside>
    );
}
