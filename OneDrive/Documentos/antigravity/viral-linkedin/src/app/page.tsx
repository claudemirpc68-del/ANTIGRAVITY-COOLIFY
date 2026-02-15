"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Layout,
  Target,
  Zap,
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header Fixo */}
      <header className="fixed top-0 w-full z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">LinkedIn<span className="text-primary font-black uppercase italic"> Viral</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Button className="rounded-full linkedin-gradient border-none shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard">Acessar Plataforma</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] bg-blue-400 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6 py-1.5 px-4 bg-background/50 backdrop-blur-sm border-primary/20 text-primary rounded-full">
                ✨ Nova geração de inteligência para LinkedIn
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] text-foreground"
            >
              Domine o <span className="text-primary bg-clip-text text-transparent linkedin-gradient">LinkedIn</span> com o Poder da <span className="italic">IA</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Crie posts virais, carrosséis magnéticos e analise seu engajamento em segundos. A ferramenta definitiva para personal branding e networking.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/30 linkedin-gradient border-none group" asChild>
                <Link href="/dashboard">
                  Criar meu primeiro post viral
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full glass border-primary/10" asChild>
                <Link href="/dashboard">Ver demonstração</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex items-center justify-center gap-8 grayscale opacity-50 dark:invert"
            >
              <span className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Confiado por profissionais em:</span>
              <div className="flex gap-6 font-black text-xl italic tracking-tighter">
                <span>Google</span>
                <span>Netflix</span>
                <span>Amazon</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Tudo o que você precisa para <span className="text-primary underline decoration-primary/20 underline-offset-8">viralizar</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Funcionalidades desenhadas para impulsionar sua autoridade e atrair oportunidades reais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Chat IA Especializado",
                description: "Gere posts completos com base em contextos reais, mantendo sua voz única e autêntica."
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Análise Viral",
                description: "Receba um score e sugestões imediatas para maximizar o alcance de cada palavra escrita."
              },
              {
                icon: <Layout className="w-6 h-6" />,
                title: "Gerador de Carrossel",
                description: "Transforme ideias complexas em slides visuais atraentes que retêm a atenção do feed."
              },
              {
                icon: <ImageIcon className="w-6 h-6" />,
                title: "Imagens com IA",
                description: "Crie artes visuais personalizadas em 5 estilos diferentes para acompanhar seus textos."
              },
              {
                icon: <CalendarIcon className="w-6 h-6" />,
                title: "Calendário Editorial",
                description: "Planeje e agende sua consistência. Saiba exatamente o que postar e quando."
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Templates Estruturados",
                description: "Acesso a ganchos e estruturas testadas que comprovadamente geram engajamento."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="p-8 h-full border-primary/5 hover:border-primary/20 transition-all duration-300 glass hover:shadow-2xl hover:shadow-primary/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto p-12 rounded-[2rem] linkedin-gradient text-white shadow-2xl shadow-primary/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
              <Sparkles className="w-64 h-64" />
            </div>

            <h2 className="text-4xl font-black mb-6 tracking-tight">Pronto para transformar sua presença digital?</h2>
            <p className="text-blue-50 mb-10 text-lg opacity-90">Junte-se a centenas de profissionais que já usam IA para criar impacto real no maior feed corporativo do mundo.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-lg font-bold" asChild>
                <Link href="/dashboard">Começar agora gratuitamente</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-secondary/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight">LinkedIn Viral</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 LinkedIn Viral. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary">Termos</Link>
            <Link href="#" className="hover:text-primary">Privacidade</Link>
            <Link href="#" className="hover:text-primary">Suporte</Link>
          </div>
        </div>
      </footer>

      {/* Floating Status Icon (Micro-animation) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full linkedin-gradient flex items-center justify-center shadow-xl shadow-primary/40 cursor-pointer hover:scale-125 transition-transform"
      >
        <Zap className="text-white w-6 h-6 fill-current" />
      </motion.div>
    </div>
  );
}
