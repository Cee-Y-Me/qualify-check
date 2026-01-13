import { type NextRequest, NextResponse } from "next/server"
import { universityIntegrationService } from "@/lib/university-integration-service"
import type { UniversityApplication } from "@/lib/university-api-client"

interface Application {
  id: string
  userId: string
  universityId: string
  universityName: string
  courseId: string
  courseName: string
  applicationData: any
  documents: string[]
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted"
  submittedDate: string | null
  lastUpdated: string
  applicationFee: number
  paymentStatus: "pending" | "paid" | "failed"
  applicationNumber?: string
  reviewNotes?: string
  integrationStatus?: "direct" | "fallback" | "manual"
}

// Mock database for applications
const applicationsDB: Application[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, universityId, universityName, courseId, courseName, applicationData, documents } = data

    if (!userId || !universityId || !courseId || !applicationData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create university application object
    const universityApplication: UniversityApplication = {
      applicationId: `app_${Date.now()}`,
      studentId: userId,
      courseCode: courseId,
      personalInfo: {
        firstName: applicationData.personalInfo.firstName,
        lastName: applicationData.personalInfo.lastName,
        idNumber: applicationData.personalInfo.idNumber,
        email: applicationData.personalInfo.email,
        phone: applicationData.personalInfo.phone,
        dateOfBirth: applicationData.personalInfo.dateOfBirth || "",
        nationality: applicationData.personalInfo.nationality || "South African",
      },
      academicInfo: {
        matricYear: applicationData.academicInfo.matricYear || "2023",
        schoolName: applicationData.academicInfo.schoolName || "",
        subjects: applicationData.academicInfo.matricResults || [],
        previousQualifications: applicationData.academicInfo.previousStudy
          ? [applicationData.academicInfo.previousStudy]
          : [],
      },
      documents:
        documents?.map((docId: string) => ({
          type: docId,
          filename: `${docId}.pdf`,
          url: `/api/documents/${docId}`,
          verified: false,
        })) || [],
      applicationData: applicationData.applicationInfo || {},
    }

    // Determine application fee based on university
    const applicationFees: { [key: string]: number } = {
      uct_001: 250,
      wits_001: 200,
      sun_001: 180,
      up_001: 200,
    }

    const application: Application = {
      id: universityApplication.applicationId,
      userId,
      universityId,
      universityName,
      courseId,
      courseName,
      applicationData,
      documents: documents || [],
      status: "submitted",
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      applicationFee: applicationFees[universityId] || 200,
      paymentStatus: "pending",
    }

    // Submit to university via integration service
    const submissionResult = await universityIntegrationService.submitApplication(
      universityId.split("_")[0], // Extract university code (e.g., 'uct' from 'uct_001')
      universityApplication,
    )

    if (submissionResult.success) {
      application.applicationNumber = submissionResult.applicationNumber
      application.integrationStatus = submissionResult.fallbackRequired ? "fallback" : "direct"
      application.status = "submitted"
    } else {
      application.integrationStatus = "manual"
      application.status = "draft"
      application.reviewNotes = submissionResult.error || "Submission failed - manual processing required"
    }

    applicationsDB.push(application)

    // If direct integration failed, provide fallback instructions
    let responseMessage = "Application submitted successfully"
    if (submissionResult.fallbackRequired) {
      responseMessage = "Application submitted via fallback method - you may need to complete additional steps"
    }

    return NextResponse.json({
      success: true,
      application,
      message: responseMessage,
      integrationResult: submissionResult,
    })
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const userApplications = applicationsDB.filter((app) => app.userId === userId)

  // Get real-time status updates for each application
  const applicationsWithStatus = await Promise.all(
    userApplications.map(async (app) => {
      if (app.integrationStatus === "direct" && app.applicationNumber) {
        try {
          const statusResult = await universityIntegrationService.getApplicationStatus(
            app.universityId.split("_")[0],
            app.applicationNumber,
          )

          if (statusResult.success && statusResult.status) {
            return {
              ...app,
              status: statusResult.status.status as any,
              reviewNotes: statusResult.status.message,
              lastUpdated: statusResult.status.lastUpdated,
            }
          }
        } catch (error) {
          console.error("Status update error:", error)
        }
      }
      return app
    }),
  )

  return NextResponse.json({
    success: true,
    applications: applicationsWithStatus,
  })
}
