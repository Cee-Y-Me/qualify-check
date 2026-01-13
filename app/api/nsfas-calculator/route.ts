import { type NextRequest, NextResponse } from "next/server"

interface NSFASCalculationData {
  householdIncome: number
  dependents: number
  province: string
  studyMode: string
  disability: boolean
  previouslyFunded: boolean
}

export async function POST(request: NextRequest) {
  try {
    const data: NSFASCalculationData = await request.json()

    // Validate input data
    if (!data.householdIncome || !data.province || !data.studyMode) {
      return NextResponse.json(
        { error: "Missing required fields: householdIncome, province, and studyMode are required" },
        { status: 400 },
      )
    }

    // NSFAS eligibility calculation based on 2024 criteria
    const eligibilityResult = calculateNSFASEligibility(data)
    const fundingEstimate = calculateFundingAmount(data, eligibilityResult.eligible)

    return NextResponse.json({
      eligible: eligibilityResult.eligible,
      eligibilityScore: eligibilityResult.score,
      reasons: eligibilityResult.reasons,
      estimatedFunding: fundingEstimate,
      applicationDeadlines: getApplicationDeadlines(),
      requiredDocuments: getRequiredDocuments(),
      nextSteps: getNextSteps(eligibilityResult.eligible),
      additionalInfo: getAdditionalInfo(data),
    })
  } catch (error) {
    console.error("NSFAS calculation error:", error)
    return NextResponse.json({ error: "Failed to calculate NSFAS eligibility" }, { status: 500 })
  }
}

function calculateNSFASEligibility(data: NSFASCalculationData) {
  let score = 0
  const reasons = []

  // Income threshold check (R350,000 for 2024)
  if (data.householdIncome <= 350000) {
    score += 40
    reasons.push("✓ Household income meets NSFAS threshold (≤R350,000)")
  } else if (data.householdIncome <= 600000) {
    score += 20
    reasons.push("⚠ Household income above NSFAS threshold but may qualify for partial funding")
  } else {
    reasons.push("✗ Household income exceeds NSFAS eligibility threshold")
  }

  // Dependents consideration
  if (data.dependents >= 3) {
    score += 15
    reasons.push("✓ Multiple dependents (3+) increase eligibility")
  } else if (data.dependents >= 1) {
    score += 10
    reasons.push("✓ Dependents considered in assessment")
  }

  // Disability support
  if (data.disability) {
    score += 20
    reasons.push("✓ Disability support available - additional funding possible")
  }

  // Previous funding check
  if (!data.previouslyFunded) {
    score += 25
    reasons.push("✓ First-time applicant - priority consideration")
  } else {
    score += 10
    reasons.push("⚠ Previous NSFAS funding - renewal possible with good academic standing")
  }

  // Province-based considerations
  const ruralProvinces = ["Eastern Cape", "Limpopo", "Northern Cape", "Free State"]
  if (ruralProvinces.includes(data.province)) {
    score += 5
    reasons.push("✓ Rural province - additional support available")
  }

  return {
    eligible: score >= 65,
    score: Math.min(score, 100),
    reasons,
  }
}

function calculateFundingAmount(data: NSFASCalculationData, eligible: boolean) {
  if (!eligible) return { total: 0, breakdown: {}, note: "Not eligible for NSFAS funding" }

  // Base amounts for 2024
  const baseAmounts = {
    tuitionFees: 65000, // Average university fees
    accommodation: 45000, // NSFAS accommodation allowance
    meals: 15000, // Meal allowance
    books: 5000, // Book allowance
    transport: 7500, // Transport allowance
    personalCare: 2900, // Personal care allowance
  }

  // Adjust based on study mode
  let multiplier = 1
  if (data.studyMode === "Distance learning") {
    multiplier = 0.6 // Reduced accommodation and transport
    delete baseAmounts.accommodation
    baseAmounts.transport = 3000
  } else if (data.studyMode === "Part-time") {
    multiplier = 0.7
  }

  // Provincial cost adjustments
  const expensiveProvinces = ["Gauteng", "Western Cape"]
  if (expensiveProvinces.includes(data.province)) {
    multiplier *= 1.15
  }

  // Disability additional support
  if (data.disability) {
    baseAmounts.disabilitySupport = 8000
  }

  const adjustedAmounts = Object.fromEntries(
    Object.entries(baseAmounts).map(([key, value]) => [key, Math.round(value * multiplier)]),
  )

  const total = Object.values(adjustedAmounts).reduce((sum, amount) => sum + amount, 0)

  return {
    total,
    breakdown: adjustedAmounts,
    note: `Estimated funding for ${data.studyMode.toLowerCase()} study in ${data.province}`,
  }
}

function getApplicationDeadlines() {
  const currentYear = new Date().getFullYear()
  return {
    nsfas: `30 November ${currentYear}`,
    universities: `30 September ${currentYear}`,
    bursaries: "Various dates - check individual providers",
    accommodation: `31 October ${currentYear}`,
    appeals: `31 March ${currentYear + 1}`,
  }
}

function getRequiredDocuments() {
  return [
    "South African ID document (certified copy)",
    "Matric certificate or latest results (certified copy)",
    "Proof of household income (salary slips, UIF certificate, etc.)",
    "Bank statements (3 months for all accounts)",
    "Affidavit for unemployed parents/guardians",
    "Death certificate (if parent/guardian deceased)",
    "Disability certificate (if applicable)",
    "Proof of residence (municipal account or affidavit)",
    "Academic transcript (for returning students)",
  ]
}

function getNextSteps(eligible: boolean) {
  if (eligible) {
    return [
      "Create myNSFAS account at www.nsfas.org.za",
      "Complete online application with accurate information",
      "Upload all required supporting documents",
      "Apply to NSFAS-approved universities and TVET colleges",
      "Track your application status regularly",
      "Respond promptly to any NSFAS requests for additional information",
      "Accept your funding offer if approved",
      "Register at your chosen institution",
    ]
  } else {
    return [
      "Explore university-specific bursaries and scholarships",
      "Consider study loans from banks (Eduloan, FNB, etc.)",
      "Look into employer-sponsored education programs",
      "Check provincial government funding schemes",
      "Consider part-time or distance learning options",
      "Explore TVET college programs with lower costs",
      "Look into skills development programs with funding",
      "Consider gap year to improve financial situation",
    ]
  }
}

function getAdditionalInfo(data: NSFASCalculationData) {
  const info = []

  if (data.householdIncome > 350000) {
    info.push("Consider applying for university merit bursaries")
    info.push("Look into corporate bursary programs in your field of study")
  }

  if (data.disability) {
    info.push("Contact university disability units for additional support")
    info.push("Explore specialized funding for students with disabilities")
  }

  if (data.previouslyFunded) {
    info.push("Ensure you meet academic progression requirements")
    info.push("Check if you have any outstanding NSFAS debt")
  }

  return info
}
