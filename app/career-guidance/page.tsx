"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, MapPin, Users, Search, BookOpen, Target, X } from "lucide-react"
import Link from "next/link"

const careerData = [
  // Technology & IT
  {
    title: "Software Developer",
    field: "Technology",
    averageSalary: "R450,000 - R800,000",
    growth: "+15%",
    education: "Computer Science, Information Technology",
    skills: ["Programming", "Problem-solving", "Analytical thinking"],
    jobOutlook: "Excellent",
    description: "Design, develop, and maintain software applications and systems.",
    topEmployers: ["Naspers", "Discovery", "Capitec", "Amazon", "Microsoft"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Science in Computer Science", universities: ["UCT", "Wits", "Stellenbosch"] },
      { name: "Bachelor of Information Technology", universities: ["UP", "UKZN", "UFS"] },
      { name: "Bachelor of Computer Engineering", universities: ["Wits", "UCT", "UP"] },
    ],
  },
  {
    title: "Data Scientist",
    field: "Technology",
    averageSalary: "R500,000 - R900,000",
    growth: "+22%",
    education: "Statistics, Mathematics, Computer Science",
    skills: ["Statistics", "Machine Learning", "Python", "R"],
    jobOutlook: "Excellent",
    description: "Analyze complex data to help organizations make informed decisions.",
    topEmployers: ["Standard Bank", "Vodacom", "MTN", "Old Mutual", "Deloitte"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Science in Statistics", universities: ["UCT", "Wits", "Stellenbosch"] },
      { name: "Bachelor of Science in Mathematics", universities: ["UCT", "Wits", "UP"] },
      { name: "Bachelor of Science in Data Science", universities: ["UCT", "Wits"] },
    ],
  },
  {
    title: "Cybersecurity Specialist",
    field: "Technology",
    averageSalary: "R550,000 - R950,000",
    growth: "+28%",
    education: "Computer Science, Information Security",
    skills: ["Network Security", "Ethical Hacking", "Risk Assessment"],
    jobOutlook: "Excellent",
    description: "Protect organizations from cyber threats and security breaches.",
    topEmployers: ["Dimension Data", "EOH", "Telkom", "Standard Bank", "Nedbank"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Science in Computer Science", universities: ["UCT", "Wits", "UP"] },
      { name: "Bachelor of Information Security", universities: ["UNISA", "UJ"] },
      { name: "Bachelor of Computer Engineering", universities: ["Wits", "UCT"] },
    ],
  },
  {
    title: "Cloud Architect",
    field: "Technology",
    averageSalary: "R600,000 - R1,100,000",
    growth: "+35%",
    education: "Computer Science, Information Technology",
    skills: ["Cloud Platforms", "System Architecture", "DevOps"],
    jobOutlook: "Excellent",
    description: "Design and implement cloud computing strategies for organizations.",
    topEmployers: ["Amazon Web Services", "Microsoft", "Accenture", "IBM", "Deloitte"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Science in Computer Science", universities: ["UCT", "Wits", "Stellenbosch"] },
      { name: "Bachelor of Information Technology", universities: ["UP", "UKZN"] },
      { name: "Bachelor of Computer Engineering", universities: ["Wits", "UCT"] },
    ],
  },
  {
    title: "Mobile App Developer",
    field: "Technology",
    averageSalary: "R400,000 - R750,000",
    growth: "+18%",
    education: "Computer Science, Software Engineering",
    skills: ["Mobile Development", "UI/UX Design", "Programming"],
    jobOutlook: "Excellent",
    description: "Create mobile applications for iOS and Android platforms.",
    topEmployers: ["Takealot", "Mr D Food", "Discovery", "Capitec", "FNB"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Science in Computer Science", universities: ["UCT", "Wits", "UP"] },
      { name: "Bachelor of Information Technology", universities: ["UP", "UKZN", "UFS"] },
      { name: "Bachelor of Software Engineering", universities: ["Wits", "UCT"] },
    ],
  },

  // Engineering
  {
    title: "Mechanical Engineer",
    field: "Engineering",
    averageSalary: "R400,000 - R700,000",
    growth: "+8%",
    education: "Mechanical Engineering",
    skills: ["Technical design", "Problem-solving", "Project management"],
    jobOutlook: "Good",
    description: "Design, develop, and test mechanical devices and systems.",
    topEmployers: ["Sasol", "Eskom", "ArcelorMittal", "BMW", "Mercedes-Benz"],
    provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"],
    courses: [
      {
        name: "Bachelor of Engineering in Mechanical Engineering",
        universities: ["Wits", "UCT", "UP", "Stellenbosch"],
      },
      { name: "Bachelor of Technology in Mechanical Engineering", universities: ["TUT", "CPUT", "DUT"] },
    ],
  },
  {
    title: "Civil Engineer",
    field: "Engineering",
    averageSalary: "R450,000 - R750,000",
    growth: "+12%",
    education: "Civil Engineering",
    skills: ["Structural Design", "Project Management", "AutoCAD"],
    jobOutlook: "Good",
    description: "Design and oversee construction of infrastructure projects.",
    topEmployers: ["SANRAL", "Aurecon", "AECOM", "Arup", "WSP"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Engineering in Civil Engineering", universities: ["Wits", "UCT", "UP", "Stellenbosch"] },
      { name: "Bachelor of Technology in Civil Engineering", universities: ["TUT", "CPUT", "DUT"] },
    ],
  },
  {
    title: "Electrical Engineer",
    field: "Engineering",
    averageSalary: "R480,000 - R800,000",
    growth: "+10%",
    education: "Electrical Engineering",
    skills: ["Circuit Design", "Power Systems", "Electronics"],
    jobOutlook: "Good",
    description: "Design and develop electrical systems and equipment.",
    topEmployers: ["Eskom", "Siemens", "ABB", "Schneider Electric", "General Electric"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      {
        name: "Bachelor of Engineering in Electrical Engineering",
        universities: ["Wits", "UCT", "UP", "Stellenbosch"],
      },
      { name: "Bachelor of Technology in Electrical Engineering", universities: ["TUT", "CPUT", "DUT"] },
    ],
  },
  {
    title: "Mining Engineer",
    field: "Mining",
    averageSalary: "R550,000 - R950,000",
    growth: "+3%",
    education: "Mining Engineering",
    skills: ["Technical expertise", "Safety management", "Leadership"],
    jobOutlook: "Moderate",
    description: "Plan and oversee mining operations and safety procedures.",
    topEmployers: ["Anglo American", "Glencore", "Sibanye-Stillwater", "Impala Platinum"],
    provinces: ["Gauteng", "North West", "Limpopo"],
    courses: [
      { name: "Bachelor of Engineering in Mining Engineering", universities: ["Wits", "UP"] },
      { name: "Bachelor of Technology in Mining Engineering", universities: ["TUT", "UJ"] },
    ],
  },
  {
    title: "Chemical Engineer",
    field: "Engineering",
    averageSalary: "R500,000 - R850,000",
    growth: "+6%",
    education: "Chemical Engineering",
    skills: ["Process Design", "Chemistry", "Problem-solving"],
    jobOutlook: "Good",
    description: "Design chemical manufacturing processes and equipment.",
    topEmployers: ["Sasol", "AECI", "Omnia", "Dow Chemical", "BASF"],
    provinces: ["Gauteng", "KwaZulu-Natal", "Western Cape"],
    courses: [
      { name: "Bachelor of Engineering in Chemical Engineering", universities: ["Wits", "UCT", "UP", "Stellenbosch"] },
      { name: "Bachelor of Technology in Chemical Engineering", universities: ["TUT", "CPUT"] },
    ],
  },

  // Healthcare
  {
    title: "Medical Doctor",
    field: "Healthcare",
    averageSalary: "R600,000 - R1,200,000",
    growth: "+7%",
    education: "Medicine (MBChB)",
    skills: ["Clinical skills", "Communication", "Critical thinking"],
    jobOutlook: "Excellent",
    description: "Diagnose and treat illnesses, injuries, and other health conditions.",
    topEmployers: ["Public Hospitals", "Private Hospitals", "Mediclinic", "Netcare"],
    provinces: ["All provinces"],
    courses: [
      {
        name: "Bachelor of Medicine and Surgery (MBChB)",
        universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN", "UFS"],
      },
    ],
  },
  {
    title: "Registered Nurse",
    field: "Healthcare",
    averageSalary: "R250,000 - R450,000",
    growth: "+15%",
    education: "Nursing Science",
    skills: ["Patient Care", "Medical Knowledge", "Communication"],
    jobOutlook: "Excellent",
    description: "Provide patient care and support in healthcare settings.",
    topEmployers: ["Public Hospitals", "Netcare", "Mediclinic", "Life Healthcare"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Nursing Science", universities: ["UCT", "Wits", "UP", "UKZN", "UFS"] },
      { name: "Diploma in Nursing", universities: ["Nursing Colleges nationwide"] },
    ],
  },
  {
    title: "Pharmacist",
    field: "Healthcare",
    averageSalary: "R400,000 - R650,000",
    growth: "+8%",
    education: "Pharmacy",
    skills: ["Pharmaceutical Knowledge", "Patient Counseling", "Attention to Detail"],
    jobOutlook: "Good",
    description: "Dispense medications and provide pharmaceutical care.",
    topEmployers: ["Clicks", "Dis-Chem", "Independent Pharmacies", "Hospitals"],
    provinces: ["All provinces"],
    courses: [{ name: "Bachelor of Pharmacy", universities: ["Wits", "UP", "UKZN", "UWC", "Rhodes"] }],
  },
  {
    title: "Physiotherapist",
    field: "Healthcare",
    averageSalary: "R350,000 - R550,000",
    growth: "+12%",
    education: "Physiotherapy",
    skills: ["Manual Therapy", "Exercise Prescription", "Patient Assessment"],
    jobOutlook: "Good",
    description: "Help patients recover from injuries and improve mobility.",
    topEmployers: ["Private Practices", "Hospitals", "Sports Clubs", "Rehabilitation Centers"],
    provinces: ["All provinces"],
    courses: [{ name: "Bachelor of Physiotherapy", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN"] }],
  },
  {
    title: "Clinical Psychologist",
    field: "Healthcare",
    averageSalary: "R450,000 - R750,000",
    growth: "+14%",
    education: "Psychology (Honours + Masters)",
    skills: ["Counseling", "Assessment", "Research"],
    jobOutlook: "Good",
    description: "Assess and treat mental health conditions.",
    topEmployers: ["Private Practice", "Hospitals", "NGOs", "Employee Assistance Programs"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Arts in Psychology", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN", "UFS"] },
      { name: "Honours in Psychology", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Masters in Clinical Psychology", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
    ],
  },

  // Finance & Business
  {
    title: "Chartered Accountant",
    field: "Finance",
    averageSalary: "R500,000 - R900,000",
    growth: "+5%",
    education: "Accounting, Commerce",
    skills: ["Financial analysis", "Attention to detail", "Ethics"],
    jobOutlook: "Good",
    description: "Provide financial advice, auditing, and tax services.",
    topEmployers: ["Big 4 Firms", "Banks", "Corporate companies"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Commerce in Accounting", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN"] },
      { name: "Bachelor of Accounting Sciences", universities: ["UNISA", "UJ"] },
    ],
  },
  {
    title: "Financial Analyst",
    field: "Finance",
    averageSalary: "R400,000 - R700,000",
    growth: "+8%",
    education: "Finance, Economics, Commerce",
    skills: ["Financial Modeling", "Data Analysis", "Investment Knowledge"],
    jobOutlook: "Good",
    description: "Analyze financial data to guide investment decisions.",
    topEmployers: ["Banks", "Investment Firms", "Insurance Companies", "Corporates"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Commerce in Finance", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Bachelor of Business Science in Finance", universities: ["UCT", "Wits"] },
    ],
  },
  {
    title: "Investment Banker",
    field: "Finance",
    averageSalary: "R600,000 - R1,200,000",
    growth: "+6%",
    education: "Finance, Economics, Commerce",
    skills: ["Financial Modeling", "Client Relations", "Market Analysis"],
    jobOutlook: "Moderate",
    description: "Provide financial services to corporations and governments.",
    topEmployers: ["Standard Bank", "Nedbank", "Investec", "RMB", "Absa"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Business Science", universities: ["UCT", "Wits"] },
      { name: "Bachelor of Commerce in Finance", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
    ],
  },
  {
    title: "Management Consultant",
    field: "Business",
    averageSalary: "R550,000 - R1,000,000",
    growth: "+10%",
    education: "Business Administration, Management",
    skills: ["Problem-solving", "Strategic Thinking", "Communication"],
    jobOutlook: "Good",
    description: "Help organizations improve their performance and efficiency.",
    topEmployers: ["McKinsey", "BCG", "Bain", "Deloitte", "PwC"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Commerce", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Bachelor of Business Administration", universities: ["UP", "UKZN", "UFS"] },
      { name: "MBA", universities: ["UCT GSB", "Wits Business School", "USB"] },
    ],
  },
  {
    title: "Human Resources Manager",
    field: "Business",
    averageSalary: "R450,000 - R750,000",
    growth: "+7%",
    education: "Human Resources, Psychology, Business",
    skills: ["People Management", "Employment Law", "Communication"],
    jobOutlook: "Good",
    description: "Manage employee relations and organizational development.",
    topEmployers: ["All major corporations", "Government", "NGOs"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Arts in Psychology", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Bachelor of Commerce in Human Resources", universities: ["UP", "UKZN", "UJ"] },
      { name: "Bachelor of Administration", universities: ["UP", "UFS"] },
    ],
  },

  // Legal
  {
    title: "Advocate",
    field: "Legal",
    averageSalary: "R500,000 - R1,500,000",
    growth: "+4%",
    education: "Law (LLB)",
    skills: ["Legal Research", "Advocacy", "Critical Thinking"],
    jobOutlook: "Moderate",
    description: "Represent clients in court and provide legal opinions.",
    topEmployers: ["Private Bar", "Legal Aid", "State Attorney"],
    provinces: ["All provinces"],
    courses: [{ name: "Bachelor of Laws (LLB)", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN", "UFS"] }],
  },
  {
    title: "Attorney",
    field: "Legal",
    averageSalary: "R400,000 - R800,000",
    growth: "+3%",
    education: "Law (LLB)",
    skills: ["Legal Drafting", "Client Relations", "Negotiation"],
    jobOutlook: "Moderate",
    description: "Provide legal advice and services to clients.",
    topEmployers: ["Law Firms", "Corporate Legal Departments", "Government"],
    provinces: ["All provinces"],
    courses: [{ name: "Bachelor of Laws (LLB)", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN", "UFS"] }],
  },

  // Education
  {
    title: "Teacher (High School)",
    field: "Education",
    averageSalary: "R250,000 - R400,000",
    growth: "+5%",
    education: "Bachelor of Education",
    skills: ["Subject Knowledge", "Communication", "Classroom Management"],
    jobOutlook: "Good",
    description: "Educate and inspire high school students.",
    topEmployers: ["Public Schools", "Private Schools", "International Schools"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Education", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN", "UFS"] },
      { name: "PGCE (Postgraduate Certificate in Education)", universities: ["UCT", "Wits", "UP"] },
    ],
  },
  {
    title: "University Lecturer",
    field: "Education",
    averageSalary: "R400,000 - R700,000",
    growth: "+6%",
    education: "Masters/PhD in subject area",
    skills: ["Research", "Teaching", "Academic Writing"],
    jobOutlook: "Moderate",
    description: "Teach and conduct research at university level.",
    topEmployers: ["Universities", "Research Institutions"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor's degree in subject area", universities: ["All universities"] },
      { name: "Honours degree", universities: ["All universities"] },
      { name: "Masters degree", universities: ["All universities"] },
      { name: "PhD", universities: ["All universities"] },
    ],
  },

  // Agriculture & Environment
  {
    title: "Agricultural Scientist",
    field: "Agriculture",
    averageSalary: "R350,000 - R600,000",
    growth: "+8%",
    education: "Agricultural Sciences",
    skills: ["Research", "Plant/Animal Science", "Data Analysis"],
    jobOutlook: "Good",
    description: "Research and develop agricultural practices and technologies.",
    topEmployers: ["ARC", "Universities", "Private Companies", "Government"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Science in Agriculture", universities: ["Stellenbosch", "UP", "UKZN", "UFS"] },
      { name: "Bachelor of Agricultural Sciences", universities: ["Stellenbosch", "UP"] },
    ],
  },
  {
    title: "Environmental Scientist",
    field: "Environment",
    averageSalary: "R380,000 - R650,000",
    growth: "+12%",
    education: "Environmental Science, Geography",
    skills: ["Environmental Assessment", "Research", "GIS"],
    jobOutlook: "Good",
    description: "Study environmental problems and develop solutions.",
    topEmployers: ["Environmental Consultancies", "Government", "NGOs", "Mining Companies"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Science in Environmental Science", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Bachelor of Science in Geography", universities: ["UCT", "Wits", "UP"] },
    ],
  },
  {
    title: "Veterinarian",
    field: "Agriculture",
    averageSalary: "R450,000 - R800,000",
    growth: "+9%",
    education: "Veterinary Science",
    skills: ["Animal Health", "Surgery", "Diagnostics"],
    jobOutlook: "Good",
    description: "Diagnose and treat animal diseases and injuries.",
    topEmployers: ["Private Practices", "Government", "Pharmaceutical Companies"],
    provinces: ["All provinces"],
    courses: [{ name: "Bachelor of Veterinary Science", universities: ["UP", "Stellenbosch"] }],
  },

  // Media & Communications
  {
    title: "Journalist",
    field: "Media",
    averageSalary: "R250,000 - R500,000",
    growth: "+2%",
    education: "Journalism, Media Studies",
    skills: ["Writing", "Research", "Communication"],
    jobOutlook: "Moderate",
    description: "Research, write, and report news stories.",
    topEmployers: ["News24", "SABC", "eNCA", "Mail & Guardian", "Daily Maverick"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Arts in Journalism", universities: ["Wits", "Stellenbosch", "Rhodes"] },
      { name: "Bachelor of Arts in Media Studies", universities: ["UCT", "Wits", "UP"] },
    ],
  },
  {
    title: "Digital Marketing Specialist",
    field: "Marketing",
    averageSalary: "R350,000 - R600,000",
    growth: "+18%",
    education: "Marketing, Communications, Business",
    skills: ["SEO", "Social Media", "Analytics"],
    jobOutlook: "Excellent",
    description: "Develop and implement digital marketing strategies.",
    topEmployers: ["Digital Agencies", "E-commerce Companies", "Corporates"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Commerce in Marketing", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Bachelor of Arts in Communication", universities: ["UCT", "Wits", "UP"] },
    ],
  },

  // Tourism & Hospitality
  {
    title: "Hotel Manager",
    field: "Hospitality",
    averageSalary: "R400,000 - R700,000",
    growth: "+8%",
    education: "Hospitality Management, Business",
    skills: ["Management", "Customer Service", "Operations"],
    jobOutlook: "Good",
    description: "Oversee hotel operations and guest services.",
    topEmployers: ["Hotel Chains", "Resorts", "Boutique Hotels"],
    provinces: ["Western Cape", "Gauteng", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Commerce in Hospitality Management", universities: ["UCT", "UP", "CPUT"] },
      { name: "Diploma in Hotel Management", universities: ["IIE", "CTI"] },
    ],
  },
  {
    title: "Tourism Guide",
    field: "Tourism",
    averageSalary: "R200,000 - R400,000",
    growth: "+10%",
    education: "Tourism, Languages, History",
    skills: ["Communication", "Cultural Knowledge", "Languages"],
    jobOutlook: "Good",
    description: "Guide tourists and provide information about attractions.",
    topEmployers: ["Tour Companies", "Self-employed", "Hotels"],
    provinces: ["Western Cape", "Gauteng", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Arts in Tourism", universities: ["UP", "UKZN", "UWC"] },
      { name: "Diploma in Tourism Management", universities: ["CPUT", "TUT"] },
    ],
  },

  // Creative Industries
  {
    title: "Graphic Designer",
    field: "Creative",
    averageSalary: "R250,000 - R450,000",
    growth: "+6%",
    education: "Graphic Design, Visual Arts",
    skills: ["Design Software", "Creativity", "Visual Communication"],
    jobOutlook: "Moderate",
    description: "Create visual concepts for print and digital media.",
    topEmployers: ["Design Agencies", "Marketing Companies", "Freelance"],
    provinces: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    courses: [
      { name: "Bachelor of Arts in Graphic Design", universities: ["Wits", "UP", "CPUT"] },
      { name: "Diploma in Graphic Design", universities: ["AAA", "Inscape"] },
    ],
  },
  {
    title: "Architect",
    field: "Creative",
    averageSalary: "R400,000 - R750,000",
    growth: "+7%",
    education: "Architecture",
    skills: ["Design", "Technical Drawing", "Project Management"],
    jobOutlook: "Good",
    description: "Design buildings and oversee construction projects.",
    topEmployers: ["Architectural Firms", "Construction Companies", "Government"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Architectural Studies", universities: ["UCT", "Wits", "UP", "UKZN"] },
      { name: "Master of Architecture", universities: ["UCT", "Wits", "UP"] },
    ],
  },

  // Social Services
  {
    title: "Social Worker",
    field: "Social Services",
    averageSalary: "R200,000 - R350,000",
    growth: "+11%",
    education: "Social Work",
    skills: ["Counseling", "Case Management", "Empathy"],
    jobOutlook: "Good",
    description: "Help individuals and families cope with social problems.",
    topEmployers: ["Government", "NGOs", "Hospitals", "Schools"],
    provinces: ["All provinces"],
    courses: [{ name: "Bachelor of Social Work", universities: ["UCT", "Wits", "UP", "Stellenbosch", "UKZN", "UFS"] }],
  },

  // Sports & Fitness
  {
    title: "Sports Scientist",
    field: "Sports",
    averageSalary: "R300,000 - R550,000",
    growth: "+9%",
    education: "Sports Science, Human Movement",
    skills: ["Exercise Physiology", "Performance Analysis", "Research"],
    jobOutlook: "Good",
    description: "Apply scientific principles to improve athletic performance.",
    topEmployers: ["Sports Teams", "High Performance Centers", "Universities"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Science in Sports Science", universities: ["UCT", "Wits", "UP", "Stellenbosch"] },
      { name: "Bachelor of Human Movement Science", universities: ["UCT", "Stellenbosch"] },
    ],
  },

  // Renewable Energy
  {
    title: "Solar Engineer",
    field: "Renewable Energy",
    averageSalary: "R450,000 - R750,000",
    growth: "+25%",
    education: "Electrical Engineering, Renewable Energy",
    skills: ["Solar Technology", "System Design", "Project Management"],
    jobOutlook: "Excellent",
    description: "Design and implement solar energy systems.",
    topEmployers: ["Solar Companies", "Engineering Firms", "Utilities"],
    provinces: ["Western Cape", "Northern Cape", "Gauteng"],
    courses: [
      {
        name: "Bachelor of Engineering in Electrical Engineering",
        universities: ["UCT", "Wits", "UP", "Stellenbosch"],
      },
      { name: "Postgraduate Diploma in Renewable Energy", universities: ["UCT", "Stellenbosch"] },
    ],
  },

  // Aviation
  {
    title: "Commercial Pilot",
    field: "Aviation",
    averageSalary: "R500,000 - R1,200,000",
    growth: "+5%",
    education: "Aviation, Commercial Pilot License",
    skills: ["Flying", "Navigation", "Decision Making"],
    jobOutlook: "Moderate",
    description: "Operate aircraft for passenger and cargo transport.",
    topEmployers: ["SAA", "Kulula", "FlySafair", "Private Aviation"],
    provinces: ["Gauteng", "Western Cape"],
    courses: [
      { name: "Bachelor of Commerce in Aviation Management", universities: ["UP"] },
      { name: "Commercial Pilot License", universities: ["Flight Schools"] },
    ],
  },

  // Food Science
  {
    title: "Food Scientist",
    field: "Food Science",
    averageSalary: "R350,000 - R600,000",
    growth: "+8%",
    education: "Food Science, Food Technology",
    skills: ["Food Safety", "Product Development", "Quality Control"],
    jobOutlook: "Good",
    description: "Develop and improve food products and processes.",
    topEmployers: ["Food Companies", "Government", "Research Institutions"],
    provinces: ["All provinces"],
    courses: [
      { name: "Bachelor of Science in Food Science", universities: ["Stellenbosch", "UP", "UKZN"] },
      { name: "Bachelor of Consumer Science in Food and Nutrition", universities: ["UP", "Stellenbosch"] },
    ],
  },
]

