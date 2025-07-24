import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://monitorsefaz.webmaniabr.com/v2/components.json",
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return NextResponse.json(
      setTimeout(() => {
        return data.components;
      }, 1000)
    );
  } catch (error) {
    console.error("Erro ao buscar dados de status:", error);
    return NextResponse.json(
      { error: "Falha ao buscar dados de status" },
      { status: 500 }
    );
  }
}
