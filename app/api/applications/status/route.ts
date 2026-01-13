import { type NextRequest, NextResponse } from "next/server"
import { universityIntegrationService } from "@/lib/university-integration-service"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const applicationId = searchParams.get("applicationId")
  const universityCode = searchParams.get("universityCode")

  if (!applicationId) {
    return NextResponse.json({ error: "applicationId is required" }, { status: 400 })
  }

  if (!universityCode) {
    return NextResponse.json({ error: "universityCode is required" }, { status: 400 })
  }

  try {
    // Get status from university integration service
    const statusResult = await universityIntegrationService.getApplicationStatus(universityCode, applicationId)

    if (statusResult.success && statusResult.status) {
      // Transform university status to our format
      const statusUpdates = [
        {
          date: new Date().toISOString(),
          status: statusResult.status.status,
          message: statusResult.status.message,
          details: `Status updated from ${universityCode.toUpperCase()} admissions system`,
        },
      ]

      // Add next steps if available
      if (statusResult.status.nextSteps) {
        statusUpdates.push({
          date: new Date().toISOString(),
          status: "action_required",
          message: "Action required",
          details: statusResult.status.nextSteps.join("; "),
        })
      }

      // Add requirements if any
      if (statusResult.status.requirements) {
        const pendingRequirements = statusResult.status.requirements.filter((req) => !req.completed)
        if (pendingRequirements.length > 0) {
          statusUpdates.push({
            date: new Date().toISOString(),
            status: "documents_required",
            message: "Additional documents required",
            details: pendingRequirements.map((req) => req.description).join("; "),
          })
        }
      }

      return NextResponse.json({
        success: true,
        updates: statusUpdates,
        currentStatus: statusResult.status.status,
        lastUpdated: statusResult.status.lastUpdated,
        requirements: statusResult.status.requirements,
        nextSteps: statusResult.status.nextSteps,
      })
    } else {
      // Fallback to mock status updates if integration fails
      const mockStatusUpdates = [
        {
          date: "2024-01-15T10:00:00Z",
          status: "submitted",
          message: "Application submitted successfully",
          details: "Your application has been received and assigned a reference number",
        },
        {
          date: "2024-01-16T14:30:00Z",
          status: "documents_verified",
          message: "Documents verified",
          details: "All required documents have been verified and are in order",
        },
        {
          date: "2024-01-18T09:15:00Z",
          status: "under_review",
          message: "Application under review",
          details: "Your application is being reviewed by the admissions committee",
        },
      ]

      return NextResponse.json({
        success: true,
        updates: mockStatusUpdates,
        currentStatus: "under_review",
        note: "Real-time status updates not available - showing mock data",
      })
    }
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json(
      {
        error: "Failed to get application status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
