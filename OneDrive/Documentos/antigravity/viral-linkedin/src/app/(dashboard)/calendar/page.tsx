"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MessageSquare,
    MoreVertical,
    Sparkles
} from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const mockPosts = [
    { id: 1, date: new Date(), title: "Como usei IA no meu fluxo", type: "Post", status: "Agendado", time: "09:00" },
    { id: 2, date: new Date(), title: "O futuro do LinkedIn", type: "Carrossel", status: "Rascunho", time: "14:30" },
    { id: 3, date: new Date(new Date().setDate(new Date().getDate() + 1)), title: "Dicas de Branding", type: "Post", status: "Agendado", time: "10:00" },
];

export default function CalendarPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());

    const postsForSelectedDate = mockPosts.filter(
        (post) => format(post.date, "yyyy-MM-dd") === (date ? format(date, "yyyy-MM-dd") : "")
    );

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                            <CalendarIcon className="text-primary h-8 w-8" /> Calendário <span className="text-primary italic">Editorial</span>
                        </h1>
                        <p className="text-muted-foreground italic">Planeje sua dominância no LinkedIn de forma estratégica.</p>
                    </div>
                    <Button className="linkedin-gradient border-none h-11 rounded-full px-8 shadow-lg shadow-primary/20 gap-2 font-bold">
                        <Plus size={20} /> Agendar Conteúdo
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Calendar Picker */}
                    <Card className="lg:col-span-5 p-6 glass border-primary/5 flex flex-col items-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={ptBR}
                            className="rounded-md border-none"
                            classNames={{
                                day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-xl shadow-lg shadow-primary/30",
                                day_today: "bg-secondary text-primary font-black rounded-xl",
                                head_cell: "text-muted-foreground font-bold text-xs uppercase tracking-widest",
                                nav_button: "border-primary/10 hover:bg-primary/5 text-primary rounded-lg",
                            }}
                        />
                        <div className="mt-8 w-full p-4 border-t border-primary/5 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Resumo do Mês</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-secondary/50 rounded-xl">
                                    <p className="text-2xl font-black text-primary">12</p>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Posts Agendados</p>
                                </div>
                                <div className="p-3 bg-secondary/50 rounded-xl">
                                    <p className="text-2xl font-black text-primary">05</p>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Em Rascunho</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Schedule List */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="text-primary w-5 h-5" />
                                {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Próximos Posts"}
                            </h2>
                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest border-primary/20 text-primary bg-primary/5 px-3 py-1">
                                {postsForSelectedDate.length} Conteúdos
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {postsForSelectedDate.length > 0 ? (
                                postsForSelectedDate.map((post) => (
                                    <Card key={post.id} className="p-5 glass border-primary/5 hover:border-primary/20 transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-background border flex flex-col items-center justify-center text-primary shrink-0">
                                                    <span className="text-[10px] font-black leading-none">{post.time.split(":")[0]}</span>
                                                    <span className="text-[10px] font-medium opacity-60 leading-none">{post.time.split(":")[1]}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={cn(
                                                            "text-[9px] uppercase font-black tracking-tighter px-1.5 py-0",
                                                            post.type === "Post" ? "bg-blue-500" : "bg-purple-500"
                                                        )}>
                                                            {post.type}
                                                        </Badge>
                                                        <span className={cn(
                                                            "text-[9px] font-bold uppercase tracking-widest",
                                                            post.status === "Agendado" ? "text-green-500" : "text-orange-500"
                                                        )}>
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MessageSquare size={10} /> LinkedIn Brasil • Feed principal
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-primary/5 flex gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-primary">
                                                Editar
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-muted-foreground hover:text-primary">
                                                Pré-visualizar
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Card className="p-12 glass border-primary/5 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground opacity-30">
                                        <Plus size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Nenhum post para este dia</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                            Dê o primeiro passo para o sucesso no LinkedIn agendando um conteúdo hoje.
                                        </p>
                                    </div>
                                    <Button variant="outline" className="rounded-full border-primary/20 text-primary font-bold px-6">
                                        Criar com Inteligência <Sparkles size={14} className="ml-2" />
                                    </Button>
                                </Card>
                            )}
                        </div>

                        {/* Pro Tip */}
                        <Card className="p-6 linkedin-gradient text-white border-none shadow-xl shadow-primary/20">
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="w-5 h-5 opacity-80" />
                                <h4 className="font-black italic">Mantenha a Constância</h4>
                            </div>
                            <p className="text-[11px] opacity-90 leading-relaxed uppercase tracking-wider font-medium">
                                O algoritmo do LinkedIn favorece perfis que postam de 3 a 4 vezes por semana no mesmo horário. Use o calendário para garantir que você nunca perca uma janela de oportunidade.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
