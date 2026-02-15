"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Lightbulb,
    BarChart3,
    Loader2,
    ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type AnalysisResult = {
    score: number;
    classification: string;
    metrics: {
        hook: number;
        authenticity: number;
        structure: number;
        cta: number;
    };
    alerts: string[];
    recommendations: string[];
};

export default function AnalyzePage() {
    const [content, setContent] = React.useState("");
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [result, setResult] = React.useState<AnalysisResult | null>(null);

    const handleAnalyze = async () => {
        if (!content.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error("Erro na análise. Tente novamente.");

            const data = await response.json();
            setResult(data);
            saveToDrafts(content, data.score);
            toast.success("Análise concluída com sucesso!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const saveToDrafts = (text: string, score: number) => {
        const savedPosts = JSON.parse(localStorage.getItem("viral_posts") || "[]");
        const newPost = {
            id: Date.now().toString(),
            title: `Análise: ${text.substring(0, 30)}...`,
            content: text,
            status: "Analisado",
            date: "Agora",
            type: "analysis",
            score: score
        };
        localStorage.setItem("viral_posts", JSON.stringify([newPost, ...savedPosts].slice(0, 10)));
    };

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                        <TrendingUp className="text-primary h-8 w-8" /> Análise de <span className="text-primary italic">Vírus</span>
                    </h1>
                    <p className="text-muted-foreground italic">Descubra o potencial real do seu conteúdo antes de publicar.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Area */}
                    <div className="space-y-4">
                        <Card className="p-1 glass border-primary/5 focus-within:border-primary/20 transition-all shadow-xl">
                            <Textarea
                                placeholder="Cole seu post aqui para analisar..."
                                className="min-h-[400px] border-none focus-visible:ring-0 resize-none p-6 text-base leading-relaxed"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className="flex items-center justify-between p-4 border-t bg-secondary/20">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    {wordCount} palavras | {content.length} caracteres
                                </span>
                                <Button
                                    className="linkedin-gradient border-none font-bold rounded-full px-8 shadow-lg shadow-primary/20 h-10"
                                    onClick={handleAnalyze}
                                    disabled={!content.trim() || isAnalyzing}
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin mr-2" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                                    Analisar agora
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Results Area */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Score Card */}
                                    <Card className="p-8 text-center glass border-primary/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <TrendingUp size={120} />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Score Viral</h3>
                                        <div className="relative inline-flex items-center justify-center">
                                            <svg className="w-32 h-32">
                                                <circle
                                                    className="text-secondary"
                                                    strokeWidth="8"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="58"
                                                    cx="64"
                                                    cy="64"
                                                />
                                                <motion.circle
                                                    initial={{ strokeDasharray: "0 361" }}
                                                    animate={{ strokeDasharray: `${(result.score * 3.61)}, 361` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="text-primary"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="58"
                                                    cx="64"
                                                    cy="64"
                                                />
                                            </svg>
                                            <span className="absolute text-4xl font-black">{result.score}</span>
                                        </div>
                                        <div className="mt-4">
                                            <Badge className={cn(
                                                "rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest",
                                                result.score >= 80 ? "bg-green-500 hover:bg-green-600" :
                                                    result.score >= 60 ? "bg-blue-500 hover:bg-blue-600" :
                                                        "bg-orange-500 hover:bg-orange-600"
                                            )}>
                                                {result.classification}
                                            </Badge>
                                        </div>
                                    </Card>

                                    {/* Detailed Metrics */}
                                    <Card className="p-6 glass border-primary/5 space-y-4">
                                        <h3 className="font-bold text-sm flex items-center gap-2">
                                            <TrendingUp size={16} className="text-primary" /> Métricas de Desempenho
                                        </h3>
                                        {[
                                            { label: "Força do Gancho", value: result.metrics.hook },
                                            { label: "Autenticidade", value: result.metrics.authenticity },
                                            { label: "Estrutura e Leitura", value: result.metrics.structure },
                                            { label: "Chamada para Ação", value: result.metrics.cta },
                                        ].map((m) => (
                                            <div key={m.label} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                                    <span>{m.label}</span>
                                                    <span className="text-primary">{m.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${m.value}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Card>

                                    {/* Alerts & Recs */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <Card className="p-6 border-orange-500/20 bg-orange-500/5">
                                            <h4 className="font-bold text-sm text-orange-600 flex items-center gap-2 mb-3">
                                                <AlertCircle size={16} /> Pontos de Atenção
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.alerts.map((a, i) => (
                                                    <li key={i} className="text-xs flex gap-2 leading-relaxed">
                                                        <ChevronRight size={12} className="shrink-0 mt-0.5 text-orange-400" />
                                                        {a}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>

                                        <Card className="p-6 border-green-500/20 bg-green-500/5">
                                            <h4 className="font-bold text-sm text-green-600 flex items-center gap-2 mb-3">
                                                <Lightbulb size={16} /> Recomendações de Ouro
                                            </h4>
                                            <ul className="space-y-2">
                                                {result.recommendations.map((r, i) => (
                                                    <li key={i} className="text-xs flex gap-2 leading-relaxed">
                                                        <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-green-400" />
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Card>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                                    <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground opacity-50">
                                        <BarChart3 size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Aguardando seu texto</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                                            Cole seu conteúdo ao lado e clique em analisar para receber o feedback da nossa inteligência especializada.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
