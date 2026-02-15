"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    TrendingUp,
    MessageSquare,
    Calendar as CalendarIcon,
    Sparkles,
    ArrowUpRight,
    Clock,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Posts Gerados", value: "24", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Engajamento Estimado", value: "+12.4%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Publicações", value: "8", icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Próximos Posts", value: "3", icon: CalendarIcon, color: "text-orange-500", bg: "bg-orange-500/10" },
];

const quickActions = [
    { title: "Criar novo Post", description: "Use o Chat IA para gerar conteúdo viral", icon: MessageSquare, href: "/chat", color: "linkedin-gradient" },
    { title: "Gerar Carrossel", description: "Transforme ideias em slides visuais", icon: Sparkles, href: "/carousel", color: "bg-purple-600" },
    { title: "Analisar Post", description: "Verifique o potencial viral do seu texto", icon: TrendingUp, href: "/analyze", color: "bg-emerald-600" },
];

export default function DashboardPage() {
    const [recentActivity, setRecentActivity] = React.useState<any[]>([]);

    React.useEffect(() => {
        try {
            const savedPosts = JSON.parse(localStorage.getItem("viral_posts") || "[]");
            setRecentActivity(Array.isArray(savedPosts) ? savedPosts : []);
        } catch (e) {
            console.error("Erro ao carregar posts:", e);
            setRecentActivity([]);
        }
    }, []);

    const stats = [
        { label: "Posts Gerados", value: recentActivity.length.toString(), icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Análises", value: recentActivity.filter(p => p.type === "analysis").length.toString(), icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Publicações", value: "0", icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Próximos Posts", value: "0", icon: CalendarIcon, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground italic">Bem-vindo de volta! Vamos criar algo incrível hoje?</p>
                    </div>
                    <Button className="linkedin-gradient border-none h-11 rounded-full px-6 shadow-lg shadow-primary/20 gap-2 font-bold" asChild>
                        <Link href="/chat">
                            <Plus size={20} /> Novo Post Viral
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 glass border-primary/5 hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-black">{stat.value}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions & Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="text-primary w-5 h-5" /> Ações Rápidas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {quickActions.map((action) => (
                                    <Link key={action.title} href={action.href}>
                                        <Card className="p-5 h-full hover:shadow-lg transition-all border-primary/5 group">
                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-md", action.color)}>
                                                <action.icon size={20} />
                                            </div>
                                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{action.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Clock className="text-primary w-5 h-5" /> Atividade Recente
                                </h2>
                                <Button variant="ghost" size="sm" className="text-primary text-xs font-bold" asChild>
                                    <Link href="/chat">Ver tudo</Link>
                                </Button>
                            </div>
                            <Card className="glass border-primary/5 divide-y overflow-hidden">
                                {recentActivity.length === 0 ? (
                                    <div className="p-12 text-center space-y-4">
                                        <p className="text-sm text-muted-foreground">Opa! Nada por aqui ainda.</p>
                                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-600 max-w-xs mx-auto">
                                            <p className="font-bold mb-1">Dica de Diagnóstico:</p>
                                            Se a IA não responder no Chat, certifique-se de que você inseriu sua <strong>OPENAI_API_KEY</strong> no arquivo <strong>.env.local</strong>.
                                        </div>
                                    </div>
                                ) : (
                                    recentActivity.map((item, idx) => (
                                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded bg-background border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                    {item.type === "chat" ? <MessageSquare size={18} /> : <Sparkles size={18} />}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-sm truncate max-w-[200px] md:max-w-md">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] uppercase font-black tracking-widest px-2 py-0.5",
                                                    item.status === "Publicado" ? "text-green-500 border-green-500/20 bg-green-500/5" :
                                                        item.status === "Agendado" ? "text-blue-500 border-blue-500/20 bg-blue-500/5" :
                                                            "text-orange-500 border-orange-500/20 bg-orange-500/5"
                                                )}>
                                                    {item.status}
                                                </Badge>
                                                <ArrowUpRight className="text-muted-foreground h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </Card>
                        </section>
                    </div>

                    {/* Upcomming Schedule */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CalendarIcon className="text-primary w-5 h-5" /> Próximos no Calendário
                            </h2>
                            <Card className="p-6 glass border-primary/5 flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
                                    <CalendarIcon size={32} />
                                </div>
                                <h3 className="font-bold mb-2">Nada para amanhã</h3>
                                <p className="text-xs text-muted-foreground mb-6 max-w-[180px]">Mantenha sua presença ativa agendando novos conteúdos.</p>
                                <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary font-bold px-6" asChild>
                                    <Link href="/calendar">Abrir Calendário</Link>
                                </Button>
                            </Card>
                        </section>

                        <Card className="p-6 linkedin-gradient text-white border-none shadow-xl shadow-primary/20 overflow-hidden relative group">
                            <Sparkles className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform" />
                            <h3 className="font-black text-lg mb-2 italic">Dica Pro</h3>
                            <p className="text-xs opacity-90 leading-relaxed mb-4">
                                Posts publicados entre as 08:00 e 10:00 da manhã costumam ter 40% mais engajamento médio no LinkedIn Brasil.
                            </p>
                            <Link href="/analyze" className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                                Analisar melhor horário <ArrowUpRight size={10} />
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

