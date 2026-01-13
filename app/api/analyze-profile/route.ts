import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration - in production, this would come from MongoDB
const universities = [
  {
    name: "University of Cape Town",
    location: "Cape Town, Western Cape",
    type: "Public Research University",
    ranking: 1,
    website: "https://www.uct.ac.za",
    description: "Leading research university in Africa with excellent programs across all faculties.",
  },
  {
    name: "University of the Witwatersrand",
    location: "Johannesburg, Gauteng",
    type: "Public Research University",
    ranking: 2,
    website: "https://www.wits.ac.za",
    description: "Premier university known for engineering, medicine, and business programs.",
  },
  {
    name: "Stellenbosch University",
    location: "Stellenbosch, Western Cape",
    type: "Public Research University",
    ranking: 3,
    website: "https://www.sun.ac.za",
    description: "Renowned for agriculture, engineering, and wine studies programs.",
  },
  {
    name: "University of Pretoria",
    location: "Pretoria, Gauteng",
    type: "Public Research University",
    ranking: 4,
    website: "https://www.up.ac.za",
    description: "Comprehensive university with strong veterinary and engineering faculties.",
  },
]

const courses = [
  {
    name: "Bachelor of Engineering (Mechanical)",
    university: "University of the Witwatersrand",
    faculty: "Faculty of Engineering",
    duration: "4 years",
    requirements: ["Mathematics: 70%+", "Physical Sciences: 70%+", "English: 60%+"],
    fees: "R65,000 - R85,000 per year",
    description: "Comprehensive mechanical engineering program with strong industry connections.",
    careerProspects: ["Mechanical Engineer", "Design Engineer", "Project Manager", "Consultant"],
  },
  {
    name: "Bachelor of Commerce (Accounting)",
    university: "University of Cape Town",
    faculty: "Faculty of Commerce",
    duration: "3 years",
    requirements: ["Mathematics: 65%+", "English: 60%+", "Accounting: 60%+"],
    fees: "R55,000 - R70,000 per year",
    description: "Leading commerce program preparing students for professional accounting careers.",
    careerProspects: ["Chartered Accountant", "Financial Analyst", "Auditor", "Tax Consultant"],
  },
  {
    name: "Bachelor of Medicine and Surgery (MBChB)",
    university: "University of Cape Town",
    faculty: "Faculty of Health Sciences",
    duration: "6 years",
    requirements: ["Mathematics: 75%+", "Physical Sciences: 75%+", "Life Sciences: 75%+", "English: 70%+"],
    fees: "R85,000 - R120,000 per year",
    description: "Prestigious medical program with excellent clinical training facilities.",
    careerProspects: ["Medical Doctor", "Specialist Physician", "Surgeon", "Medical Researcher"],
  },
  {
    name: "Bachelor of Science (Computer Science)",
    university: "University of the Witwatersrand",
    faculty: "Faculty of Science",
    duration: "3 years",
    requirements: ["Mathematics: 70%+", "Physical Sciences: 65%+", "English: 60%+"],
    fees: "R60,000 - R75,000 per year",
    description: "Cutting-edge computer science program with focus on software development and AI.",
    careerProspects: ["Software Developer", "Data Scientist", "Systems Analyst", "IT Consultant"],
  },
]

function calculateMatchScore(qualifications: any[], questionnaire: any): number {
  let score = 0
  const totalPossible = 100

  // Calculate based on marks
  const mathMark = qualifications.find((q) => q.subject.includes("Mathematics"))?.mark || 0
  const englishMark = qualifications.find((q) => q.subject.includes("English"))?.mark || 0
  const scienceMark = qualifications.find((q) => q.subject.includes("Sciences"))?.mark || 0

  // Basic scoring algorithm
  score += Math.min(mathMark * 0.3, 30)
  score += Math.min(englishMark * 0.2, 20)
  score += Math.min(scienceMark * 0.2, 20)

  // Add points for career alignment
  if (questionnaire.career_field) {
    score += 15
  }

  // Add points for complete profile
  if (questionnaire.name && questionnaire.email) {
    score += 15
  }

  return Math.round(Math.min(score, 100))
}

