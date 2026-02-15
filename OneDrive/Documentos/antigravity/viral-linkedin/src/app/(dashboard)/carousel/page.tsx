"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Sparkles,
    Trash2,
    Copy,
    Loader2,
    Layout as CarouselIcon,
    ChevronLeft,
    ChevronRight,
    GripVertical
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Slide = {
    title: string;
    content: string;
};

export default function CarouselPage() {
    const [topic, setTopic] = React.useState("");
    const [slides, setSlides] = React.useState<Slide[]>([]);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [currentSlide, setCurrentSlide] = React.useState(0);

    const handleGenerate = async () => {
        if (!topic.trim() || isGenerating) return;

        setIsGenerating(true);
        try {
            const response = await fetch("/api/carousel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) throw new Error("Erro ao gerar slides.");

            const data = await response.json();
            setSlides(data.slides);
            setCurrentSlide(0);
            saveToDrafts(topic, data.slides);
            toast.success("Estrutura do carrossel gerada!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveToDrafts = (topic: string, slides: any[]) => {
        const savedPosts = JSON.parse(localStorage.getItem("viral_posts") || "[]");
        const newPost = {
            id: Date.now().toString(),
            title: `Carrossel: ${topic}`,
            content: `Carrossel gerado com ${slides.length} slides.`,
            status: "Rascunho",
            date: "Agora",
            type: "carousel"
        };
        localStorage.setItem("viral_posts", JSON.stringify([newPost, ...savedPosts].slice(0, 10)));
    };

    const updateSlide = (idx: number, field: keyof Slide, value: string) => {
        const newSlides = [...slides];
        newSlides[idx] = { ...newSlides[idx], [field]: value };
        setSlides(newSlides);
    };

    const addSlide = () => {
        setSlides([...slides, { title: "Novo Slide", content: "Conteúdo do slide..." }]);
        setCurrentSlide(slides.length);
    };

    const removeSlide = (idx: number) => {
        const newSlides = slides.filter((_, i) => i !== idx);
        setSlides(newSlides);
        if (currentSlide >= newSlides.length) {
            setCurrentSlide(Math.max(0, newSlides.length - 1));
        }
    };

    const copyAll = () => {
        const text = slides.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.content}`).join("\n\n---\n\n");
        navigator.clipboard.writeText(text);
        toast.success("Todo o conteúdo copiado!");
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                            <CarouselIcon className="text-primary h-8 w-8" /> Designer de <span className="text-primary italic">Carrossel</span>
                        </h1>
                        <p className="text-muted-foreground italic">Estruture slides visuais que prendem a atenção.</p>
                    </div>
                    <div className="flex gap-2">
                        {slides.length > 0 && (
                            <Button variant="outline" className="rounded-full font-bold px-6 border-primary/20 text-primary" onClick={copyAll}>
                                <Copy size={16} className="mr-2" /> Copiar Tudo
                            </Button>
                        )}
                        <Button
                            className="linkedin-gradient border-none h-11 rounded-full px-8 shadow-lg shadow-primary/20 gap-2 font-bold"
                            onClick={addSlide}
                        >
                            <Plus size={20} /> Adicionar Slide
                        </Button>
                    </div>
                </div>

                {/* Input Topic */}
                <Card className="p-1 glass border-primary/5 flex items-center shadow-xl">
                    <Input
                        placeholder="Qual o tema do seu carrossel? (ex: 5 dicas de automação)"
                        className="h-14 border-none focus-visible:ring-0 text-lg px-6"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <Button
                        className="mr-1 h-12 px-6 rounded-xl linkedin-gradient border-none font-bold"
                        onClick={handleGenerate}
                        disabled={!topic.trim() || isGenerating}
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Gerar Estrutura
                    </Button>
                </Card>

                {/* Editor Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[500px]">
                    {/* Thumbnails Sidebar */}
                    <Card className="lg:col-span-3 glass border-primary/5 p-4 overflow-hidden flex flex-col">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Slides</h3>
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {slides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={cn(
                                        "p-3 rounded-xl border text-left cursor-pointer transition-all relative group",
                                        currentSlide === idx ? "border-primary bg-primary/5 shadow-md" : "border-transparent hover:bg-secondary/50"
                                    )}
                                >
                                    <p className="text-[10px] font-bold text-muted-foreground mb-1">Slide {idx + 1}</p>
                                    <p className="text-xs font-bold truncate">{slide.title || "Sem título"}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeSlide(idx); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-destructive p-1 hover:bg-destructive/10 rounded"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {slides.length === 0 && (
                                <p className="text-xs text-center text-muted-foreground mt-10 italic">Nenhum slide gerado.</p>
                            )}
                        </div>
                    </Card>

                    {/* Main Slide Editor */}
                    <Card className="lg:col-span-9 glass border-primary/5 p-8 relative flex flex-col justify-center items-center shadow-2xl">
                        <AnimatePresence mode="wait">
                            {slides.length > 0 ? (
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="w-full max-w-xl space-y-6"
                                >
                                    <div className="space-y-4">
                                        <Input
                                            className="text-3xl font-black h-auto p-0 border-none focus-visible:ring-0 bg-transparent placeholder:opacity-30"
                                            placeholder="Título do Slide..."
                                            value={slides[currentSlide].title}
                                            onChange={(e) => updateSlide(currentSlide, "title", e.target.value)}
                                        />
                                        <Textarea
                                            className="text-xl min-h-[150px] p-0 border-none focus-visible:ring-0 bg-transparent resize-none leading-relaxed placeholder:opacity-30"
                                            placeholder="Conteúdo do slide..."
                                            value={slides[currentSlide].content}
                                            onChange={(e) => updateSlide(currentSlide, "content", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full bg-secondary/50"
                                                disabled={currentSlide === 0}
                                                onClick={() => setCurrentSlide(prev => prev - 1)}
                                            >
                                                <ChevronLeft size={20} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full bg-secondary/50"
                                                disabled={currentSlide === slides.length - 1}
                                                onClick={() => setCurrentSlide(prev => prev + 1)}
                                            >
                                                <ChevronRight size={20} />
                                            </Button>
                                        </div>
                                        <span className="text-xs font-black tracking-widest text-muted-foreground">
                                            {currentSlide + 1} / {slides.length}
                                        </span>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/30">
                                        <CarouselIcon size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold">O seu carrossel nasce aqui</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Insira um tema acima para que nossa IA crie a narrativa perfeitaperfeita para seus slides.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Visual Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1 transition-all rounded-full",
                                        currentSlide === i ? "w-8 bg-primary" : "w-2 bg-secondary"
                                    )}
                                />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Pro Tip */}
                <Card className="p-6 border-primary/10 bg-primary/5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1">Dica para Carrosséis de Sucesso</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            O primeiro slide deve sempre ter uma pergunta ou uma afirmação polêmica (o gancho). O último slide é obrigatório conter uma CTA específica: "O que você acha?", "Comente 'SIM' se concorda".
                        </p>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
