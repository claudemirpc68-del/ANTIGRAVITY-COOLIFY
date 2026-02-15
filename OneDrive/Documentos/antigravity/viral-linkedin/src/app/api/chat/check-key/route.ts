import { NextResponse } from "next/server";

export async function GET() {
    const key = process.env.OPENAI_API_KEY;
    const isPlaceholder = !key || key === "sua_chave_openai_aqui" || key.includes("placeholder");

    return NextResponse.json({ isPlaceholder });
}