const industryTrends = [
  {
    industry: "Technology",
    growth: "+18%",
    hotJobs: ["AI Specialist", "Cybersecurity Analyst", "Cloud Architect"],
    description: "Rapid digital transformation driving demand for tech skills",
  },
  {
    industry: "Healthcare",
    growth: "+12%",
    hotJobs: ["Telemedicine Specialist", "Health Data Analyst", "Geriatrician"],
    description: "Aging population and health tech innovation creating opportunities",
  },
  {
    industry: "Renewable Energy",
    growth: "+25%",
    hotJobs: ["Solar Engineer", "Wind Technician", "Energy Storage Specialist"],
    description: "South Africa's renewable energy transition creating new careers",
  },
  {
    industry: "Financial Services",
    growth: "+8%",
    hotJobs: ["Fintech Developer", "Risk Analyst", "Digital Banking Specialist"],
    description: "Digital banking and fintech innovation driving growth",
  },
]

export default function CareerGuidancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState("all")
  const [selectedCareer, setSelectedCareer] = useState<(typeof careerData)[0] | null>(null)
  const [showCoursesModal, setShowCoursesModal] = useState(false)
  const [selectedCareerCourses, setSelectedCareerCourses] = useState<any>(null)

  const handleFindRelatedCourses = (career: any) => {
    setSelectedCareerCourses(career)
    setShowCoursesModal(true)
  }

  const filteredCareers = careerData.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.field.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === "all" || career.field === selectedField
    return matchesSearch && matchesField
  })

  const fields = [...new Set(careerData.map((career) => career.field))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Guidance Center</h1>
          <p className="text-xl text-gray-600">
            Explore career paths, salary expectations, and industry trends in South Africa
          </p>
        </div>

        <Tabs defaultValue="careers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="careers">Career Explorer</TabsTrigger>
            <TabsTrigger value="trends">Industry Trends</TabsTrigger>
            <TabsTrigger value="skills">Skills Development</TabsTrigger>
          </TabsList>

          <TabsContent value="careers" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search careers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      {fields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Career List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredCareers.map((career, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCareer?.title === career.title ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedCareer(career)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{career.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-1">
                            <Badge variant="outline">{career.field}</Badge>
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-green-600 text-sm">{career.growth}</span>
                            </span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm font-medium">
                            <DollarSign className="h-3 w-3" />
                            <span>{career.averageSalary}</span>
                          </div>
                          <Badge variant={career.jobOutlook === "Excellent" ? "default" : "secondary"} className="mt-1">
                            {career.jobOutlook}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {career.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Career Details */}
              <div className="space-y-4">
                {selectedCareer ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedCareer.title}</CardTitle>
                      <CardDescription>Detailed career information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>Education Required</span>
                        </h4>
                        <p className="text-sm text-gray-600">{selectedCareer.education}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>Key Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedCareer.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Top Employers</span>
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {selectedCareer.topEmployers.map((employer, i) => (
                            <li key={i}>• {employer}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Job Locations</span>
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedCareer.provinces.map((province, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {province}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => handleFindRelatedCourses(selectedCareer)}>
                        Find Related Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a career to view detailed information</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Industry Growth Trends</h2>
              <p className="text-gray-600">Stay ahead with insights into South Africa's fastest-growing industries</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {industryTrends.map((trend, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{trend.industry}</CardTitle>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {trend.growth}
                      </Badge>
                    </div>
                    <CardDescription>{trend.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-2">Hot Jobs:</h4>
                      <div className="flex flex-wrap gap-1">
                        {trend.hotJobs.map((job, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {job}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Skills Development</h2>
              <p className="text-gray-600">Build the skills employers are looking for</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>In-demand technical competencies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Programming", "Data Analysis", "Cloud Computing", "Cybersecurity", "AI/Machine Learning"].map(
                      (skill, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm">{skill}</span>
                          <Badge variant="secondary" className="text-xs">
                            High Demand
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Soft Skills</CardTitle>
                  <CardDescription>Essential workplace skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Communication", "Leadership", "Problem-solving", "Adaptability", "Teamwork"].map((skill, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">{skill}</span>
                        <Badge variant="outline" className="text-xs">
                          Essential
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry-Specific</CardTitle>
                  <CardDescription>Specialized knowledge areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "Financial Modeling",
                      "Project Management",
                      "Digital Marketing",
                      "Supply Chain",
                      "Quality Assurance",
                    ].map((skill, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">{skill}</span>
                        <Badge variant="secondary" className="text-xs">
                          Specialized
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Courses Modal */}
        {showCoursesModal && selectedCareerCourses && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Courses for {selectedCareerCourses.title}</h2>
                    <p className="text-gray-600 mt-2">Recommended educational pathways and top universities</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowCoursesModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {selectedCareerCourses.courses?.map((course: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>Available at {course.universities.length} top universities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {course.universities.map((uni: string, uniIndex: number) => {
                            const universityNames: { [key: string]: string } = {
                              UCT: "University of Cape Town",
                              Wits: "University of the Witwatersrand",
                              UP: "University of Pretoria",
                              Stellenbosch: "Stellenbosch University",
                              UKZN: "University of KwaZulu-Natal",
                              UFS: "University of the Free State",
                              UNISA: "University of South Africa",
                              UJ: "University of Johannesburg",
                              TUT: "Tshwane University of Technology",
                              CPUT: "Cape Peninsula University of Technology",
                              DUT: "Durban University of Technology",
                              UWC: "University of the Western Cape",
                              Rhodes: "Rhodes University",
                            }

                            return (
                              <div key={uniIndex} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm">{universityNames[uni] || uni}</h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {uni === "UCT" && "Ranking: #1 National"}
                                      {uni === "Wits" && "Ranking: #2 National"}
                                      {uni === "Stellenbosch" && "Ranking: #3 National"}
                                      {uni === "UP" && "Ranking: #4 National"}
                                      {uni === "UKZN" && "Ranking: #5 National"}
                                      {uni === "UFS" && "Ranking: #6 National"}
                                      {!["UCT", "Wits", "Stellenbosch", "UP", "UKZN", "UFS"].includes(uni) &&
                                        "Specialized Institution"}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {["UCT", "Wits", "Stellenbosch"].includes(uni) ? "Top Tier" : "Excellent"}
                                  </Badge>
                                </div>
                                <div className="mt-3 space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Duration:</span>
                                    <span>
                                      {course.name.includes("Bachelor")
                                        ? "3-4 years"
                                        : course.name.includes("Honours")
                                          ? "1 year"
                                          : course.name.includes("Masters")
                                            ? "1-2 years"
                                            : course.name.includes("PhD")
                                              ? "3-4 years"
                                              : course.name.includes("Diploma")
                                                ? "2-3 years"
                                                : "3-4 years"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Est. Fees:</span>
                                    <span>
                                      {["UCT", "Wits", "Stellenbosch"].includes(uni)
                                        ? "R45k-85k/year"
                                        : ["UP", "UKZN", "UFS"].includes(uni)
                                          ? "R40k-75k/year"
                                          : "R35k-65k/year"}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full mt-3 bg-transparent"
                                  variant="outline"
                                  onClick={() => window.open(`/university-comparison?filter=${uni}`, "_blank")}
                                >
                                  View University Details
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Application Tips for {selectedCareerCourses.title}
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Apply early - most universities have deadlines between July-September</li>
                    <li>• Check specific admission requirements for each university</li>
                    <li>• Consider NSFAS funding if you qualify for financial assistance</li>
                    <li>
                      • Look into bursaries offered by companies in the {selectedCareerCourses.field.toLowerCase()}{" "}
                      field
                    </li>
                    <li>• Ensure you meet the minimum APS and subject requirements</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setShowCoursesModal(false)}>
                    Close
                  </Button>
                  <Link href="/applications">
                    <Button>Start Application Process</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
