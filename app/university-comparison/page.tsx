"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  MapPin,
  Users,
  Building,
  BookOpen,
  TrendingUp,
  Award,
  Home,
  Wifi,
  Car,
  Heart,
  Download,
  Share2,
  X,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

interface ApplicationDeadlines {
  earlyApplication?: {
    opens: string
    closes: string
    benefits: string[]
  }
  regularApplication: {
    opens: string
    closes: string
    requirements: string[]
  }
  lateApplication?: {
    opens: string
    closes: string
    additionalFee: number
    limitations: string[]
  }
  internationalApplication?: {
    opens: string
    closes: string
    additionalRequirements: string[]
  }
  keyDates: {
    nsfasApplication: string
    accommodationApplication: string
    orientationWeek: string
    academicYearStarts: string
    registrationDeadline: string
  }
  importantNotes: string[]
}

interface University {
  id: string
  name: string
  shortName: string
  location: string
  province: string
  type: "Public" | "Private" | "University of Technology"
  established: number
  ranking: {
    national: number
    african: number
    global?: number
  }
  website: string
  description: string
  studentPopulation: number
  internationalStudents: number
  staffStudentRatio: string
  graduationRate: number
  employmentRate: number
  researchRating: "A+" | "A" | "B+" | "B" | "C+" | "C"
  fees: {
    undergraduate: {
      min: number
      max: number
    }
    postgraduate: {
      min: number
      max: number
    }
    accommodation: {
      min: number
      max: number
    }
  }
  admissionRequirements: {
    minimumAPS: number
    englishRequirement: number
    mathsRequirement?: number
    nsfasAccredited: boolean
  }
  faculties: string[]
  popularPrograms: string[]
  facilities: {
    library: boolean
    laboratories: boolean
    sportsComplex: boolean
    medicalCenter: boolean
    studentCenter: boolean
    wifi: boolean
    parking: boolean
    accommodation: boolean
    dining: boolean
  }
  campusLife: {
    societies: number
    sportsTeams: number
    culturalActivities: string[]
  }
  achievements: string[]
  notableAlumni: string[]
  applicationDeadlines: ApplicationDeadlines
}

