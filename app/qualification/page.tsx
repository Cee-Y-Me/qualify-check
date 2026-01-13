"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Upload, Edit } from "lucide-react"
import Link from "next/link"
import { PDFUpload } from "@/components/pdf-upload"

const subjects = [
  "English Home Language",
  "English First Additional Language",
  "Afrikaans Home Language",
  "Afrikaans First Additional Language",
  "Mathematics",
  "Mathematical Literacy",
  "Physical Sciences",
  "Life Sciences",
  "Geography",
  "History",
  "Business Studies",
  "Economics",
  "Accounting",
  "Life Orientation",
  "Information Technology",
  "Computer Applications Technology",
  "Engineering Graphics and Design",
  "Visual Arts",
  "Music",
  "Dramatic Arts",
]

interface SubjectMark {
  subject: string
  mark: string
  level: string
}

export default function QualificationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([
    { subject: "", mark: "", level: "Higher Grade" },
    { subject: "", mark: "", level: "Higher Grade" },
    { subject: "", mark: "", level: "Higher Grade" },
    { subject: "", mark: "", level: "Higher Grade" },
    { subject: "", mark: "", level: "Higher Grade" },
    { subject: "", mark: "", level: "Higher Grade" },
    { subject: "", mark: "", level: "Higher Grade" },
  ])

  const updateSubjectMark = (index: number, field: keyof SubjectMark, value: string) => {
    const updated = [...subjectMarks]
    updated[index] = { ...updated[index], [field]: value }
    setSubjectMarks(updated)
  }

  const addSubject = () => {
    if (subjectMarks.length < 10) {
      setSubjectMarks([...subjectMarks, { subject: "", mark: "", level: "Higher Grade" }])
    }
  }

  const removeSubject = (index: number) => {
    if (subjectMarks.length > 6) {
      const updated = subjectMarks.filter((_, i) => i !== index)
      setSubjectMarks(updated)
    }
  }

  const handlePDFExtraction = (extractedSubjects: SubjectMark[]) => {
    // Pad with empty subjects if needed to maintain minimum of 7 rows
    const paddedSubjects = [...extractedSubjects]
    while (paddedSubjects.length < 7) {
      paddedSubjects.push({ subject: "", mark: "", level: "Higher Grade" })
    }

    setSubjectMarks(paddedSubjects)
    setActiveTab("manual") // Switch to manual tab for review/editing
  }

  const handleSubmit = async () => {
    const validMarks = subjectMarks.filter((sm) => sm.subject && sm.mark)

    if (validMarks.length < 6) {
      alert("Please enter at least 6 subjects with marks")
      return
    }

    // Store in localStorage for now
    localStorage.setItem("qualificationData", JSON.stringify(validMarks))
    router.push("/questionnaire")
  }

  const filledSubjects = subjectMarks.filter((sm) => sm.subject && sm.mark).length
  const progress = (filledSubjects / 6) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <div className="text-sm text-gray-600">Step 1 of 3</div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Grade 12 Qualifications</span>
            <span>{filledSubjects}/6 subjects minimum</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload PDF</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <PDFUpload onSubjectsExtracted={handlePDFExtraction} />
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Grade 12 Results</CardTitle>
                <CardDescription>
                  Please enter your final Grade 12 marks for each subject. You need at least 6 subjects including the
                  compulsory subjects.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subjectMarks.map((subjectMark, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor={`subject-${index}`}>Subject</Label>
                      <Select
                        value={subjectMark.subject}
                        onValueChange={(value) => updateSubjectMark(index, "subject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`mark-${index}`}>Mark (%)</Label>
                      <Input
                        id={`mark-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={subjectMark.mark}
                        onChange={(e) => updateSubjectMark(index, "mark", e.target.value)}
                        placeholder="0-100"
                      />
                    </div>

                    <div className="flex items-end">
                      {index >= 6 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSubject(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {subjectMarks.length < 10 && (
                  <Button variant="outline" onClick={addSubject} className="w-full bg-transparent">
                    Add Another Subject
                  </Button>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You need at least 6 subjects to qualify for university admission</li>
                    <li>• English (Home or First Additional Language) is compulsory</li>
                    <li>• Mathematics or Mathematical Literacy is required</li>
                    <li>• Life Orientation is compulsory but doesn't count towards admission</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={filledSubjects < 6} className="flex items-center space-x-2">
                    <span>Continue to Questionnaire</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
