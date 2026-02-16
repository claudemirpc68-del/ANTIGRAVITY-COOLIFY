"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Send,
    Sparkles,
    Trash2,
    Copy,
    Check,
    User,
    Bot,
    Loader2,
    AlertCircle,
    History
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Message = {
    role: "user" | "assistant";
    content: string;
};

const suggestions = [
    "Crie um post sobre como automação economiza tempo",
    "Escreva um gancho viral sobre transição de carreira",
    "Dê 5 dicas práticas sobre personal branding no LinkedIn",
    "Como usei IA para melhorar meu fluxo de trabalho"
];

export default function ChatPage() {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [copiedId, setCopiedId] = React.useState<number | null>(null);
    const [isKeyMissing, setIsKeyMissing] = React.useState(false);
    const [drafts, setDrafts] = React.useState<any[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Carregar drafts
    const loadDrafts = () => {
        try {
            const savedPosts = JSON.parse(localStorage.getItem("viral_posts") || "[]");
            setDrafts(Array.isArray(savedPosts) ? savedPosts : []);
        } catch (e) {
            console.error("Erro ao carregar rascunhos:", e);
        }
    };

    React.useEffect(() => {
        loadDrafts();
    }, []);

    // Carregar histórico
    React.useEffect(() => {
        try {
            const history = localStorage.getItem("viral_chat_history");
            if (history) setMessages(JSON.parse(history));
        } catch (e) {
            console.error("Erro ao carregar histórico:", e);
        }

        // Verificar se a chave é placeholder
        fetch("/api/chat/check-key").then(res => res.json()).then(data => {
            if (data.isPlaceholder) setIsKeyMissing(true);
        });
    }, []);

    // Salvar histórico
    React.useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("viral_chat_history", JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    React.useEffect(scrollToBottom, [messages]);

    const handleSend = async (content: string = input) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) throw new Error("Erro na comunicação com a IA");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            console.log("Iniciando leitura do stream...");
            while (true) {
                try {
                    const { done, value } = await reader!.read();
                    if (done) {
                        console.log("Stream finalizado com sucesso.");
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    console.log(`Recebido chunk (${value.length} bytes):`, chunk);
                    assistantContent += chunk;

                    setMessages((prev) => {
                        const last = prev[prev.length - 1];
                        return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                    });
                } catch (readError) {
                    console.error("Erro ao ler chunk do stream:", readError);
                    const errorMessage = readError instanceof Error ? readError.message : "Erro desconhecido";
                    throw new Error(`Falha na leitura do stream: ${errorMessage}`);
                }
            }

            // Salvar automaticamente como rascunho após concluir o streaming
            saveToDrafts(assistantContent);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro na comunicação com a IA";
            toast.error(errorMessage);
            setMessages((prev) => prev.slice(0, -1)); // Remove a mensagem vazia do assistente
        } finally {
            setIsLoading(false);
        }
    };

    const saveToDrafts = (content: string) => {
        const savedPosts = JSON.parse(localStorage.getItem("viral_posts") || "[]");
        const newPost = {
            id: Date.now().toString(),
            title: content.split('\n')[0].replace(/[#*]/g, '').substring(0, 50) + "...",
            content: content,
            status: "Rascunho",
            date: "Agora",
            type: "chat"
        };
        localStorage.setItem("viral_posts", JSON.stringify([newPost, ...savedPosts].slice(0, 10)));
        loadDrafts(); // Atualiza a lista de rascunhos
        toast.success("Rascunho salvo automaticamente!");
    };

    const copyToClipboard = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copiado para a área de transferência!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <AppLayout>
            <div className="flex flex-col h-[calc(100vh-8rem)]">
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Sparkles className="text-primary h-6 w-6" /> Chat <span className="text-primary italic">Viral</span>
                        </h1>
                        <p className="text-xs text-muted-foreground">Assistente especializado em LinkedIn Brasil</p>
                    </div>
                    <div className="flex gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 font-bold hidden md:flex" onClick={loadDrafts}>
                                    <History size={16} /> Meus Rascunhos
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Meus Rascunhos</SheetTitle>
                                    <SheetDescription>
                                        Histórico dos seus últimos posts gerados.
                                    </SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
                                    <div className="space-y-4">
                                        {drafts.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-8">Nenhum rascunho salvo ainda.</p>
                                        ) : (
                                            drafts.map((draft, idx) => (
                                                <Card key={idx} className="p-4 hover:bg-secondary/50 transition-colors border-primary/10">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-sm line-clamp-1">{draft.title}</h4>
                                                        <Badge variant="outline" className="text-[10px]">{draft.type}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                                                        {draft.content}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="w-full text-xs h-7"
                                                            onClick={() => copyToClipboard(draft.content, -1)}
                                                        >
                                                            <Copy size={12} className="mr-1" /> Copiar
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full text-xs h-7"
                                                            onClick={() => {
                                                                handleSend(`Continuar editando este post: ${draft.title}`);
                                                            }}
                                                        >
                                                            <Sparkles size={12} className="mr-1" /> Melhorar
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                        {isKeyMissing && (
                            <Badge variant="destructive" className="animate-pulse bg-red-500 hover:bg-red-600">
                                <AlertCircle size={12} className="mr-1" /> Chave API Pendente
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive gap-2 font-bold"
                            onClick={() => {
                                setMessages([]);
                                localStorage.removeItem("viral_chat_history");
                            }}
                        >
                            <Trash2 size={16} /> Limpar
                        </Button>
                    </div>
                </div>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col overflow-hidden glass border-primary/5">
                    <ScrollArea ref={scrollRef} className="flex-1 p-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                                    <Sparkles size={32} />
                                </div>
                                <div className="max-w-md">
                                    <h2 className="text-xl font-bold mb-2">Como posso acelerar seu LinkedIn hoje?</h2>
                                    <p className="text-sm text-muted-foreground mb-8">
                                        Eu conheço os segredos do engajamento orgânico. Peça uma ideia, um gancho ou a revisão de um texto.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {suggestions.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleSend(s)}
                                                className="p-3 text-xs text-left bg-background border border-primary/10 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                            >
                                                <span className="group-hover:text-primary leading-tight font-medium">{s}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((m, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2",
                                            m.role === "user" ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            m.role === "user" ? "bg-primary text-white" : "bg-secondary text-primary"
                                        )}>
                                            {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className="space-y-2">
                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm leading-relaxed",
                                                m.role === "user"
                                                    ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10"
                                                    : "bg-background border rounded-tl-none prose prose-sm dark:prose-invert max-w-none"
                                            )}>
                                                {m.role === "assistant" ? (
                                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                                ) : (
                                                    m.content
                                                )}
                                            </div>
                                            {m.role === "assistant" && m.content && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                        onClick={() => copyToClipboard(m.content, idx)}
                                                    >
                                                        {copiedId === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                                                        Agendar Post
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && messages[messages.length - 1].role === "user" && (
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                                            <Bot size={16} />
                                        </div>
                                        <div className="bg-background border p-4 rounded-2xl rounded-tl-none">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-card/50">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2 items-center"
                        >
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Descreva seu tema ou peça um gancho..."
                                    className="h-12 pl-4 pr-12 rounded-xl focus-visible:ring-primary/20 border-primary/5 bg-background shadow-inner"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute right-1.5 top-1.5 h-9 w-9 linkedin-gradient border-none transition-transform hover:scale-105 active:scale-95"
                                    disabled={!input.trim() || isLoading}
                                >
                                    <Send size={18} />
                                </Button>
                            </div>
                        </form>
                        <p className="text-[10px] text-center mt-2 text-muted-foreground">
                            Dica: Conte uma história real para resultados 3x melhores.
                        </p>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
