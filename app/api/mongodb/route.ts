import { type NextRequest, NextResponse } from "next/server"

// Mock MongoDB operations - in production, use actual MongoDB client
// This would typically use mongodb driver or mongoose

interface University {
  _id: string
  name: string
  location: string
  province: string
  type: string
  ranking: number
  website: string
  description: string
  faculties: string[]
  fees: {
    undergraduate: string
    postgraduate: string
  }
  requirements: {
    minimum_aps: number
    english_requirement: number
    mathematics_requirement?: number
  }
  contact: {
    phone: string
    email: string
    address: string
  }
}

interface Course {
  _id: string
  name: string
  university_id: string
  university_name: string
  faculty: string
  degree_type: string
  duration: string
  nqf_level: number
  requirements: {
    subjects: { [key: string]: number }
    minimum_aps: number
    additional_requirements?: string[]
  }
  fees: string
  description: string
  career_prospects: string[]
  accreditation: string[]
  application_deadline: string
}

// Mock database data
const mockUniversities: University[] = [
  {
    _id: "uct_001",
    name: "University of Cape Town",
    location: "Cape Town",
    province: "Western Cape",
    type: "Public Research University",
    ranking: 1,
    website: "https://www.uct.ac.za",
    description: "Africa's leading research university with world-class facilities and programs.",
    faculties: ["Commerce", "Engineering", "Health Sciences", "Humanities", "Law", "Science"],
    fees: {
      undergraduate: "R55,000 - R85,000",
      postgraduate: "R65,000 - R120,000",
    },
    requirements: {
      minimum_aps: 35,
      english_requirement: 60,
      mathematics_requirement: 60,
    },
    contact: {
      phone: "+27 21 650 9111",
      email: "admissions@uct.ac.za",
      address: "Private Bag X3, Rondebosch 7701",
    },
  },
  {
    _id: "wits_001",
    name: "University of the Witwatersrand",
    location: "Johannesburg",
    province: "Gauteng",
    type: "Public Research University",
    ranking: 2,
    website: "https://www.wits.ac.za",
    description: "Premier university known for excellence in engineering, medicine, and business.",
    faculties: ["Commerce", "Engineering", "Health Sciences", "Humanities", "Science"],
    fees: {
      undergraduate: "R60,000 - R90,000",
      postgraduate: "R70,000 - R130,000",
    },
    requirements: {
      minimum_aps: 34,
      english_requirement: 60,
      mathematics_requirement: 65,
    },
    contact: {
      phone: "+27 11 717 1000",
      email: "admissions@wits.ac.za",
      address: "1 Jan Smuts Avenue, Braamfontein 2000",
    },
  },
  {
    _id: "sun_001",
    name: "Stellenbosch University",
    location: "Stellenbosch",
    province: "Western Cape",
    type: "Public Research University",
    ranking: 3,
    website: "https://www.sun.ac.za",
    description: "Renowned for agriculture, engineering, and wine studies with beautiful campus.",
    faculties: ["AgriSciences", "Arts", "Economic Sciences", "Education", "Engineering", "Medicine", "Science"],
    fees: {
      undergraduate: "R50,000 - R80,000",
      postgraduate: "R60,000 - R110,000",
    },
    requirements: {
      minimum_aps: 33,
      english_requirement: 60,
      mathematics_requirement: 60,
    },
    contact: {
      phone: "+27 21 808 9111",
      email: "info@sun.ac.za",
      address: "Private Bag X1, Matieland 7602",
    },
  },
  {
    _id: "up_001",
    name: "University of Pretoria",
    location: "Pretoria",
    province: "Gauteng",
    type: "Public Research University",
    ranking: 4,
    website: "https://www.up.ac.za",
    description: "Comprehensive university with strong veterinary and engineering programs.",
    faculties: [
      "Economic Sciences",
      "Education",
      "Engineering",
      "Health Sciences",
      "Humanities",
      "Law",
      "Natural Sciences",
      "Theology",
      "Veterinary Science",
    ],
    fees: {
      undergraduate: "R55,000 - R85,000",
      postgraduate: "R65,000 - R125,000",
    },
    requirements: {
      minimum_aps: 32,
      english_requirement: 60,
      mathematics_requirement: 60,
    },
    contact: {
      phone: "+27 12 420 3111",
      email: "admissions@up.ac.za",
      address: "Private Bag X20, Hatfield 0028",
    },
  },
]

