"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  University,
  Calendar,
  DollarSign,
  User,
  GraduationCap,
  Loader2,
} from "lucide-react"
import { DocumentManager } from "@/components/document-manager"
import { ApplicationForm } from "@/components/application-form"

interface Application {
  id: string
  userId: string
  universityId: string
  universityName: string
  courseId: string
  courseName: string
  applicationData: any
  documents: string[]
  status: "draft" | "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted"
  submittedDate: string | null
  lastUpdated: string
  applicationFee: number
  paymentStatus: "pending" | "paid" | "failed"
  applicationNumber?: string
  reviewNotes?: string
  integrationStatus?: "direct" | "fallback" | "manual"
}

interface StatusUpdate {
  date: string
  status: string
  message: string
  details: string
}

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  waitlisted: "bg-purple-100 text-purple-800",
}

const STATUS_ICONS = {
  draft: FileText,
  submitted: Clock,
  under_review: AlertCircle,
  accepted: CheckCircle,
  rejected: XCircle,
  waitlisted: Clock,
}

const MOCK_UNIVERSITIES = [
  { id: "uct_001", name: "University of Cape Town", code: "UCT" },
  { id: "wits_001", name: "University of the Witwatersrand", code: "WITS" },
  { id: "sun_001", name: "Stellenbosch University", code: "SUN" },
  { id: "up_001", name: "University of Pretoria", code: "UP" },
]

