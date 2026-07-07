import { NextRequest, NextResponse } from "next/server";
import { IppoOrchestrator } from "@/orchestrator/IppoOrchestrator";

const orchestrator = new IppoOrchestrator();

/**
 * POST /api/ippo
 *
 * Single entry point for all Ippo interactions.
 *
 * Request body:
 *   { message: string, studentId?: string }
 *
 * Response:
 *   { answer, agent, tools, executionTrace }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, studentId } = body as {
      message?: string;
      studentId?: string;
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const response = await orchestrator.process(message.trim(), studentId);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[/api/ippo] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