const mockCourses: Course[] = [
  {
    _id: "course_001",
    name: "Bachelor of Engineering (Mechanical)",
    university_id: "wits_001",
    university_name: "University of the Witwatersrand",
    faculty: "Faculty of Engineering and the Built Environment",
    degree_type: "Bachelor's Degree",
    duration: "4 years",
    nqf_level: 8,
    requirements: {
      subjects: {
        Mathematics: 70,
        "Physical Sciences": 70,
        English: 60,
      },
      minimum_aps: 36,
      additional_requirements: ["National Benchmark Test (NBT)", "Strong problem-solving skills"],
    },
    fees: "R75,000 - R95,000 per year",
    description:
      "Comprehensive mechanical engineering program covering thermodynamics, fluid mechanics, materials science, and design. Strong industry partnerships provide excellent internship opportunities.",
    career_prospects: [
      "Mechanical Engineer",
      "Design Engineer",
      "Project Manager",
      "Manufacturing Engineer",
      "Consulting Engineer",
      "Research and Development Engineer",
    ],
    accreditation: ["Engineering Council of South Africa (ECSA)", "Washington Accord"],
    application_deadline: "2024-09-30",
  },
  {
    _id: "course_002",
    name: "Bachelor of Commerce (Accounting)",
    university_id: "uct_001",
    university_name: "University of Cape Town",
    faculty: "Faculty of Commerce",
    degree_type: "Bachelor's Degree",
    duration: "3 years",
    nqf_level: 7,
    requirements: {
      subjects: {
        Mathematics: 65,
        English: 60,
        Accounting: 60,
      },
      minimum_aps: 35,
      additional_requirements: ["National Benchmark Test (NBT)"],
    },
    fees: "R60,000 - R75,000 per year",
    description:
      "Leading commerce program with strong focus on accounting principles, financial management, and business ethics. Pathway to professional accounting qualifications.",
    career_prospects: [
      "Chartered Accountant (CA)",
      "Financial Manager",
      "Auditor",
      "Tax Consultant",
      "Management Accountant",
      "Financial Analyst",
    ],
    accreditation: ["South African Institute of Chartered Accountants (SAICA)"],
    application_deadline: "2024-09-30",
  },
  {
    _id: "course_003",
    name: "Bachelor of Medicine and Bachelor of Surgery (MBChB)",
    university_id: "uct_001",
    university_name: "University of Cape Town",
    faculty: "Faculty of Health Sciences",
    degree_type: "Professional Degree",
    duration: "6 years",
    nqf_level: 8,
    requirements: {
      subjects: {
        Mathematics: 75,
        "Physical Sciences": 75,
        "Life Sciences": 75,
        English: 70,
      },
      minimum_aps: 42,
      additional_requirements: [
        "National Benchmark Test (NBT)",
        "Multiple Mini Interview (MMI)",
        "Community service experience preferred",
      ],
    },
    fees: "R95,000 - R130,000 per year",
    description:
      "Prestigious medical program with world-class clinical training at Groote Schuur Hospital and associated teaching hospitals. Strong research component.",
    career_prospects: [
      "Medical Doctor",
      "Specialist Physician",
      "Surgeon",
      "Medical Researcher",
      "Public Health Officer",
      "Medical Consultant",
    ],
    accreditation: ["Health Professions Council of South Africa (HPCSA)"],
    application_deadline: "2024-08-31",
  },
  {
    _id: "course_004",
    name: "Bachelor of Science (Computer Science)",
    university_id: "wits_001",
    university_name: "University of the Witwatersrand",
    faculty: "Faculty of Science",
    degree_type: "Bachelor's Degree",
    duration: "3 years",
    nqf_level: 7,
    requirements: {
      subjects: {
        Mathematics: 70,
        "Physical Sciences": 65,
        English: 60,
      },
      minimum_aps: 34,
      additional_requirements: ["National Benchmark Test (NBT)", "Logical thinking skills"],
    },
    fees: "R65,000 - R80,000 per year",
    description:
      "Cutting-edge computer science program covering software engineering, artificial intelligence, data science, and cybersecurity. Strong industry connections.",
    career_prospects: [
      "Software Developer",
      "Data Scientist",
      "Systems Analyst",
      "IT Consultant",
      "Cybersecurity Specialist",
      "Machine Learning Engineer",
    ],
    accreditation: ["Computer Society of South Africa (CSSA)"],
    application_deadline: "2024-09-30",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const province = searchParams.get("province")
  const field = searchParams.get("field")

  try {
    if (type === "universities") {
      let filteredUniversities = mockUniversities

      if (province) {
        filteredUniversities = filteredUniversities.filter(
          (uni) => uni.province.toLowerCase() === province.toLowerCase(),
        )
      }

      return NextResponse.json({
        success: true,
        data: filteredUniversities,
        count: filteredUniversities.length,
      })
    }

    if (type === "courses") {
      let filteredCourses = mockCourses

      if (field) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.name.toLowerCase().includes(field.toLowerCase()) ||
            course.faculty.toLowerCase().includes(field.toLowerCase()),
        )
      }

      return NextResponse.json({
        success: true,
        data: filteredCourses,
        count: filteredCourses.length,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid type parameter. Use "universities" or "courses"',
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { type, ...recordData } = data

    if (type === "student_submission") {
      // In production, this would save to MongoDB
      const submission = {
        _id: `submission_${Date.now()}`,
        ...recordData,
        created_at: new Date().toISOString(),
        status: "processed",
      }

      return NextResponse.json({
        success: true,
        data: submission,
        message: "Student submission saved successfully",
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid submission type",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save data",
      },
      { status: 500 },
    )
  }
}
