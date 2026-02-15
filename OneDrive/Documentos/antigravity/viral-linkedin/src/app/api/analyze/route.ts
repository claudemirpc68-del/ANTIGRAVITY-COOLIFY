import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json();
        console.log("Recebendo requisição na Análise OpenAI...");

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sua_chave_openai_aqui") {
            throw new Error("Configuração da Chave de API da OpenAI ausente.");
        }

        const prompt = `Você é um analista experiente em LinkedIn Brasil. 
Analise o post abaixo e retorne um feedback estruturado estritamente em JSON com os seguintes campos:
- score: número de 0 a 100
- classification: uma string (Excelente, Bom, Regular ou Precisa Melhorar)
- metrics: objeto com hook, authenticity, structure, cta (todos números de 0 a 100)
- alerts: array de strings com problemas identificados
- recommendations: array de strings com sugestões de melhoria

POST PARA ANALISAR:
"${content}"`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Você é um assistente que responde apenas em JSON." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
        });

        const result = response.choices[0].message.content;

        return new Response(result, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("ERRO NA API DE ANÁLISE (OpenAI):", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
