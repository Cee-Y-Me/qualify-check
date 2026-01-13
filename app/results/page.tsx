"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, MapPin, Clock, DollarSign, Star, ExternalLink, Download } from "lucide-react"
import Link from "next/link"

interface University {
  name: string
  location: string
  type: string
  ranking: number
  website: string
  description: string
}

interface Course {
  name: string
  university: string
  faculty: string
  duration: string
  requirements: string[]
  fees: string
  matchScore: number
  description: string
  careerProspects: string[]
}

interface RecommendationResults {
  matchScore: number
  topUniversities: University[]
  recommendedCourses: Course[]
  alternativeCourses: Course[]
  insights: string[]
  requirements: {
    met: string[]
    missing: string[]
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<RecommendationResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const resultsData = localStorage.getItem("recommendationResults")
    if (!resultsData) {
      router.push("/qualification")
      return
    }

    try {
      const parsedResults = JSON.parse(resultsData)
      setResults(parsedResults)
    } catch (error) {
      console.error("Error parsing results:", error)
      router.push("/qualification")
    } finally {
      setLoading(false)
    }
  }, [router])

  const downloadResults = () => {
    if (!results) return

    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "university-recommendations.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found</p>
          <Link href="/qualification">
            <Button>Start Over</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/questionnaire">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Questionnaire</span>
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={downloadResults} className="flex items-center space-x-2 bg-transparent">
              <Download className="h-4 w-4" />
              <span>Download Results</span>
            </Button>
            <div className="text-sm text-gray-600">Step 3 of 3</div>
          </div>
        </div>

        {/* Match Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your University Match Score
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {results.matchScore}% Match
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={results.matchScore} className="h-4 mb-4" />
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Requirements Met:</h4>
                <ul className="space-y-1">
                  {results.requirements.met.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {results.requirements.missing.length > 0 && (
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">Areas for Improvement:</h4>
                  <ul className="space-y-1">
                    {results.requirements.missing.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Results */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Recommended Courses</TabsTrigger>
            <TabsTrigger value="universities">Top Universities</TabsTrigger>
            <TabsTrigger value="insights">Insights & Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">Best Course Matches</h3>
              <div className="grid gap-6">
                {results.recommendedCourses.map((course, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{course.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{course.university}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{course.fees}</span>
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Star className="h-3 w-3 mr-1" />
                          {course.matchScore}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{course.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-semibold mb-2">Requirements:</h5>
                          <ul className="text-sm space-y-1">
                            {course.requirements.map((req, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Career Prospects:</h5>
                          <ul className="text-sm space-y-1">
                            {course.careerProspects.map((career, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                <span>{career}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{course.faculty}</Badge>
                        <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {results.alternativeCourses.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Alternative Options</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.alternativeCourses.map((course, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>{course.university}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{course.matchScore}% Match</Badge>
                          <Button variant="ghost" size="sm">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="universities" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Top University Matches</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {results.topUniversities.map((university, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{university.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{university.location}</span>
                          </span>
                          <Badge variant="outline">{university.type}</Badge>
                        </CardDescription>
                      </div>
                      <Badge variant="default">#{university.ranking}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{university.description}</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Website
                      </Button>
                      <Button size="sm">View Courses</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <h3 className="text-2xl font-bold mb-4">Personalized Insights & Recommendations</h3>
            <div className="space-y-4">
              {results.insights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="text-gray-700">{insight}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-800">
                  <li>• Research your recommended universities and courses in detail</li>
                  <li>• Check application deadlines and requirements</li>
                  <li>• Prepare necessary documents (ID, certificates, etc.)</li>
                  <li>• Apply for financial aid if needed</li>
                  <li>• Consider visiting university campuses</li>
                  <li>• Speak to current students or career counselors</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Link href="/qualification">
            <Button variant="outline">Start New Assessment</Button>
          </Link>
          <Button>Save Results</Button>
          <Button variant="outline">Share Results</Button>
        </div>
      </div>
    </div>
  )
}
