import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { universityIntegrationService } from "@/lib/university-integration-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string
    const category = formData.get("category") as string
    const applicationId = formData.get("applicationId") as string
    const universityCode = formData.get("universityCode") as string

    if (!file || !userId || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPEG, and PNG files are allowed." },
        { status: 400 },
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), "uploads", userId)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${category}_${timestamp}.${extension}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Create document record
    const document = {
      id: `doc_${timestamp}`,
      userId,
      category,
      filename,
      originalName: file.name,
      filepath,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      verified: false,
      applicationId,
    }

    // If application ID and university code provided, upload to university system
    if (applicationId && universityCode) {
      try {
        const uploadResult = await universityIntegrationService.uploadDocument(
          universityCode,
          applicationId,
          file,
          category,
        )

        if (uploadResult.success) {
          document.verified = true(
            // Store university document ID for reference
            document as any,
          ).universityDocumentId = uploadResult.documentId
        }
      } catch (error) {
        console.error("University document upload error:", error)
        // Continue with local storage even if university upload fails
      }
    }

    // Store document record (in production, save to database)
    // await db.documents.create({ data: document })

    return NextResponse.json({
      success: true,
      document,
      message: "Document uploaded successfully",
    })
  } catch (error) {
    console.error("Document upload error:", error)
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const category = searchParams.get("category")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  // In production, fetch from database
  // const documents = await db.documents.findMany({
  //   where: { userId, ...(category && { category }) }
  // })

  // Mock response for now
  const mockDocuments = [
    {
      id: "doc_1",
      userId,
      category: "id_document",
      filename: "id_document_123456.pdf",
      originalName: "ID_Document.pdf",
      fileSize: 1024000,
      mimeType: "application/pdf",
      uploadedAt: "2024-01-15T10:00:00Z",
      verified: true,
    },
    {
      id: "doc_2",
      userId,
      category: "matric_certificate",
      filename: "matric_certificate_123457.pdf",
      originalName: "Matric_Certificate.pdf",
      fileSize: 2048000,
      mimeType: "application/pdf",
      uploadedAt: "2024-01-15T10:30:00Z",
      verified: true,
    },
  ]

  const filteredDocuments = category ? mockDocuments.filter((doc) => doc.category === category) : mockDocuments

  return NextResponse.json({
    success: true,
    documents: filteredDocuments,
  })
}
