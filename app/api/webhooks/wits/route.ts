import type { NextRequest } from "next/server"
import { handleUniversityWebhook } from "@/lib/university-webhook-handler"

export async function POST(request: NextRequest) {
  return handleUniversityWebhook(request, "wits")
}
