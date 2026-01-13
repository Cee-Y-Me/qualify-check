"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const questions = [
  {
    id: "personal_info",
    title: "Personal Information",
    questions: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: false },
      {
        id: "province",
        label: "Province",
        type: "select",
        required: true,
        options: [
          "Eastern Cape",
          "Free State",
          "Gauteng",
          "KwaZulu-Natal",
          "Limpopo",
          "Mpumalanga",
          "Northern Cape",
          "North West",
          "Western Cape",
        ],
      },
      {
        id: "financial_aid",
        label: "Do you need financial aid?",
        type: "radio",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: "career_interests",
    title: "Career Interests & Goals",
    questions: [
      {
        id: "career_field",
        label: "Which field interests you most?",
        type: "select",
        required: true,
        options: [
          "Engineering & Technology",
          "Health Sciences",
          "Business & Commerce",
          "Law",
          "Education",
          "Arts & Humanities",
          "Natural Sciences",
          "Social Sciences",
          "Agriculture",
        ],
      },
      { id: "career_goals", label: "Describe your career goals", type: "textarea", required: true },
      {
        id: "work_environment",
        label: "Preferred work environment",
        type: "radio",
        required: true,
        options: [
          "Office/Corporate",
          "Outdoors",
          "Laboratory/Research",
          "Healthcare facility",
          "Educational institution",
          "Creative studio",
        ],
      },
      {
        id: "skills",
        label: "What are your strongest skills?",
        type: "checkbox",
        required: true,
        options: [
          "Problem-solving",
          "Communication",
          "Leadership",
          "Creativity",
          "Analytical thinking",
          "Technical skills",
          "Teamwork",
          "Research",
          "Mathematics",
        ],
      },
    ],
  },
  {
    id: "study_preferences",
    title: "Study Preferences",
    questions: [
      {
        id: "study_duration",
        label: "Preferred study duration",
        type: "radio",
        required: true,
        options: ["3 years (Bachelor)", "4 years (Honours)", "5-6 years (Professional)", "Postgraduate studies"],
      },
      {
        id: "study_mode",
        label: "Preferred study mode",
        type: "radio",
        required: true,
        options: ["Full-time on campus", "Part-time", "Distance learning", "Blended learning"],
      },
      {
        id: "location_preference",
        label: "Location preference",
        type: "select",
        required: true,
        options: ["Same province", "Gauteng", "Western Cape", "KwaZulu-Natal", "Any province"],
      },
      {
        id: "university_size",
        label: "University size preference",
        type: "radio",
        required: false,
        options: [
          "Large university (30,000+ students)",
          "Medium university (10,000-30,000)",
          "Small university (<10,000)",
          "No preference",
        ],
      },
    ],
  },
]

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if qualification data exists
    const qualificationData = localStorage.getItem("qualificationData")
    if (!qualificationData) {
      router.push("/qualification")
    }
  }, [router])

  const currentQuestions = questions[currentSection]
  const progress = ((currentSection + 1) / questions.length) * 100

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentValues = prev[questionId] || []
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, option] }
      } else {
        return { ...prev, [questionId]: currentValues.filter((v: string) => v !== option) }
      }
    })
  }

  const isCurrentSectionComplete = () => {
    return currentQuestions.questions.every((q) => {
      if (!q.required) return true
      const answer = answers[q.id]
      if (q.type === "checkbox") {
        return answer && answer.length > 0
      }
      return answer && answer.trim() !== ""
    })
  }

  const handleNext = () => {
    if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const qualificationData = JSON.parse(localStorage.getItem("qualificationData") || "[]")

      const submissionData = {
        qualifications: qualificationData,
        questionnaire: answers,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/analyze-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      if (response.ok) {
        const results = await response.json()
        localStorage.setItem("recommendationResults", JSON.stringify(results))
        router.push("/results")
      } else {
        throw new Error("Failed to analyze profile")
      }
    } catch (error) {
      console.error("Error submitting data:", error)
      alert("There was an error processing your information. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = (question: any) => {
    const value = answers[question.id] || ""

    switch (question.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <Input
            type={question.type}
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={`Enter your ${question.label.toLowerCase()}`}
          />
        )

      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={`Describe your ${question.label.toLowerCase()}`}
            rows={4}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${question.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={(val) => handleInputChange(question.id, val)}>
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={(answers[question.id] || []).includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(question.id, option, checked as boolean)}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/qualification">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Qualifications</span>
            </Button>
          </Link>
          <div className="text-sm text-gray-600">Step 2 of 3</div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentQuestions.title}</span>
            <span>
              Section {currentSection + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentQuestions.title}</CardTitle>
            <CardDescription>
              Please provide accurate information to get the best university and course recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestions.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label className="text-base font-medium">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderQuestion(question)}
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isCurrentSectionComplete() || loading}
                className="flex items-center space-x-2"
              >
                <span>
                  {currentSection === questions.length - 1
                    ? loading
                      ? "Analyzing..."
                      : "Get Recommendations"
                    : "Next"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
