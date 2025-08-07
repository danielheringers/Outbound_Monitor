import { login } from "@/services/authService";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const username = process.env.NEXT_PUBLIC_EMAIL_LOGIN!;
    const password = process.env.NEXT_PUBLIC_PASSWORD_LOGIN!;
    try {
      const authResponse = await login(username, password);
      return NextResponse.json({
        success: true,
        user: authResponse.data,
        token: authResponse.token,
      });
    } catch (loginError) {
      throw new Error(
        `Erro na autenticação: ${
          loginError instanceof Error ? loginError.message : "Erro desconhecido"
        }`
      );
    }
  } catch (error) {
    console.error("Erro detalhado no login:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: {
          timestamp: new Date().toISOString(),
          type: error instanceof Error ? error.name : "UnknownError",
          stack:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.stack
                : null
              : undefined,
        },
      },
      { status: 401 }
    );
  }
}