const universities: University[] = [
  {
    id: "uct",
    name: "University of Cape Town",
    shortName: "UCT",
    location: "Cape Town",
    province: "Western Cape",
    type: "Public",
    established: 1829,
    ranking: {
      national: 1,
      african: 1,
      global: 226,
    },
    website: "https://www.uct.ac.za",
    description:
      "Africa's leading research university with world-class facilities and academic excellence across all disciplines.",
    studentPopulation: 29000,
    internationalStudents: 4200,
    staffStudentRatio: "1:18",
    graduationRate: 85,
    employmentRate: 92,
    researchRating: "A+",
    fees: {
      undergraduate: { min: 45000, max: 85000 },
      postgraduate: { min: 55000, max: 120000 },
      accommodation: { min: 35000, max: 65000 },
    },
    admissionRequirements: {
      minimumAPS: 35,
      englishRequirement: 60,
      mathsRequirement: 60,
      nsfasAccredited: true,
    },
    faculties: ["Commerce", "Engineering", "Health Sciences", "Humanities", "Law", "Science"],
    popularPrograms: ["Medicine (MBChB)", "Engineering", "Commerce", "Computer Science", "Law", "Architecture"],
    facilities: {
      library: true,
      laboratories: true,
      sportsComplex: true,
      medicalCenter: true,
      studentCenter: true,
      wifi: true,
      parking: true,
      accommodation: true,
      dining: true,
    },
    campusLife: {
      societies: 150,
      sportsTeams: 45,
      culturalActivities: ["Drama Society", "Choir", "Art Gallery", "Film Society"],
    },
    achievements: [
      "Top university in Africa",
      "5 Nobel Prize winners",
      "Leading medical research",
      "Sustainable campus initiatives",
    ],
    notableAlumni: ["Nelson Mandela", "Desmond Tutu", "J.M. Coetzee", "Max Theiler"],
    applicationDeadlines: {
      earlyApplication: {
        opens: "1 April 2024",
        closes: "31 July 2024",
        benefits: ["Priority consideration", "Early accommodation allocation", "Reduced application stress"],
      },
      regularApplication: {
        opens: "1 April 2024",
        closes: "30 September 2024",
        requirements: [
          "Completed application form",
          "Certified academic records",
          "Proof of identity",
          "Application fee payment",
        ],
      },
      lateApplication: {
        opens: "1 October 2024",
        closes: "31 October 2024",
        additionalFee: 500,
        limitations: ["Limited program availability", "No accommodation guarantee", "Subject to space availability"],
      },
      internationalApplication: {
        opens: "1 March 2024",
        closes: "31 August 2024",
        additionalRequirements: [
          "Passport copy",
          "Academic credential evaluation",
          "English proficiency test",
          "Study permit application",
        ],
      },
      keyDates: {
        nsfasApplication: "Opens: 1 September 2024, Closes: 31 January 2025",
        accommodationApplication: "Opens: 1 August 2024, Closes: 30 September 2024",
        orientationWeek: "13-17 February 2025",
        academicYearStarts: "20 February 2025",
        registrationDeadline: "28 February 2025",
      },
      importantNotes: [
        "Medicine and Health Sciences applications close earlier (31 August)",
        "Portfolio required for Architecture and Fine Arts programs",
        "NBT (National Benchmark Test) required for most programs",
        "International students must apply 6 months before academic year",
      ],
    },
  },
  {
    id: "wits",
    name: "University of the Witwatersrand",
    shortName: "Wits",
    location: "Johannesburg",
    province: "Gauteng",
    type: "Public",
    established: 1922,
    ranking: {
      national: 2,
      african: 2,
      global: 428,
    },
    website: "https://www.wits.ac.za",
    description:
      "Premier research university known for excellence in engineering, medicine, business, and social sciences.",
    studentPopulation: 40000,
    internationalStudents: 3800,
    staffStudentRatio: "1:20",
    graduationRate: 82,
    employmentRate: 89,
    researchRating: "A+",
    fees: {
      undergraduate: { min: 48000, max: 88000 },
      postgraduate: { min: 58000, max: 125000 },
      accommodation: { min: 32000, max: 58000 },
    },
    admissionRequirements: {
      minimumAPS: 34,
      englishRequirement: 60,
      mathsRequirement: 60,
      nsfasAccredited: true,
    },
    faculties: ["Commerce", "Engineering", "Health Sciences", "Humanities", "Science"],
    popularPrograms: ["Mining Engineering", "Medicine", "Business Science", "Computer Science", "Psychology"],
    facilities: {
      library: true,
      laboratories: true,
      sportsComplex: true,
      medicalCenter: true,
      studentCenter: true,
      wifi: true,
      parking: true,
      accommodation: true,
      dining: true,
    },
    campusLife: {
      societies: 120,
      sportsTeams: 38,
      culturalActivities: ["Theatre", "Music Society", "Debate Club", "Cultural Festival"],
    },
    achievements: [
      "Leading mining research globally",
      "Top business school in Africa",
      "Excellence in paleontology",
      "Innovation hub",
    ],
    notableAlumni: ["Nelson Mandela", "Sydney Brenner", "Aaron Klug", "Nadine Gordimer"],
    applicationDeadlines: {
      earlyApplication: {
        opens: "1 April 2024",
        closes: "31 July 2024",
        benefits: ["Priority processing", "Early residence allocation", "Scholarship consideration priority"],
      },
      regularApplication: {
        opens: "1 April 2024",
        closes: "30 September 2024",
        requirements: ["Online application", "Academic transcripts", "ID document", "Application fee", "NBT results"],
      },
      lateApplication: {
        opens: "1 October 2024",
        closes: "15 November 2024",
        additionalFee: 750,
        limitations: ["Limited course options", "No residence guarantee", "Higher entry requirements"],
      },
      internationalApplication: {
        opens: "1 March 2024",
        closes: "31 July 2024",
        additionalRequirements: ["Passport", "Academic evaluation", "TOEFL/IELTS scores", "Financial proof"],
      },
      keyDates: {
        nsfasApplication: "Opens: 1 September 2024, Closes: 31 January 2025",
        accommodationApplication: "Opens: 1 July 2024, Closes: 30 September 2024",
        orientationWeek: "6-10 February 2025",
        academicYearStarts: "13 February 2025",
        registrationDeadline: "21 February 2025",
      },
      importantNotes: [
        "Engineering applications highly competitive - apply early",
        "Medicine requires additional selection process",
        "Business School has separate application deadlines",
        "Mining Engineering has industry partnerships for internships",
      ],
    },
  },
  {
    id: "stellenbosch",
    name: "Stellenbosch University",
    shortName: "SU",
    location: "Stellenbosch",
    province: "Western Cape",
    type: "Public",
    established: 1918,
    ranking: {
      national: 3,
      african: 3,
      global: 451,
    },
    website: "https://www.sun.ac.za",
    description:
      "Renowned research university with beautiful campus, strong in agriculture, engineering, and wine studies.",
    studentPopulation: 32000,
    internationalStudents: 3200,
    staffStudentRatio: "1:19",
    graduationRate: 84,
    employmentRate: 88,
    researchRating: "A",
    fees: {
      undergraduate: { min: 46000, max: 82000 },
      postgraduate: { min: 56000, max: 115000 },
      accommodation: { min: 28000, max: 52000 },
    },
    admissionRequirements: {
      minimumAPS: 33,
      englishRequirement: 60,
      mathsRequirement: 60,
      nsfasAccredited: true,
    },
    faculties: [
      "AgriSciences",
      "Arts and Social Sciences",
      "Economic and Management Sciences",
      "Education",
      "Engineering",
      "Law",
      "Medicine and Health Sciences",
      "Science",
      "Theology",
    ],
    popularPrograms: ["Viticulture and Oenology", "Engineering", "Medicine", "Business Management", "Agriculture"],
    facilities: {
      library: true,
      laboratories: true,
      sportsComplex: true,
      medicalCenter: true,
      studentCenter: true,
      wifi: true,
      parking: true,
      accommodation: true,
      dining: true,
    },
    campusLife: {
      societies: 100,
      sportsTeams: 42,
      culturalActivities: ["Wine Society", "Outdoor Club", "Arts Festival", "Language Exchange"],
    },
    achievements: [
      "World-renowned wine research",
      "Leading agricultural research",
      "Beautiful historic campus",
      "Strong alumni network",
    ],
    notableAlumni: ["F.W. de Klerk", "Christiaan Barnard", "Jan Smuts", "Breyten Breytenbach"],
    applicationDeadlines: {
      earlyApplication: {
        opens: "1 April 2024",
        closes: "15 August 2024",
        benefits: ["Guaranteed consideration", "Priority residence placement", "Early financial aid processing"],
      },
      regularApplication: {
        opens: "1 April 2024",
        closes: "30 September 2024",
        requirements: [
          "Completed application",
          "Grade 11 & 12 results",
          "Identity document",
          "Language proficiency proof",
        ],
      },
      lateApplication: {
        opens: "1 October 2024",
        closes: "31 October 2024",
        additionalFee: 400,
        limitations: ["Subject to availability", "Limited residence options", "No guarantee of acceptance"],
      },
      internationalApplication: {
        opens: "1 February 2024",
        closes: "31 July 2024",
        additionalRequirements: [
          "Passport copy",
          "Academic records evaluation",
          "Language test results",
          "Medical certificate",
        ],
      },
      keyDates: {
        nsfasApplication: "Opens: 1 September 2024, Closes: 31 January 2025",
        accommodationApplication: "Opens: 15 July 2024, Closes: 15 September 2024",
        orientationWeek: "10-14 February 2025",
        academicYearStarts: "17 February 2025",
        registrationDeadline: "24 February 2025",
      },
      importantNotes: [
        "Afrikaans and English dual medium instruction available",
        "Wine and Agricultural programs have practical components",
        "Beautiful campus with historic buildings",
        "Strong focus on research and innovation",
      ],
    },
  },
  {
    id: "up",
    name: "University of Pretoria",
    shortName: "UP",
    location: "Pretoria",
    province: "Gauteng",
    type: "Public",
    established: 1908,
    ranking: {
      national: 4,
      african: 4,
      global: 501,
    },
    website: "https://www.up.ac.za",
    description: "Comprehensive research university with strong veterinary, engineering, and business programs.",
    studentPopulation: 53000,
    internationalStudents: 4500,
    staffStudentRatio: "1:22",
    graduationRate: 80,
    employmentRate: 86,
    researchRating: "A",
    fees: {
      undergraduate: { min: 44000, max: 78000 },
      postgraduate: { min: 54000, max: 110000 },
      accommodation: { min: 30000, max: 55000 },
    },
    admissionRequirements: {
      minimumAPS: 32,
      englishRequirement: 60,
      mathsRequirement: 50,
      nsfasAccredited: true,
    },
    faculties: [
      "Economic and Management Sciences",
      "Education",
      "Engineering",
      "Health Sciences",
      "Humanities",
      "Law",
      "Natural and Agricultural Sciences",
      "Theology",
      "Veterinary Science",
    ],
    popularPrograms: ["Veterinary Science", "Engineering", "Medicine", "Business Administration", "Law"],
    facilities: {
      library: true,
      laboratories: true,
      sportsComplex: true,
      medicalCenter: true,
      studentCenter: true,
      wifi: true,
      parking: true,
      accommodation: true,
      dining: true,
    },
    campusLife: {
      societies: 140,
      sportsTeams: 50,
      culturalActivities: ["Cultural Week", "Sports Day", "Academic Societies", "International Office"],
    },
    achievements: [
      "Top veterinary school in Africa",
      "Leading business school",
      "Excellent research facilities",
      "Strong industry partnerships",
    ],
    notableAlumni: ["Thabo Mbeki", "Kgalema Motlanthe", "Tokyo Sexwale", "Pravin Gordhan"],
    applicationDeadlines: {
      earlyApplication: {
        opens: "1 March 2024",
        closes: "31 July 2024",
        benefits: ["Priority consideration", "Early accommodation booking", "Scholarship eligibility"],
      },
      regularApplication: {
        opens: "1 March 2024",
        closes: "30 September 2024",
        requirements: ["Online application", "Academic records", "ID copy", "Medical certificate for some programs"],
      },
      lateApplication: {
        opens: "1 October 2024",
        closes: "30 November 2024",
        additionalFee: 600,
        limitations: ["Limited program availability", "No accommodation guarantee", "Higher admission requirements"],
      },
      internationalApplication: {
        opens: "1 February 2024",
        closes: "30 June 2024",
        additionalRequirements: ["Passport", "Academic credential evaluation", "English proficiency", "Study permit"],
      },
      keyDates: {
        nsfasApplication: "Opens: 1 September 2024, Closes: 31 January 2025",
        accommodationApplication: "Opens: 1 June 2024, Closes: 31 August 2024",
        orientationWeek: "3-7 February 2025",
        academicYearStarts: "10 February 2025",
        registrationDeadline: "17 February 2025",
      },
      importantNotes: [
        "Veterinary Science extremely competitive - early application essential",
        "Multiple campuses across Pretoria",
        "Strong industry connections for internships",
        "Excellent research opportunities for postgraduate students",
      ],
    },
  },
  {
    id: "ukzn",
    name: "University of KwaZulu-Natal",
    shortName: "UKZN",
    location: "Durban/Pietermaritzburg",
    province: "KwaZulu-Natal",
    type: "Public",
    established: 2004,
    ranking: {
      national: 5,
      african: 6,
      global: 601,
    },
    website: "https://www.ukzn.ac.za",
    description: "Dynamic university formed from merger, strong in health sciences, engineering, and humanities.",
    studentPopulation: 47000,
    internationalStudents: 2800,
    staffStudentRatio: "1:24",
    graduationRate: 78,
    employmentRate: 84,
    researchRating: "B+",
    fees: {
      undergraduate: { min: 42000, max: 75000 },
      postgraduate: { min: 52000, max: 105000 },
      accommodation: { min: 25000, max: 48000 },
    },
    admissionRequirements: {
      minimumAPS: 30,
      englishRequirement: 60,
      mathsRequirement: 50,
      nsfasAccredited: true,
    },
    faculties: [
      "Agriculture",
      "Engineering and the Built Environment",
      "Health Sciences",
      "Humanities",
      "Law and Management Studies",
      "Science and Agriculture",
    ],
    popularPrograms: ["Medicine", "Engineering", "Pharmacy", "Agriculture", "Social Sciences"],
    facilities: {
      library: true,
      laboratories: true,
      sportsComplex: true,
      medicalCenter: true,
      studentCenter: true,
      wifi: true,
      parking: true,
      accommodation: true,
      dining: true,
    },
    campusLife: {
      societies: 85,
      sportsTeams: 35,
      culturalActivities: ["Cultural Festival", "Sports Tournament", "Academic Conference", "Community Service"],
    },
    achievements: [
      "Strong health sciences programs",
      "Agricultural research excellence",
      "Diverse student body",
      "Community engagement",
    ],
    notableAlumni: ["Zweli Mkhize", "Blade Nzimande", "Nalaka Godahewa", "Rashad Cassim"],
    applicationDeadlines: {
      earlyApplication: {
        opens: "1 April 2024",
        closes: "31 August 2024",
        benefits: ["Priority processing", "Better accommodation options", "Early career guidance"],
      },
      regularApplication: {
        opens: "1 April 2024",
        closes: "30 September 2024",
        requirements: [
          "Application form",
          "Academic transcripts",
          "ID document",
          "Medical certificate for Health Sciences",
        ],
      },
      lateApplication: {
        opens: "1 October 2024",
        closes: "15 November 2024",
        additionalFee: 350,
        limitations: ["Limited course selection", "Accommodation not guaranteed", "Subject to space"],
      },
      internationalApplication: {
        opens: "1 March 2024",
        closes: "31 July 2024",
        additionalRequirements: ["Passport", "Academic evaluation", "English test results", "Financial guarantee"],
      },
      keyDates: {
        nsfasApplication: "Opens: 1 September 2024, Closes: 31 January 2025",
        accommodationApplication: "Opens: 1 August 2024, Closes: 30 September 2024",
        orientationWeek: "17-21 February 2025",
        academicYearStarts: "24 February 2025",
        registrationDeadline: "3 March 2025",
      },
      importantNotes: [
        "Multiple campuses: Durban, Pietermaritzburg, Westville",
        "Strong focus on African scholarship and research",
        "Excellent medical and health sciences facilities",
        "Active community engagement programs",
      ],
    },
  },
  {
    id: "ufs",
    name: "University of the Free State",
    shortName: "UFS",
    location: "Bloemfontein",
    province: "Free State",
    type: "Public",
    established: 1904,
    ranking: {
      national: 6,
      african: 8,
      global: 701,
    },
    website: "https://www.ufs.ac.za",
    description:
      "Comprehensive university with strong academic programs and beautiful campus in the heart of South Africa.",
    studentPopulation: 38000,
    internationalStudents: 2200,
    staffStudentRatio: "1:21",
    graduationRate: 76,
    employmentRate: 82,
    researchRating: "B+",
    fees: {
      undergraduate: { min: 40000, max: 72000 },
      postgraduate: { min: 50000, max: 100000 },
      accommodation: { min: 22000, max: 42000 },
    },
    admissionRequirements: {
      minimumAPS: 30,
      englishRequirement: 60,
      mathsRequirement: 50,
      nsfasAccredited: true,
    },
    faculties: [
      "Economic and Management Sciences",
      "Education",
      "Health Sciences",
      "Humanities",
      "Law",
      "Natural and Agricultural Sciences",
      "Theology",
    ],
    popularPrograms: ["Medicine", "Law", "Agriculture", "Business Administration", "Education"],
    facilities: {
      library: true,
      laboratories: true,
      sportsComplex: true,
      medicalCenter: true,
      studentCenter: true,
      wifi: true,
      parking: true,
      accommodation: true,
      dining: true,
    },
    campusLife: {
      societies: 75,
      sportsTeams: 30,
      culturalActivities: ["Arts Festival", "Sports Week", "Academic Symposium", "Cultural Exchange"],
    },
    achievements: ["Strong agricultural programs", "Beautiful campus", "Affordable education", "Community focus"],
    notableAlumni: ["J.B.M. Hertzog", "C.R. Swart", "Eben Etzebeth", "Francois Pienaar"],
    applicationDeadlines: {
      earlyApplication: {
        opens: "1 April 2024",
        closes: "31 August 2024",
        benefits: ["Guaranteed consideration", "Priority residence allocation", "Early academic advising"],
      },
      regularApplication: {
        opens: "1 April 2024",
        closes: "30 September 2024",
        requirements: ["Completed application", "Academic records", "Identity document", "Application fee"],
      },
      lateApplication: {
        opens: "1 October 2024",
        closes: "31 October 2024",
        additionalFee: 300,
        limitations: ["Subject to availability", "Limited accommodation", "No guarantee of preferred program"],
      },
      internationalApplication: {
        opens: "1 March 2024",
        closes: "31 July 2024",
        additionalRequirements: [
          "Passport copy",
          "Academic credential verification",
          "Language proficiency",
          "Health certificate",
        ],
      },
      keyDates: {
        nsfasApplication: "Opens: 1 September 2024, Closes: 31 January 2025",
        accommodationApplication: "Opens: 1 July 2024, Closes: 31 August 2024",
        orientationWeek: "10-14 February 2025",
        academicYearStarts: "17 February 2025",
        registrationDeadline: "24 February 2025",
      },
      importantNotes: [
        "Central location in South Africa",
        "Affordable tuition and living costs",
        "Strong support for first-generation university students",
        "Excellent agricultural and veterinary programs",
      ],
    },
  },
]