const MOCK_COURSES = [
  { id: "bcom_001", name: "Bachelor of Commerce", faculty: "Commerce" },
  { id: "bsc_001", name: "Bachelor of Science", faculty: "Science" },
  { id: "ba_001", name: "Bachelor of Arts", faculty: "Humanities" },
  { id: "beng_001", name: "Bachelor of Engineering", faculty: "Engineering" },
]

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showNewApplication, setShowNewApplication] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: StatusUpdate[] }>({})
  const [refreshing, setRefreshing] = useState<string | null>(null)

  // Mock user ID - in production, get from authentication
  const userId = "user_123"

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/applications/submit?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatusUpdates = async (applicationId: string, universityCode: string) => {
    setRefreshing(applicationId)
    try {
      const response = await fetch(
        `/api/applications/status?applicationId=${applicationId}&universityCode=${universityCode}`,
      )
      const data = await response.json()

      if (data.success) {
        setStatusUpdates((prev) => ({
          ...prev,
          [applicationId]: data.updates,
        }))

        // Update application status if changed
        if (data.currentStatus) {
          setApplications((prev) =>
            prev.map((app) =>
              app.id === applicationId
                ? { ...app, status: data.currentStatus, lastUpdated: data.lastUpdated || app.lastUpdated }
                : app,
            ),
          )
        }
      }
    } catch (error) {
      console.error("Failed to fetch status updates:", error)
    } finally {
      setRefreshing(null)
    }
  }

  const handleNewApplication = (applicationData: any) => {
    setApplications((prev) => [applicationData, ...prev])
    setShowNewApplication(false)
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    const counts = applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return {
      total: applications.length,
      draft: counts.draft || 0,
      submitted: counts.submitted || 0,
      under_review: counts.under_review || 0,
      accepted: counts.accepted || 0,
      rejected: counts.rejected || 0,
      waitlisted: counts.waitlisted || 0,
    }
  }

  const ApplicationCard = ({ application }: { application: Application }) => {
    const StatusIcon = STATUS_ICONS[application.status]
    const universityCode = application.universityId.split("_")[0]

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <University className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{application.universityName}</CardTitle>
                <CardDescription>{application.courseName}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={STATUS_COLORS[application.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {application.status.replace("_", " ")}
              </Badge>
              {application.integrationStatus && (
                <Badge variant="outline" className="text-xs">
                  {application.integrationStatus}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>App #: {application.applicationNumber || "Pending"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {application.submittedDate
                  ? `Submitted: ${new Date(application.submittedDate).toLocaleDateString()}`
                  : "Draft"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>Fee: R{application.applicationFee}</span>
              <Badge
                variant={application.paymentStatus === "paid" ? "default" : "outline"}
                className={`text-xs ${
                  application.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : application.paymentStatus === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {application.paymentStatus}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {application.reviewNotes && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">{application.reviewNotes}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedApplication(application)}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>

              {application.status !== "draft" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fetchStatusUpdates(application.id, universityCode)}
                  disabled={refreshing === application.id}
                >
                  {refreshing === application.id ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Refresh Status
                </Button>
              )}
            </div>

            <div className="text-xs text-gray-500">{application.documents.length} documents uploaded</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ApplicationDetails = ({ application }: { application: Application }) => {
    const universityCode = application.universityId.split("_")[0]
    const updates = statusUpdates[application.id] || []

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{application.universityName}</h2>
            <p className="text-gray-600">{application.courseName}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedApplication(null)}>
            Close
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Application Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Application Number:</span>
                <p className="text-sm text-gray-600">{application.applicationNumber || "Pending"}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <div className="mt-1">
                  <Badge className={STATUS_COLORS[application.status]}>{application.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <div>
                <span className="font-medium">Submitted:</span>
                <p className="text-sm text-gray-600">
                  {application.submittedDate
                    ? new Date(application.submittedDate).toLocaleDateString()
                    : "Not submitted"}
                </p>
              </div>
              <div>
                <span className="font-medium">Application Fee:</span>
                <p className="text-sm text-gray-600">R{application.applicationFee}</p>
              </div>
              <div>
                <span className="font-medium">Payment Status:</span>
                <div className="mt-1">
                  <Badge
                    variant={application.paymentStatus === "paid" ? "default" : "outline"}
                    className={`text-xs ${
                      application.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : application.paymentStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {application.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.applicationData?.personalInfo && (
                <>
                  <div>
                    <span className="font-medium">Name:</span>
                    <p className="text-sm text-gray-600">
                      {application.applicationData.personalInfo.firstName}{" "}
                      {application.applicationData.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-sm text-gray-600">{application.applicationData.personalInfo.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p className="text-sm text-gray-600">{application.applicationData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium">ID Number:</span>
                    <p className="text-sm text-gray-600">{application.applicationData.personalInfo.idNumber}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Academic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.applicationData?.academicInfo && (
                <>
                  <div>
                    <span className="font-medium">Matric Year:</span>
                    <p className="text-sm text-gray-600">{application.applicationData.academicInfo.matricYear}</p>
                  </div>
                  <div>
                    <span className="font-medium">School:</span>
                    <p className="text-sm text-gray-600">{application.applicationData.academicInfo.schoolName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Subjects:</span>
                    <div className="mt-1 space-y-1">
                      {application.applicationData.academicInfo.matricResults
                        ?.slice(0, 3)
                        .map((result: any, index: number) => (
                          <p key={index} className="text-xs text-gray-600">
                            {result.subject}: {result.mark}%
                          </p>
                        ))}
                      {application.applicationData.academicInfo.matricResults?.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{application.applicationData.academicInfo.matricResults.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="status" className="space-y-4">
          <TabsList>
            <TabsTrigger value="status">Status Updates</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="details">Full Details</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Application Status Timeline</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchStatusUpdates(application.id, universityCode)}
                disabled={refreshing === application.id}
              >
                {refreshing === application.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" />
                )}
                Refresh
              </Button>
            </div>

            {updates.length > 0 ? (
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{update.message}</h4>
                            <span className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{update.details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No status updates available</p>
                  <p className="text-sm text-gray-500">Check back later for updates on your application</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManager
              userId={application.userId}
              applicationId={application.id}
              universityCode={universityCode}
            />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
                  {JSON.stringify(application.applicationData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (showNewApplication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowNewApplication(false)} className="mb-4">
            ← Back to Applications
          </Button>
          <h1 className="text-3xl font-bold">New Application</h1>
          <p className="text-gray-600">Start a new university application</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Select University</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_UNIVERSITIES.map((university) => (
                  <Button
                    key={university.id}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      // In a real app, this would navigate to course selection
                      console.log("Selected university:", university)
                    }}
                  >
                    <University className="h-4 w-4 mr-2" />
                    {university.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <span className="text-sm">Choose your university and course</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <span className="text-sm">Upload required documents</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <span className="text-sm">Complete application form</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <span className="text-sm">Submit and pay application fee</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* For demo purposes, show application form directly */}
        <ApplicationForm
          userId={userId}
          universityId="uct_001"
          universityName="University of Cape Town"
          courseId="bcom_001"
          courseName="Bachelor of Commerce"
          onSubmit={handleNewApplication}
        />
      </div>
    )
  }

  if (selectedApplication) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ApplicationDetails application={selectedApplication} />
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-600">Track and manage your university applications</p>
        </div>
        <Button onClick={() => setShowNewApplication(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{statusCounts.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.draft}</div>
              <div className="text-sm text-gray-600">Draft</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.submitted}</div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.under_review}</div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.accepted}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't started any applications yet"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setShowNewApplication(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Application
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
