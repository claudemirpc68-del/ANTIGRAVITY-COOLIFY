"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                }
            });

            if (error) throw error;

            toast.success("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message || "Erro ao cadastrar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] -z-10" />

            <Link href="/" className="absolute top-8 left-8">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft size={16} /> Voltar
                </Button>
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                        <Sparkles className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Crie sua conta <span className="text-primary tracking-tighter italic">Viral</span></h1>
                    <p className="text-muted-foreground mt-2">Sua jornada para o sucesso no LinkedIn começa aqui.</p>
                </div>

                <Card className="p-8 glass border-primary/5 shadow-2xl">
                    <form onSubmit={handleSignup} className="space-y-4">
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
                            <label className="text-sm font-semibold ml-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    className="pl-10 h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-11 linkedin-gradient border-none font-bold text-lg mt-4 shadow-xl shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Criar minha Conta Pro"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground">Já possui uma conta? </span>
                        <Link href="/login" className="text-primary font-bold hover:underline">Fazer login</Link>
                    </div>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8 px-4 leading-relaxed">
                    Ao se cadastrar, você entende que este é um assistente de produtividade e você é responsável pelo conteúdo publicado.
                </p>
            </motion.div>
        </div>
    );
}
