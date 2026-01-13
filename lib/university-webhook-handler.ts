import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

interface WebhookPayload {
  universityCode: string
  applicationId: string
  status: string
  message: string
  timestamp: string
  signature: string
  data?: any
}

interface ApplicationUpdate {
  applicationId: string
  status: string
  message: string
  timestamp: string
  universityCode: string
  additionalData?: any
}

// Webhook signature verification
export class WebhookVerifier {
  static verifyUCTSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")

    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))
  }

  static verifyWitsSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac("sha1", secret).update(payload).digest("base64")

    return signature === expectedSignature
  }

  static verifyStellenboschSignature(payload: string, signature: string, secret: string): boolean {
    // Stellenbosch uses JWT-based signatures
    try {
      const jwt = require("jsonwebtoken")
      jwt.verify(signature, secret)
      return true
    } catch (error) {
      return false
    }
  }
}

// Webhook payload processors
export class WebhookProcessor {
  static async processUCTWebhook(payload: any): Promise<ApplicationUpdate> {
    return {
      applicationId: payload.applicationNumber,
      status: this.mapUCTStatus(payload.status),
      message: payload.statusMessage,
      timestamp: payload.timestamp,
      universityCode: "uct",
      additionalData: {
        nextSteps: payload.nextSteps,
        requirements: payload.outstandingRequirements,
        reviewNotes: payload.reviewerComments,
      },
    }
  }

  static async processWitsWebhook(payload: any): Promise<ApplicationUpdate> {
    return {
      applicationId: payload.applicationReference,
      status: this.mapWitsStatus(payload.currentStatus),
      message: payload.statusDescription,
      timestamp: payload.lastStatusUpdate,
      universityCode: "wits",
      additionalData: {
        actionItems: payload.actionItems,
        pendingRequirements: payload.pendingRequirements,
        admissionOfficer: payload.assignedOfficer,
      },
    }
  }

  static async processStellenboschWebhook(payload: any): Promise<ApplicationUpdate> {
    return {
      applicationId: payload.aansoekNommer,
      status: this.mapStellenboschStatus(payload.status),
      message: payload.beskrywing,
      timestamp: payload.datumGewysig,
      universityCode: "stellenbosch",
      additionalData: {
        fakulteit: payload.fakulteit,
        kursusKode: payload.kursusKode,
        vereistes: payload.uitstaandeVereistes,
      },
    }
  }

  private static mapUCTStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      RECEIVED: "received",
      IN_REVIEW: "under_review",
      DOCS_REQUIRED: "documents_required",
      ACCEPTED: "accepted",
      REJECTED: "rejected",
      WAITLISTED: "waitlisted",
    }
    return statusMap[status] || "received"
  }

  private static mapWitsStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      SUBMITTED: "received",
      UNDER_REVIEW: "under_review",
      PENDING_DOCUMENTS: "documents_required",
      OFFER_MADE: "accepted",
      DECLINED: "rejected",
      WAITING_LIST: "waitlisted",
    }
    return statusMap[status] || "received"
  }

  private static mapStellenboschStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      ONTVANG: "received",
      ONDER_HERSIENING: "under_review",
      DOKUMENTE_BENODIG: "documents_required",
      AANVAAR: "accepted",
      VERWERP: "rejected",
      WAGLYS: "waitlisted",
    }
    return statusMap[status] || "received"
  }
}

// Main webhook handler
export async function handleUniversityWebhook(request: NextRequest, universityCode: string): Promise<NextResponse> {
  try {
    const body = await request.text()
    const payload = JSON.parse(body)

    // Get signature from headers
    const signature =
      request.headers.get("x-signature") ||
      request.headers.get("x-hub-signature") ||
      request.headers.get("authorization")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // Verify signature based on university
    let isValid = false
    const secret = process.env[`${universityCode.toUpperCase()}_WEBHOOK_SECRET`]

    if (!secret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    switch (universityCode.toLowerCase()) {
      case "uct":
        isValid = WebhookVerifier.verifyUCTSignature(body, signature, secret)
        break
      case "wits":
        isValid = WebhookVerifier.verifyWitsSignature(body, signature, secret)
        break
      case "stellenbosch":
        isValid = WebhookVerifier.verifyStellenboschSignature(body, signature, secret)
        break
      default:
        return NextResponse.json({ error: "Unsupported university" }, { status: 400 })
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Process the webhook payload
    let update: ApplicationUpdate

    switch (universityCode.toLowerCase()) {
      case "uct":
        update = await WebhookProcessor.processUCTWebhook(payload)
        break
      case "wits":
        update = await WebhookProcessor.processWitsWebhook(payload)
        break
      case "stellenbosch":
        update = await WebhookProcessor.processStellenboschWebhook(payload)
        break
      default:
        throw new Error("Unsupported university")
    }

    // Update application status in database
    await updateApplicationStatus(update)

    // Send notifications to user
    await sendStatusNotification(update)

    return NextResponse.json({ success: true, message: "Webhook processed successfully" })
  } catch (error) {
    console.error(`${universityCode} webhook error:`, error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Database update function
async function updateApplicationStatus(update: ApplicationUpdate): Promise<void> {
  // In a real implementation, this would update your database
  // For now, we'll simulate the database update

  console.log("Updating application status:", {
    applicationId: update.applicationId,
    status: update.status,
    message: update.message,
    timestamp: update.timestamp,
    university: update.universityCode,
  })

  // Example database update (replace with your actual database logic)
  /*
  await db.applications.update({
    where: { id: update.applicationId },
    data: {
      status: update.status,
      statusMessage: update.message,
      lastUpdated: new Date(update.timestamp),
      additionalData: update.additionalData,
    },
  })
  */
}

// Notification function
async function sendStatusNotification(update: ApplicationUpdate): Promise<void> {
  // Send email notification
  try {
    const response = await fetch("/api/notifications/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "application_status_update",
        applicationId: update.applicationId,
        status: update.status,
        message: update.message,
        universityCode: update.universityCode,
      }),
    })

    if (!response.ok) {
      console.error("Failed to send notification")
    }
  } catch (error) {
    console.error("Notification error:", error)
  }
}
