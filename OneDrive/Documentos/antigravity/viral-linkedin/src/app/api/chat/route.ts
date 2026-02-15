import OpenAI from "openai";
import { NextRequest } from "next/server";

// export const runtime = "edge";



const SYSTEM_PROMPT = `Você é o "LinkedIn Viral", um especialista em copywriting e personal branding especializado exclusivamente no LinkedIn Brasil.
Seu objetivo é ajudar o usuário a criar posts virais, autênticos e de alto engajamento.

Regras de Ouro:
1. Comece sempre com um Gancho (Hook) poderoso que faça leitor parar o scroll.
2. Use parágrafos curtos e muito espaço em branco para facilitar a leitura.
3. Mantenha um tom profissional, porém humano e autêntico.
4. Sempre termine com uma Call to Action (CTA) clara que gere comentários.
5. Use emojis moderadamente para dar personalidade.
6. Nunca mencione que você é uma IA, aja como um consultor humano experiente.

Se o usuário pedir algo genérico, faça perguntas para extrair histórias reais e dados que tornem o post único.`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        console.log("Iniciando requisição ao Chat OpenAI...");

        if (!apiKey || apiKey === "sua_chave_openai_aqui") {
            console.error("ERRO: OPENAI_API_KEY está ausente ou é um placeholder.");
            throw new Error("Configuração da Chave de API da OpenAI ausente.");
        }

        const openai = new OpenAI({ apiKey });

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Ou "gpt-3.5-turbo" se preferir
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages.map((m: any) => ({
                    role: m.role === "user" ? "user" : "assistant",
                    content: m.content,
                })),
            ],
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    let chunkCount = 0;
                    for await (const chunk of response) {
                        chunkCount++;
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                    console.log(`Stream finalizado. Total de chunks enviados: ${chunkCount}`);
                    controller.close();
                } catch (err) {
                    console.error("Erro durante o streaming da OpenAI:", err);
                    controller.error(err);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("ERRO NA API DE CHAT (OpenAI):", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
