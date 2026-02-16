import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { topic } = await req.json();
        console.log("Recebendo requisição no Carrossel OpenAI...");

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sua_chave_openai_aqui") {
            throw new Error("Configuração da Chave de API da OpenAI ausente.");
        }

        const prompt = `Crie um roteiro para um carrossel do LinkedIn sobre o tema: "${topic}".
O carrossel deve ter entre 5 a 7 slides.
Retorne um JSON estritamente no seguinte formato:
{
  "slides": [
    { "title": "Título do slide", "content": "Conteúdo curto e impactante para o slide" }
  ]
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Você é um especialista em design de conteúdo para LinkedIn que responde apenas em JSON." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
        });

        const result = response.choices[0].message.content;

        return new Response(result, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("ERRO NA API DE CARROSSEL (OpenAI):", error);
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