export default function UniversityComparisonPage() {
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProvince, setFilterProvince] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("ranking")

  const provinces = [
    "Western Cape",
    "Gauteng",
    "KwaZulu-Natal",
    "Free State",
    "Eastern Cape",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
  ]
  const types = ["Public", "Private", "University of Technology"]

  const filteredUniversities = universities
    .filter(
      (uni) =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((uni) => filterProvince === "all" || uni.province === filterProvince)
    .filter((uni) => filterType === "all" || uni.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case "ranking":
          return a.ranking.national - b.ranking.national
        case "fees":
          return a.fees.undergraduate.min - b.fees.undergraduate.min
        case "students":
          return b.studentPopulation - a.studentPopulation
        case "employment":
          return b.employmentRate - a.employmentRate
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const toggleUniversitySelection = (universityId: string) => {
    setSelectedUniversities((prev) =>
      prev.includes(universityId)
        ? prev.filter((id) => id !== universityId)
        : prev.length < 4
          ? [...prev, universityId]
          : prev,
    )
  }

  const selectedUniversityData = universities.filter((uni) => selectedUniversities.includes(uni.id))

  const formatCurrency = (amount: number) => `R${amount.toLocaleString()}`

  const getFacilityIcon = (facility: string) => {
    const icons: { [key: string]: any } = {
      library: BookOpen,
      laboratories: Award,
      sportsComplex: TrendingUp,
      medicalCenter: Heart,
      studentCenter: Users,
      wifi: Wifi,
      parking: Car,
      accommodation: Home,
      dining: Building,
    }
    return icons[facility] || Building
  }

  const isDeadlineUrgent = (dateString: string) => {
    const deadline = new Date(dateString)
    const today = new Date()
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDeadline <= 30 && daysUntilDeadline > 0
  }

  const isDeadlinePassed = (dateString: string) => {
    const deadline = new Date(dateString)
    const today = new Date()
    return deadline < today
  }

  const getDeadlineStatus = (dateString: string) => {
    if (isDeadlinePassed(dateString)) return "passed"
    if (isDeadlineUrgent(dateString)) return "urgent"
    return "normal"
  }

  const getDeadlineBadgeVariant = (status: string) => {
    switch (status) {
      case "passed":
        return "destructive"
      case "urgent":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Comparison</h1>
            <p className="text-gray-600">Compare South African universities side by side to make the best choice</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Download className="h-4 w-4" />
              <span>Export Comparison</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Deadline Alert */}
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Application Season Alert:</strong> Most university applications for 2025 are now open. Regular
            application deadlines are approaching in September-October 2024. Apply early for better chances!
          </AlertDescription>
        </Alert>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find & Filter Universities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="search">Search Universities</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Select value={filterProvince} onValueChange={setFilterProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">University Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ranking">National Ranking</SelectItem>
                    <SelectItem value="fees">Fees (Low to High)</SelectItem>
                    <SelectItem value="students">Student Population</SelectItem>
                    <SelectItem value="employment">Employment Rate</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* University Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredUniversities.map((university) => (
            <Card
              key={university.id}
              className={`cursor-pointer transition-all ${
                selectedUniversities.includes(university.id) ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-lg"
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{university.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {university.location}, {university.province}
                        </span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="default">#{university.ranking.national}</Badge>
                    <Checkbox
                      checked={selectedUniversities.includes(university.id)}
                      onCheckedChange={() => toggleUniversitySelection(university.id)}
                      disabled={!selectedUniversities.includes(university.id) && selectedUniversities.length >= 4}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{university.description}</p>

                {/* Quick Deadline Info */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold">Application Deadline</span>
                  </div>
                  <div className="text-sm">
                    <Badge
                      variant={getDeadlineBadgeVariant(
                        getDeadlineStatus(university.applicationDeadlines.regularApplication.closes),
                      )}
                      className="mr-2"
                    >
                      {university.applicationDeadlines.regularApplication.closes}
                    </Badge>
                    {isDeadlineUrgent(university.applicationDeadlines.regularApplication.closes) && (
                      <span className="text-orange-600 text-xs">Urgent!</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Students:</span>
                    <p>{university.studentPopulation.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Employment Rate:</span>
                    <p>{university.employmentRate}%</p>
                  </div>
                  <div>
                    <span className="font-semibold">Fees (UG):</span>
                    <p>
                      {formatCurrency(university.fees.undergraduate.min)} -{" "}
                      {formatCurrency(university.fees.undergraduate.max)}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Min APS:</span>
                    <p>{university.admissionRequirements.minimumAPS}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="outline" className="mr-2">
                    {university.type}
                  </Badge>
                  <Badge variant="outline">{university.researchRating} Research</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Results */}
        {selectedUniversityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                University Comparison ({selectedUniversityData.length}/4)
                <Button variant="outline" size="sm" onClick={() => setSelectedUniversities([])}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="academics">Academics</TabsTrigger>
                  <TabsTrigger value="fees">Fees & Aid</TabsTrigger>
                  <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="campus">Campus Life</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">University</TableHead>
                          {selectedUniversityData.map((uni) => (
                            <TableHead key={uni.id} className="text-center min-w-48">
                              <div className="flex flex-col items-center space-y-2">
                                <span className="font-semibold">{uni.shortName}</span>
                                <Button variant="ghost" size="sm" onClick={() => toggleUniversitySelection(uni.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Full Name</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.name}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Location</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.location}, {uni.province}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Type</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <Badge variant="outline">{uni.type}</Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Established</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.established}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">National Ranking</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <Badge variant="default">#{uni.ranking.national}</Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Global Ranking</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.ranking.global ? `#${uni.ranking.global}` : "Not ranked"}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Student Population</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.studentPopulation.toLocaleString()}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">International Students</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.internationalStudents.toLocaleString()}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Staff:Student Ratio</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.staffStudentRatio}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="academics">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Academic Information</TableHead>
                          {selectedUniversityData.map((uni) => (
                            <TableHead key={uni.id} className="text-center min-w-48">
                              {uni.shortName}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Research Rating</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <Badge variant={uni.researchRating.includes("A") ? "default" : "secondary"}>
                                {uni.researchRating}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Minimum APS</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.admissionRequirements.minimumAPS}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">English Requirement</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.admissionRequirements.englishRequirement}%
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Maths Requirement</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.admissionRequirements.mathsRequirement
                                ? `${uni.admissionRequirements.mathsRequirement}%`
                                : "Not required"}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">NSFAS Accredited</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <Badge variant={uni.admissionRequirements.nsfasAccredited ? "default" : "secondary"}>
                                {uni.admissionRequirements.nsfasAccredited ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Number of Faculties</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.faculties.length}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Popular Programs</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <div className="space-y-1">
                                {uni.popularPrograms.slice(0, 3).map((program, index) => (
                                  <Badge key={index} variant="outline" className="block text-xs">
                                    {program}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="fees">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Fees & Financial Aid</TableHead>
                          {selectedUniversityData.map((uni) => (
                            <TableHead key={uni.id} className="text-center min-w-48">
                              {uni.shortName}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Undergraduate Fees</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {formatCurrency(uni.fees.undergraduate.min)} -{" "}
                              {formatCurrency(uni.fees.undergraduate.max)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Postgraduate Fees</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {formatCurrency(uni.fees.postgraduate.min)} - {formatCurrency(uni.fees.postgraduate.max)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Accommodation Fees</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {formatCurrency(uni.fees.accommodation.min)} -{" "}
                              {formatCurrency(uni.fees.accommodation.max)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Total Annual Cost (Est.)</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center font-semibold">
                              {formatCurrency(uni.fees.undergraduate.min + uni.fees.accommodation.min + 15000)} -{" "}
                              {formatCurrency(uni.fees.undergraduate.max + uni.fees.accommodation.max + 25000)}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="deadlines">
                  <div className="space-y-6">
                    {selectedUniversityData.map((uni) => (
                      <Card key={uni.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>{uni.name} - Application Deadlines & Key Dates</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Application Deadlines */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Application Deadlines</span>
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {uni.applicationDeadlines.earlyApplication && (
                                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                                  <h5 className="font-medium text-green-800 mb-2">Early Application</h5>
                                  <p className="text-sm text-green-700 mb-2">
                                    <strong>Opens:</strong> {uni.applicationDeadlines.earlyApplication.opens}
                                  </p>
                                  <p className="text-sm text-green-700 mb-3">
                                    <strong>Closes:</strong> {uni.applicationDeadlines.earlyApplication.closes}
                                  </p>
                                  <div className="space-y-1">
                                    {uni.applicationDeadlines.earlyApplication.benefits.map((benefit, index) => (
                                      <p key={index} className="text-xs text-green-600">
                                        • {benefit}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                                <h5 className="font-medium text-blue-800 mb-2">Regular Application</h5>
                                <p className="text-sm text-blue-700 mb-2">
                                  <strong>Opens:</strong> {uni.applicationDeadlines.regularApplication.opens}
                                </p>
                                <p className="text-sm text-blue-700 mb-3">
                                  <strong>Closes:</strong> {uni.applicationDeadlines.regularApplication.closes}
                                  <Badge
                                    variant={getDeadlineBadgeVariant(
                                      getDeadlineStatus(uni.applicationDeadlines.regularApplication.closes),
                                    )}
                                    className="ml-2"
                                  >
                                    {getDeadlineStatus(uni.applicationDeadlines.regularApplication.closes)}
                                  </Badge>
                                </p>
                                <div className="space-y-1">
                                  {uni.applicationDeadlines.regularApplication.requirements.map((req, index) => (
                                    <p key={index} className="text-xs text-blue-600">
                                      • {req}
                                    </p>
                                  ))}
                                </div>
                              </div>

                              {uni.applicationDeadlines.lateApplication && (
                                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                                  <h5 className="font-medium text-orange-800 mb-2">Late Application</h5>
                                  <p className="text-sm text-orange-700 mb-2">
                                    <strong>Opens:</strong> {uni.applicationDeadlines.lateApplication.opens}
                                  </p>
                                  <p className="text-sm text-orange-700 mb-2">
                                    <strong>Closes:</strong> {uni.applicationDeadlines.lateApplication.closes}
                                  </p>
                                  <p className="text-sm text-orange-700 mb-3">
                                    <strong>Additional Fee:</strong>{" "}
                                    {formatCurrency(uni.applicationDeadlines.lateApplication.additionalFee)}
                                  </p>
                                  <div className="space-y-1">
                                    {uni.applicationDeadlines.lateApplication.limitations.map((limitation, index) => (
                                      <p key={index} className="text-xs text-orange-600">
                                        • {limitation}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* International Applications */}
                          {uni.applicationDeadlines.internationalApplication && (
                            <div>
                              <h4 className="font-semibold mb-3">International Student Applications</h4>
                              <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                                <p className="text-sm text-purple-700 mb-2">
                                  <strong>Opens:</strong> {uni.applicationDeadlines.internationalApplication.opens}
                                </p>
                                <p className="text-sm text-purple-700 mb-3">
                                  <strong>Closes:</strong> {uni.applicationDeadlines.internationalApplication.closes}
                                </p>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-purple-800">Additional Requirements:</p>
                                  {uni.applicationDeadlines.internationalApplication.additionalRequirements.map(
                                    (req, index) => (
                                      <p key={index} className="text-xs text-purple-600">
                                        • {req}
                                      </p>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Key Dates */}
                          <div>
                            <h4 className="font-semibold mb-3">Important Key Dates</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium">NSFAS Application</span>
                                  <span className="text-sm text-gray-600">
                                    {uni.applicationDeadlines.keyDates.nsfasApplication}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium">Accommodation Application</span>
                                  <span className="text-sm text-gray-600">
                                    {uni.applicationDeadlines.keyDates.accommodationApplication}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium">Registration Deadline</span>
                                  <span className="text-sm text-gray-600">
                                    {uni.applicationDeadlines.keyDates.registrationDeadline}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium">Orientation Week</span>
                                  <span className="text-sm text-gray-600">
                                    {uni.applicationDeadlines.keyDates.orientationWeek}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium">Academic Year Starts</span>
                                  <span className="text-sm text-gray-600">
                                    {uni.applicationDeadlines.keyDates.academicYearStarts}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Important Notes */}
                          <div>
                            <h4 className="font-semibold mb-3">Important Notes</h4>
                            <div className="space-y-2">
                              {uni.applicationDeadlines.importantNotes.map((note, index) => (
                                <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-yellow-800">{note}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="facilities">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Campus Facilities</TableHead>
                          {selectedUniversityData.map((uni) => (
                            <TableHead key={uni.id} className="text-center min-w-48">
                              {uni.shortName}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(universities[0].facilities).map((facility) => (
                          <TableRow key={facility}>
                            <TableCell className="font-medium capitalize">
                              <div className="flex items-center space-x-2">
                                {(() => {
                                  const Icon = getFacilityIcon(facility)
                                  return <Icon className="h-4 w-4" />
                                })()}
                                <span>{facility.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                              </div>
                            </TableCell>
                            {selectedUniversityData.map((uni) => (
                              <TableCell key={uni.id} className="text-center">
                                <Badge
                                  variant={
                                    uni.facilities[facility as keyof typeof uni.facilities] ? "default" : "secondary"
                                  }
                                >
                                  {uni.facilities[facility as keyof typeof uni.facilities]
                                    ? "Available"
                                    : "Not Available"}
                                </Badge>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="campus">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Campus Life</TableHead>
                          {selectedUniversityData.map((uni) => (
                            <TableHead key={uni.id} className="text-center min-w-48">
                              {uni.shortName}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Student Societies</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.campusLife.societies}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sports Teams</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              {uni.campusLife.sportsTeams}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cultural Activities</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <div className="space-y-1">
                                {uni.campusLife.culturalActivities.slice(0, 2).map((activity, index) => (
                                  <Badge key={index} variant="outline" className="block text-xs">
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Notable Alumni</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <div className="space-y-1">
                                {uni.notableAlumni.slice(0, 2).map((alumni, index) => (
                                  <div key={index} className="text-xs text-gray-600">
                                    {alumni}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="outcomes">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-48">Student Outcomes</TableHead>
                          {selectedUniversityData.map((uni) => (
                            <TableHead key={uni.id} className="text-center min-w-48">
                              {uni.shortName}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Graduation Rate</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <Badge variant={uni.graduationRate >= 80 ? "default" : "secondary"}>
                                {uni.graduationRate}%
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Employment Rate</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <Badge variant={uni.employmentRate >= 85 ? "default" : "secondary"}>
                                {uni.employmentRate}%
                              </Badge>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Key Achievements</TableCell>
                          {selectedUniversityData.map((uni) => (
                            <TableCell key={uni.id} className="text-center">
                              <div className="space-y-1">
                                {uni.achievements.slice(0, 2).map((achievement, index) => (
                                  <div key={index} className="text-xs text-gray-600">
                                    {achievement}
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Ready to apply to your chosen universities?</p>
          <div className="flex justify-center space-x-4">
            <Link href="/applications">
              <Button size="lg">Start Applications</Button>
            </Link>
            <Link href="/financial-aid">
              <Button variant="outline" size="lg">
                Check Financial Aid
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
