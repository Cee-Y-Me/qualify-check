import { type NextRequest, NextResponse } from "next/server"

// Mock PDF text extraction - in production, you'd use a library like pdf-parse
async function extractTextFromPDF(file: File): Promise<string> {
  // This is a mock implementation
  // In production, you would use libraries like:
  // - pdf-parse for server-side PDF parsing
  // - PDF.js for client-side parsing
  // - Or a service like Google Cloud Document AI

  // For demonstration, return mock extracted text that looks like a typical SA results document
  return `
    NATIONAL SENIOR CERTIFICATE RESULTS
    STUDENT: JOHN DOE
    EXAMINATION NUMBER: 12345678901
    
    SUBJECT                           LEVEL    MARK    SYMBOL
    ENGLISH HOME LANGUAGE            HG       78      B
    AFRIKAANS FIRST ADDITIONAL       SG       65      C
    MATHEMATICS                      HG       82      A
    PHYSICAL SCIENCES               HG       75      B
    LIFE SCIENCES                   HG       71      B
    GEOGRAPHY                       HG       68      C
    LIFE ORIENTATION                SG       72      B
    BUSINESS STUDIES                HG       74      B
    
    TOTAL POINTS: 585
    AVERAGE: 73.1%
  `
}

function parseSubjectsAndMarks(text: string) {
  const subjects = []
  const lines = text.split("\n")

  // Common subject name mappings
  const subjectMappings: { [key: string]: string } = {
    "ENGLISH HOME LANGUAGE": "English Home Language",
    "ENGLISH FIRST ADDITIONAL": "English First Additional Language",
    "AFRIKAANS HOME LANGUAGE": "Afrikaans Home Language",
    "AFRIKAANS FIRST ADDITIONAL": "Afrikaans First Additional Language",
    MATHEMATICS: "Mathematics",
    "MATHEMATICAL LITERACY": "Mathematical Literacy",
    "PHYSICAL SCIENCES": "Physical Sciences",
    "LIFE SCIENCES": "Life Sciences",
    GEOGRAPHY: "Geography",
    HISTORY: "History",
    "BUSINESS STUDIES": "Business Studies",
    ECONOMICS: "Economics",
    ACCOUNTING: "Accounting",
    "LIFE ORIENTATION": "Life Orientation",
    "INFORMATION TECHNOLOGY": "Information Technology",
    "COMPUTER APPLICATIONS TECHNOLOGY": "Computer Applications Technology",
    "ENGINEERING GRAPHICS AND DESIGN": "Engineering Graphics and Design",
    "VISUAL ARTS": "Visual Arts",
    MUSIC: "Music",
    "DRAMATIC ARTS": "Dramatic Arts",
  }

  for (const line of lines) {
    // Look for lines that contain subject information
    // Pattern: SUBJECT NAME + LEVEL + MARK + SYMBOL
    const match = line.match(/^([A-Z\s]+?)\s+(HG|SG)\s+(\d{1,3})\s+[A-F]?\s*$/i)

    if (match) {
      const [, subjectName, level, mark] = match
      const cleanSubjectName = subjectName.trim()
      const standardSubjectName = subjectMappings[cleanSubjectName] || cleanSubjectName

      // Skip Life Orientation as it doesn't count for university admission
      if (!cleanSubjectName.includes("LIFE ORIENTATION")) {
        subjects.push({
          subject: standardSubjectName,
          mark: mark,
          level: level === "HG" ? "Higher Grade" : "Standard Grade",
        })
      }
    }
  }

  return subjects
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file)

    // Parse subjects and marks
    const subjects = parseSubjectsAndMarks(extractedText)

    if (subjects.length === 0) {
      return NextResponse.json(
        {
          error:
            "Could not extract subjects and marks from the PDF. Please ensure it's a valid Grade 12 results document.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      subjects,
      extractedText: extractedText.substring(0, 500) + "...", // For debugging
    })
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to process PDF. Please try again or enter your marks manually.",
      },
      { status: 500 },
    )
  }
}
