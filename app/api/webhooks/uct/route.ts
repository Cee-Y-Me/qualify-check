import type { NextRequest } from "next/server"
import { handleUniversityWebhook } from "@/lib/university-webhook-handler"

export async function POST(request: NextRequest) {
  return handleUniversityWebhook(request, "uct")
}

// Handle UCT-specific webhook events
export async function GET(request: NextRequest) {
  // UCT uses GET requests for webhook verification
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get("hub.challenge")
  const verifyToken = searchParams.get("hub.verify_token")

  const expectedToken = process.env.UCT_VERIFY_TOKEN

  if (verifyToken === expectedToken && challenge) {
    return new Response(challenge, { status: 200 })
  }

  return new Response("Forbidden", { status: 403 })
}
