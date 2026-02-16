"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success("Bem-vindo de volta! Redirecionando...");
            router.push("/dashboard");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao entrar. Verifique suas credenciais.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] -z-10" />

            <Link href="/" className="absolute top-8 left-8">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft size={16} /> Voltar
                </Button>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                        <Sparkles className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Login no <span className="text-primary tracking-tighter italic">Viral</span></h1>
                    <p className="text-muted-foreground mt-2">Pronto para sua próxima postagem de sucesso?</p>
                </div>

                <Card className="p-8 glass border-primary/5 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold ml-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="pl-10 h-11"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold">Senha</label>
                                <Link href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 linkedin-gradient border-none font-bold text-lg mt-4 shadow-xl shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Entrar na Plataforma"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground">Não tem uma conta? </span>
                        <Link href="/signup" className="text-primary font-bold hover:underline">Crie agora gratuitamente</Link>
                    </div>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                </p>
            </motion.div>
        </div>
    );
}
