"use client";

import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Image as ImageIcon,
    Sparkles,
    Download,
    Trash2,
    Plus,
    Loader2,
    Copy
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const imageStyles = [
    { id: "modern", label: "Moderno", description: "Design limpo e profissional" },
    { id: "bold", label: "Impactante", description: "Cores vibrantes e chamativas" },
    { id: "minimal", label: "Minimalista", description: "Simples e elegante" },
    { id: "creative", label: "Criativo", description: "Artístico e único" },
    { id: "corporate", label: "Corporativo", description: "Sério e confiável" }
];

type GeneratedImage = {
    id: string;
    prompt: string;
    style: string;
    url: string;
    timestamp: number;
};

export default function GalleryPage() {
    const [prompt, setPrompt] = React.useState("");
    const [selectedStyle, setSelectedStyle] = React.useState("modern");
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [images, setImages] = React.useState<GeneratedImage[]>([]);

    // Carregar imagens salvas
    React.useEffect(() => {
        try {
            const saved = localStorage.getItem("viral_images");
            if (saved) setImages(JSON.parse(saved));
        } catch (e) {
            console.error("Erro ao carregar imagens:", e);
        }
    }, []);

    // Salvar imagens
    const saveImages = (newImages: GeneratedImage[]) => {
        setImages(newImages);
        localStorage.setItem("viral_images", JSON.stringify(newImages));
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Descreva a imagem que você quer gerar");
            return;
        }

        setIsGenerating(true);
        try {
            // Simulação de geração de imagem (substituir por API real)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newImage: GeneratedImage = {
                id: Date.now().toString(),
                prompt,
                style: selectedStyle,
                url: `https://placehold.co/1200x630/0077b5/white?text=${encodeURIComponent(prompt.substring(0, 30))}`,
                timestamp: Date.now()
            };

            saveImages([newImage, ...images]);
            toast.success("Imagem gerada com sucesso!");
            setPrompt("");
        } catch (error) {
            toast.error("Erro ao gerar imagem");
        } finally {
            setIsGenerating(false);
        }
    };

    const deleteImage = (id: string) => {
        saveImages(images.filter(img => img.id !== id));
        toast.success("Imagem removida");
    };

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                            <ImageIcon className="text-primary h-8 w-8" /> Galeria <span className="text-primary italic">de Imagens</span>
                        </h1>
                        <p className="text-muted-foreground italic">Crie imagens personalizadas para seus posts com IA.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Generation Panel */}
                    <Card className="lg:col-span-1 p-6 glass border-primary/5 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="text-primary w-5 h-5" /> Gerar Nova Imagem
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold mb-2 block">Descreva a imagem</label>
                                    <Input
                                        placeholder="Ex: Um profissional focado trabalhando..."
                                        className="h-12"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        disabled={isGenerating}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold mb-2 block">Estilo Visual</label>
                                    <div className="space-y-2">
                                        {imageStyles.map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => setSelectedStyle(style.id)}
                                                className={cn(
                                                    "w-full p-3 text-left rounded-lg border transition-all",
                                                    selectedStyle === style.id
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-primary/10 hover:border-primary/30"
                                                )}
                                            >
                                                <p className="font-bold text-sm">{style.label}</p>
                                                <p className="text-xs opacity-60">{style.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                    className="w-full linkedin-gradient border-none h-12 font-bold"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Gerar Imagem
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Card className="p-4 bg-blue-500/5 border-blue-500/20">
                            <p className="text-xs text-muted-foreground">
                                <strong className="text-primary">Dica:</strong> Seja específico na descrição.
                                Mencione cores, emoções, contexto e elementos visuais desejados para melhores resultados.
                            </p>
                        </Card>
                    </Card>

                    {/* Gallery Grid */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Minhas Imagens</h2>
                            <Badge variant="outline" className="text-[10px] uppercase font-black">
                                {images.length} Imagens
                            </Badge>
                        </div>

                        <ScrollArea className="h-[calc(100vh-12rem)]">
                            {images.length === 0 ? (
                                <Card className="p-12 glass border-primary/5 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground opacity-30 mb-4">
                                        <ImageIcon size={32} />
                                    </div>
                                    <h3 className="font-bold mb-2">Nenhuma imagem ainda</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Gere sua primeira imagem com IA para começar a criar posts visuais incríveis.
                                    </p>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                    {images.map((image) => (
                                        <Card key={image.id} className="overflow-hidden glass border-primary/5 group hover:border-primary/20 transition-all">
                                            <div className="relative aspect-video bg-secondary">
                                                <img
                                                    src={image.url}
                                                    alt={image.prompt}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                    <Button size="icon" variant="secondary" className="h-10 w-10">
                                                        <Download size={16} />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-10 w-10"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(image.url);
                                                            toast.success("Link copiado!");
                                                        }}
                                                    >
                                                        <Copy size={16} />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="h-10 w-10"
                                                        onClick={() => deleteImage(image.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-sm font-medium line-clamp-2 mb-2">{image.prompt}</p>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {imageStyles.find(s => s.id === image.style)?.label}
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(image.timestamp).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