function getRecommendedCourses(qualifications: any[], questionnaire: any): any[] {
  const mathMark = Number.parseInt(qualifications.find((q) => q.subject.includes("Mathematics"))?.mark || "0")
  const englishMark = Number.parseInt(qualifications.find((q) => q.subject.includes("English"))?.mark || "0")
  const scienceMark = Number.parseInt(qualifications.find((q) => q.subject.includes("Physical Sciences"))?.mark || "0")
  const lifeScienceMark = Number.parseInt(qualifications.find((q) => q.subject.includes("Life Sciences"))?.mark || "0")

  const eligibleCourses = courses.filter((course) => {
    // Simple eligibility check
    if (course.name.includes("Engineering") && mathMark >= 70 && scienceMark >= 70) return true
    if (course.name.includes("Commerce") && mathMark >= 65) return true
    if (course.name.includes("Medicine") && mathMark >= 75 && scienceMark >= 75 && lifeScienceMark >= 75) return true
    if (course.name.includes("Computer Science") && mathMark >= 70) return true
    return false
  })

  // Calculate match scores for eligible courses
  return eligibleCourses
    .map((course) => ({
      ...course,
      matchScore: Math.min(85 + Math.random() * 15, 100), // Mock scoring
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}

function generateInsights(qualifications: any[], questionnaire: any): string[] {
  const insights = []
  const mathMark = Number.parseInt(qualifications.find((q) => q.subject.includes("Mathematics"))?.mark || "0")
  const englishMark = Number.parseInt(qualifications.find((q) => q.subject.includes("English"))?.mark || "0")

  if (mathMark >= 80) {
    insights.push(
      "Your excellent mathematics performance opens doors to engineering, science, and technology programs at top universities.",
    )
  }

  if (englishMark >= 70) {
    insights.push(
      "Your strong English skills will serve you well in any field and meet university language requirements.",
    )
  }

  if (questionnaire.career_field === "Engineering & Technology") {
    insights.push(
      "Your interest in engineering aligns well with South Africa's growing technology sector and infrastructure development needs.",
    )
  }

  if (questionnaire.financial_aid === "Yes") {
    insights.push(
      "Consider applying for NSFAS funding, university bursaries, and private sector scholarships to support your studies.",
    )
  }

  if (questionnaire.location_preference === "Same province") {
    insights.push(
      "Studying in your home province can reduce costs and provide familiar support networks during your transition to university.",
    )
  }

  return insights
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { qualifications, questionnaire } = data

    // Calculate match score
    const matchScore = calculateMatchScore(qualifications, questionnaire)

    // Get recommended courses
    const recommendedCourses = getRecommendedCourses(qualifications, questionnaire)

    // Get alternative courses (mock)
    const alternativeCourses = courses
      .filter((course) => !recommendedCourses.includes(course))
      .slice(0, 4)
      .map((course) => ({
        ...course,
        matchScore: Math.min(60 + Math.random() * 25, 85),
      }))

    // Generate insights
    const insights = generateInsights(qualifications, questionnaire)

    // Check requirements
    const mathMark = Number.parseInt(qualifications.find((q) => q.subject.includes("Mathematics"))?.mark || "0")
    const englishMark = Number.parseInt(qualifications.find((q) => q.subject.includes("English"))?.mark || "0")

    const requirements = {
      met: [
        ...(mathMark >= 50 ? ["Mathematics requirement met"] : []),
        ...(englishMark >= 50 ? ["English requirement met"] : []),
        ...(qualifications.length >= 6 ? ["Minimum subject requirement met"] : []),
        "Grade 12 certificate obtained",
      ],
      missing: [
        ...(mathMark < 70 ? ["Higher mathematics mark recommended for STEM fields"] : []),
        ...(englishMark < 60 ? ["Improve English for better university admission chances"] : []),
      ],
    }

    const results = {
      matchScore,
      topUniversities: universities.slice(0, 4),
      recommendedCourses: recommendedCourses.slice(0, 3),
      alternativeCourses,
      insights,
      requirements,
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error analyzing profile:", error)
    return NextResponse.json({ error: "Failed to analyze profile" }, { status: 500 })
  }
}
