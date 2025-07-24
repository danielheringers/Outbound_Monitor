import { NextResponse } from "next/server";
import { getAuthCredentials } from "@/services/authService";

export async function GET() {
  try {
    const { token, xApiKey } = getAuthCredentials();

    const response = await fetch(
      "https://api.orbitspot.com/documentservice/api/metrics",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": xApiKey,
          token: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha na requisição à API");
    }
    const data = await response.json();

    return NextResponse.json(
      setTimeout(() => {
        return data;
      }, 1000)
    );
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json(
      { error: "Falha ao buscar métricas" },
      { status: 500 }
    );
  }
}
