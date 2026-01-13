"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  User,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Award,
  Home,
  DollarSign,
} from "lucide-react"

interface ApplicationFormProps {
  userId: string
  universityId: string
  universityName: string
  courseId: string
  courseName: string
  onSubmit?: (applicationData: any) => void
  documents?: any[]
}

interface FormData {
  personalInfo: {
    firstName: string
    lastName: string
    idNumber: string
    email: string
    phone: string
    dateOfBirth: string
    nationality: string
    gender: string
    homeAddress: {
      street: string
      city: string
      province: string
      postalCode: string
    }
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  academicInfo: {
    matricYear: string
    schoolName: string
    schoolAddress: string
    matricResults: Array<{
      subject: string
      level: string
      mark: number
    }>
    previousStudy?: {
      institution: string
      qualification: string
      year: string
      completed: boolean
    }
    academicAchievements: string[]
  }
  applicationInfo: {
    studyMode: "full_time" | "part_time" | "distance"
    startDate: string
    motivationLetter: string
    careerGoals: string
    accommodationRequired: boolean
    accommodationType?: string
    financialAid: boolean
    financialAidType?: string[]
    disabilities?: string
    medicalConditions?: string
    extracurriculars: string[]
    workExperience?: Array<{
      company: string
      position: string
      duration: string
      description: string
    }>
  }
}

const SOUTH_AFRICAN_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
]

const MATRIC_SUBJECTS = [
  "English Home Language",
  "English First Additional Language",
  "Afrikaans Home Language",
  "Afrikaans First Additional Language",
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Accounting",
  "Business Studies",
  "Economics",
  "Geography",
  "History",
  "Life Orientation",
  "Information Technology",
  "Computer Applications Technology",
  "Visual Arts",
  "Music",
  "Dramatic Arts",
]

const ACCOMMODATION_TYPES = ["University Residence", "Private Accommodation", "Homestay", "Shared Apartment"]

const FINANCIAL_AID_TYPES = ["NSFAS", "University Bursary", "Private Bursary", "Study Loan", "Scholarship"]

export function ApplicationForm({
  userId,
  universityId,
  universityName,
  courseId,
  courseName,
  onSubmit,
  documents = [],
}: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      nationality: "South African",
      gender: "",
      homeAddress: {
        street: "",
        city: "",
        province: "",
        postalCode: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
    academicInfo: {
      matricYear: "",
      schoolName: "",
      schoolAddress: "",
      matricResults: [],
      academicAchievements: [],
    },
    applicationInfo: {
      studyMode: "full_time",
      startDate: "",
      motivationLetter: "",
      careerGoals: "",
      accommodationRequired: false,
      financialAid: false,
      extracurriculars: [],
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false])

  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      icon: User,
      description: "Basic personal details and contact information",
    },
    {
      id: "academic",
      title: "Academic History",
      icon: GraduationCap,
      description: "Educational background and qualifications",
    },
    {
      id: "application",
      title: "Application Details",
      icon: FileText,
      description: "Course preferences and additional information",
    },
    {
      id: "review",
      title: "Review & Submit",
      icon: CheckCircle,
      description: "Review your application before submission",
    },
  ]

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`application_${userId}_${universityId}_${courseId}`)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
      } catch (error) {
        console.error("Failed to load saved form data:", error)
      }
    }
  }, [userId, universityId, courseId])

  // Auto-save form data
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`application_${userId}_${universityId}_${courseId}`, JSON.stringify(formData))
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData, userId, universityId, courseId])

  // Validate current step
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    switch (stepIndex) {
      case 0: // Personal Info
        if (!formData.personalInfo.firstName) newErrors.firstName = "First name is required"
        if (!formData.personalInfo.lastName) newErrors.lastName = "Last name is required"
        if (!formData.personalInfo.idNumber) newErrors.idNumber = "ID number is required"
        if (!formData.personalInfo.email) newErrors.email = "Email is required"
        if (!formData.personalInfo.phone) newErrors.phone = "Phone number is required"
        if (!formData.personalInfo.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.personalInfo.gender) newErrors.gender = "Gender is required"
        break

      case 1: // Academic Info
        if (!formData.academicInfo.matricYear) newErrors.matricYear = "Matric year is required"
        if (!formData.academicInfo.schoolName) newErrors.schoolName = "School name is required"
        if (formData.academicInfo.matricResults.length === 0) {
          newErrors.matricResults = "At least one matric result is required"
        }
        break

      case 2: // Application Info
        if (!formData.applicationInfo.startDate) newErrors.startDate = "Start date is required"
        if (!formData.applicationInfo.motivationLetter || formData.applicationInfo.motivationLetter.length < 100) {
          newErrors.motivationLetter = "Motivation letter must be at least 100 characters"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const newCompletedSteps = [...completedSteps]
      newCompletedSteps[currentStep] = true
      setCompletedSteps(newCompletedSteps)
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0))
  }

  const addMatricResult = () => {
    setFormData((prev) => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        matricResults: [...prev.academicInfo.matricResults, { subject: "", level: "Higher Grade", mark: 0 }],
      },
    }))
  }

  const removeMatricResult = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        matricResults: prev.academicInfo.matricResults.filter((_, i) => i !== index),
      },
    }))
  }

  const updateMatricResult = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        matricResults: prev.academicInfo.matricResults.map((result, i) =>
          i === index ? { ...result, [field]: value } : result,
        ),
      },
    }))
  }

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      applicationInfo: {
        ...prev.applicationInfo,
        workExperience: [
          ...(prev.applicationInfo.workExperience || []),
          { company: "", position: "", duration: "", description: "" },
        ],
      },
    }))
  }

  const updateWorkExperience = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      applicationInfo: {
        ...prev.applicationInfo,
        workExperience: prev.applicationInfo.workExperience?.map((exp, i) =>
          i === index ? { ...exp, [field]: value } : exp,
        ),
      },
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setSubmitting(true)
    try {
      const applicationData = {
        userId,
        universityId,
        universityName,
        courseId,
        courseName,
        personalInfo: formData.personalInfo,
        academicInfo: formData.academicInfo,
        applicationInfo: formData.applicationInfo,
        documents: documents.map((doc) => doc.id),
        submittedAt: new Date().toISOString(),
      }

      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      if (result.success) {
        // Clear saved form data
        localStorage.removeItem(`application_${userId}_${universityId}_${courseId}`)
        onSubmit?.(result.application)
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error) {
      console.error("Application submission error:", error)
      setErrors({ submit: error instanceof Error ? error.message : "Submission failed" })
    } finally {
      setSubmitting(false)
    }
  }

  const getStepProgress = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.personalInfo.firstName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, firstName: e.target.value },
              }))
            }
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.personalInfo.lastName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, lastName: e.target.value },
              }))
            }
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="idNumber">ID Number *</Label>
          <Input
            id="idNumber"
            value={formData.personalInfo.idNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, idNumber: e.target.value },
              }))
            }
            placeholder="0000000000000"
            className={errors.idNumber ? "border-red-500" : ""}
          />
          {errors.idNumber && <p className="text-sm text-red-600">{errors.idNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value },
              }))
            }
            className={errors.dateOfBirth ? "border-red-500" : ""}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, email: e.target.value },
              }))
            }
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.personalInfo.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, phone: e.target.value },
              }))
            }
            placeholder="+27 00 000 0000"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Select
            value={formData.personalInfo.nationality}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, nationality: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="South African">South African</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={formData.personalInfo.gender}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, gender: value },
              }))
            }
          >
            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Home className="h-5 w-5 mr-2" />
          Home Address
        </h3>

        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={formData.personalInfo.homeAddress.street}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  homeAddress: { ...prev.personalInfo.homeAddress, street: e.target.value },
                },
              }))
            }
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.personalInfo.homeAddress.city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    homeAddress: { ...prev.personalInfo.homeAddress, city: e.target.value },
                  },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select
              value={formData.personalInfo.homeAddress.province}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    homeAddress: { ...prev.personalInfo.homeAddress, province: value },
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOUTH_AFRICAN_PROVINCES.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={formData.personalInfo.homeAddress.postalCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    homeAddress: { ...prev.personalInfo.homeAddress, postalCode: e.target.value },
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Contact Name</Label>
            <Input
              id="emergencyName"
              value={formData.personalInfo.emergencyContact.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    emergencyContact: { ...prev.personalInfo.emergencyContact, name: e.target.value },
                  },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Input
              id="emergencyRelationship"
              value={formData.personalInfo.emergencyContact.relationship}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  personalInfo: {
                    ...prev.personalInfo,
                    emergencyContact: { ...prev.personalInfo.emergencyContact, relationship: e.target.value },
                  },
                }))
              }
              placeholder="e.g., Parent, Guardian, Spouse"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Contact Phone</Label>
          <Input
            id="emergencyPhone"
            value={formData.personalInfo.emergencyContact.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: {
                  ...prev.personalInfo,
                  emergencyContact: { ...prev.personalInfo.emergencyContact, phone: e.target.value },
                },
              }))
            }
            placeholder="+27 00 000 0000"
          />
        </div>
      </div>
    </div>
  )

  const renderAcademicInfoStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="matricYear">Matric Year *</Label>
          <Select
            value={formData.academicInfo.matricYear}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                academicInfo: { ...prev.academicInfo, matricYear: value },
              }))
            }
          >
            <SelectTrigger className={errors.matricYear ? "border-red-500" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {errors.matricYear && <p className="text-sm text-red-600">{errors.matricYear}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name *</Label>
          <Input
            id="schoolName"
            value={formData.academicInfo.schoolName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                academicInfo: { ...prev.academicInfo, schoolName: e.target.value },
              }))
            }
            className={errors.schoolName ? "border-red-500" : ""}
          />
          {errors.schoolName && <p className="text-sm text-red-600">{errors.schoolName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolAddress">School Address</Label>
        <Input
          id="schoolAddress"
          value={formData.academicInfo.schoolAddress}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              academicInfo: { ...prev.academicInfo, schoolAddress: e.target.value },
            }))
          }
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Matric Results *
          </h3>
          <Button type="button" onClick={addMatricResult} variant="outline" size="sm">
            Add Subject
          </Button>
        </div>

        {errors.matricResults && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errors.matricResults}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {formData.academicInfo.matricResults.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="grid md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={result.subject} onValueChange={(value) => updateMatricResult(index, "subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {MATRIC_SUBJECTS.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={result.level} onValueChange={(value) => updateMatricResult(index, "level", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Higher Grade">Higher Grade</SelectItem>
                      <SelectItem value="Standard Grade">Standard Grade</SelectItem>
                      <SelectItem value="Foundation">Foundation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mark (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={result.mark || ""}
                    onChange={(e) => updateMatricResult(index, "mark", Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMatricResult(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Previous Tertiary Study (Optional)
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="previousInstitution">Institution</Label>
            <Input
              id="previousInstitution"
              value={formData.academicInfo.previousStudy?.institution || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  academicInfo: {
                    ...prev.academicInfo,
                    previousStudy: {
                      ...prev.academicInfo.previousStudy,
                      institution: e.target.value,
                      qualification: prev.academicInfo.previousStudy?.qualification || "",
                      year: prev.academicInfo.previousStudy?.year || "",
                      completed: prev.academicInfo.previousStudy?.completed || false,
                    },
                  },
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousQualification">Qualification</Label>
            <Input
              id="previousQualification"
              value={formData.academicInfo.previousStudy?.qualification || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  academicInfo: {
                    ...prev.academicInfo,
                    previousStudy: {
                      ...prev.academicInfo.previousStudy,
                      institution: prev.academicInfo.previousStudy?.institution || "",
                      qualification: e.target.value,
                      year: prev.academicInfo.previousStudy?.year || "",
                      completed: prev.academicInfo.previousStudy?.completed || false,
                    },
                  },
                }))
              }
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="previousYear">Year</Label>
            <Input
              id="previousYear"
              value={formData.academicInfo.previousStudy?.year || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  academicInfo: {
                    ...prev.academicInfo,
                    previousStudy: {
                      ...prev.academicInfo.previousStudy,
                      institution: prev.academicInfo.previousStudy?.institution || "",
                      qualification: prev.academicInfo.previousStudy?.qualification || "",
                      year: e.target.value,
                      completed: prev.academicInfo.previousStudy?.completed || false,
                    },
                  },
                }))
              }
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="previousCompleted"
              checked={formData.academicInfo.previousStudy?.completed || false}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  academicInfo: {
                    ...prev.academicInfo,
                    previousStudy: {
                      ...prev.academicInfo.previousStudy,
                      institution: prev.academicInfo.previousStudy?.institution || "",
                      qualification: prev.academicInfo.previousStudy?.qualification || "",
                      year: prev.academicInfo.previousStudy?.year || "",
                      completed: checked as boolean,
                    },
                  },
                }))
              }
            />
            <Label htmlFor="previousCompleted">Qualification completed</Label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderApplicationInfoStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studyMode">Study Mode</Label>
          <Select
            value={formData.applicationInfo.studyMode}
            onValueChange={(value: "full_time" | "part_time" | "distance") =>
              setFormData((prev) => ({
                ...prev,
                applicationInfo: { ...prev.applicationInfo, studyMode: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="distance">Distance Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Preferred Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.applicationInfo.startDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                applicationInfo: { ...prev.applicationInfo, startDate: e.target.value },
              }))
            }
            className={errors.startDate ? "border-red-500" : ""}
          />
          {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivationLetter">Motivation Letter *</Label>
        <Textarea
          id="motivationLetter"
          value={formData.applicationInfo.motivationLetter}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              applicationInfo: { ...prev.applicationInfo, motivationLetter: e.target.value },
            }))
          }
          placeholder="Explain why you want to study this course and why you would be a good candidate..."
          rows={6}
          className={errors.motivationLetter ? "border-red-500" : ""}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formData.applicationInfo.motivationLetter.length} characters</span>
          <span>Minimum 100 characters required</span>
        </div>
        {errors.motivationLetter && <p className="text-sm text-red-600">{errors.motivationLetter}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="careerGoals">Career Goals</Label>
        <Textarea
          id="careerGoals"
          value={formData.applicationInfo.careerGoals}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              applicationInfo: { ...prev.applicationInfo, careerGoals: e.target.value },
            }))
          }
          placeholder="Describe your career aspirations and how this course will help you achieve them..."
          rows={4}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Home className="h-5 w-5 mr-2" />
          Accommodation
        </h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="accommodationRequired"
            checked={formData.applicationInfo.accommodationRequired}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                applicationInfo: { ...prev.applicationInfo, accommodationRequired: checked as boolean },
              }))
            }
          />
          <Label htmlFor="accommodationRequired">I require accommodation</Label>
        </div>

        {formData.applicationInfo.accommodationRequired && (
          <div className="space-y-2">
            <Label htmlFor="accommodationType">Preferred Accommodation Type</Label>
            <Select
              value={formData.applicationInfo.accommodationType || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  applicationInfo: { ...prev.applicationInfo, accommodationType: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select accommodation type" />
              </SelectTrigger>
              <SelectContent>
                {ACCOMMODATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Financial Aid
        </h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="financialAid"
            checked={formData.applicationInfo.financialAid}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                applicationInfo: { ...prev.applicationInfo, financialAid: checked as boolean },
              }))
            }
          />
          <Label htmlFor="financialAid">I require financial aid</Label>
        </div>

        {formData.applicationInfo.financialAid && (
          <div className="space-y-2">
            <Label>Financial Aid Types (select all that apply)</Label>
            <div className="grid md:grid-cols-2 gap-2">
              {FINANCIAL_AID_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`financialAid_${type}`}
                    checked={formData.applicationInfo.financialAidType?.includes(type) || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = formData.applicationInfo.financialAidType || []
                      const newTypes = checked ? [...currentTypes, type] : currentTypes.filter((t) => t !== type)

                      setFormData((prev) => ({
                        ...prev,
                        applicationInfo: { ...prev.applicationInfo, financialAidType: newTypes },
                      }))
                    }}
                  />
                  <Label htmlFor={`financialAid_${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>

        <div className="space-y-2">
          <Label htmlFor="disabilities">Disabilities or Special Needs</Label>
          <Textarea
            id="disabilities"
            value={formData.applicationInfo.disabilities || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                applicationInfo: { ...prev.applicationInfo, disabilities: e.target.value },
              }))
            }
            placeholder="Please describe any disabilities or special accommodations you may need..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalConditions">Medical Conditions</Label>
          <Textarea
            id="medicalConditions"
            value={formData.applicationInfo.medicalConditions || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                applicationInfo: { ...prev.applicationInfo, medicalConditions: e.target.value },
              }))
            }
            placeholder="Please describe any medical conditions that may affect your studies..."
            rows={3}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Work Experience (Optional)</h3>

        <Button type="button" onClick={addWorkExperience} variant="outline" size="sm">
          Add Work Experience
        </Button>

        <div className="space-y-4">
          {formData.applicationInfo.workExperience?.map((exp, index) => (
            <Card key={index} className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={exp.company} onChange={(e) => updateWorkExperience(index, "company", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateWorkExperience(index, "position", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={exp.duration}
                    onChange={(e) => updateWorkExperience(index, "duration", e.target.value)}
                    placeholder="e.g., Jan 2020 - Dec 2021"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Please review all information carefully before submitting your application.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Name:</strong> {formData.personalInfo.firstName} {formData.personalInfo.lastName}
            </div>
            <div>
              <strong>ID Number:</strong> {formData.personalInfo.idNumber}
            </div>
            <div>
              <strong>Email:</strong> {formData.personalInfo.email}
            </div>
            <div>
              <strong>Phone:</strong> {formData.personalInfo.phone}
            </div>
            <div>
              <strong>Date of Birth:</strong> {formData.personalInfo.dateOfBirth}
            </div>
            <div>
              <strong>Gender:</strong> {formData.personalInfo.gender}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Matric Year:</strong> {formData.academicInfo.matricYear}
            </div>
            <div>
              <strong>School:</strong> {formData.academicInfo.schoolName}
            </div>
          </div>

          <div>
            <strong>Matric Results:</strong>
            <div className="mt-2 space-y-1">
              {formData.academicInfo.matricResults.map((result, index) => (
                <div key={index} className="text-sm">
                  {result.subject} ({result.level}): {result.mark}%
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>University:</strong> {universityName}
            </div>
            <div>
              <strong>Course:</strong> {courseName}
            </div>
            <div>
              <strong>Study Mode:</strong> {formData.applicationInfo.studyMode.replace("_", " ")}
            </div>
            <div>
              <strong>Start Date:</strong> {formData.applicationInfo.startDate}
            </div>
            <div>
              <strong>Accommodation:</strong>{" "}
              {formData.applicationInfo.accommodationRequired ? "Required" : "Not required"}
            </div>
            <div>
              <strong>Financial Aid:</strong> {formData.applicationInfo.financialAid ? "Required" : "Not required"}
            </div>
          </div>

          <div>
            <strong>Motivation Letter:</strong>
            <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
              {formData.applicationInfo.motivationLetter.substring(0, 200)}
              {formData.applicationInfo.motivationLetter.length > 200 && "..."}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{doc.originalName}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No documents uploaded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {errors.submit && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
        </Alert>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                {universityName} - {courseName}
              </CardDescription>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={getStepProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className="grid md:grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = completedSteps[index]
          const isAccessible = index <= currentStep

          return (
            <Card
              key={step.id}
              className={`cursor-pointer transition-colors ${
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : isCompleted
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
              } ${!isAccessible ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => isAccessible && setCurrentStep(index)}
            >
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div>
                    <p
                      className={`font-medium text-sm ${
                        isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-900"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {React.createElement(steps[currentStep].icon, { className: "h-5 w-5 mr-2" })}
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && renderPersonalInfoStep()}
          {currentStep === 1 && renderAcademicInfoStep()}
          {currentStep === 2 && renderApplicationInfoStep()}
          {currentStep === 3 && renderReviewStep()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>

        <div className="space-x-2">
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
