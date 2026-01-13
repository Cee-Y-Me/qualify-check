"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye, Download, RefreshCw, Cloud, CloudOff } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface Document {
  id: string
  userId: string
  category: string
  filename: string
  originalName: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  verified: boolean
  universityDocumentId?: string
  applicationId?: string
}

interface DocumentManagerProps {
  userId: string
  applicationId?: string
  universityCode?: string
  onDocumentsChange?: (documents: Document[]) => void
}

const DOCUMENT_CATEGORIES = [
  { id: "id_document", name: "ID Document", required: true, description: "Copy of South African ID or passport" },
  { id: "matric_certificate", name: "Matric Certificate", required: true, description: "National Senior Certificate" },
  {
    id: "academic_transcripts",
    name: "Academic Transcripts",
    required: true,
    description: "Official academic records",
  },
  {
    id: "motivation_letter",
    name: "Motivation Letter",
    required: false,
    description: "Personal statement or motivation letter",
  },
  {
    id: "proof_of_address",
    name: "Proof of Address",
    required: false,
    description: "Recent utility bill or bank statement",
  },
  {
    id: "medical_certificate",
    name: "Medical Certificate",
    required: false,
    description: "Medical fitness certificate (if required)",
  },
  { id: "portfolio", name: "Portfolio", required: false, description: "Creative portfolio (for relevant courses)" },
  { id: "cv", name: "Curriculum Vitae", required: false, description: "Current CV or resume" },
]

export function DocumentManager({ userId, applicationId, universityCode, onDocumentsChange }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch existing documents
  useEffect(() => {
    fetchDocuments()
  }, [userId])

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents/upload?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setDocuments(data.documents)
        onDocumentsChange?.(data.documents)
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[], category: string) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(category)
      setUploadProgress(0)
      setError(null)

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("userId", userId)
        formData.append("category", category)

        if (applicationId) {
          formData.append("applicationId", applicationId)
        }

        if (universityCode) {
          formData.append("universityCode", universityCode)
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        const response = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        const data = await response.json()

        if (data.success) {
          setDocuments((prev) => {
            const filtered = prev.filter((doc) => doc.category !== category)
            return [...filtered, data.document]
          })
          onDocumentsChange?.(documents)

          setTimeout(() => {
            setUploading(null)
            setUploadProgress(0)
          }, 1000)
        } else {
          throw new Error(data.error || "Upload failed")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Upload failed")
        setUploading(null)
        setUploadProgress(0)
      }
    },
    [userId, applicationId, universityCode, documents, onDocumentsChange],
  )

  const removeDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
        onDocumentsChange?.(documents.filter((doc) => doc.id !== documentId))
      }
    } catch (error) {
      console.error("Failed to remove document:", error)
    }
  }

  const getDocumentsByCategory = (category: string) => {
    return documents.filter((doc) => doc.category === category)
  }

  const getUploadProgress = () => {
    const requiredDocs = DOCUMENT_CATEGORIES.filter((cat) => cat.required)
    const uploadedRequired = requiredDocs.filter((cat) => documents.some((doc) => doc.category === cat.id))
    return (uploadedRequired.length / requiredDocs.length) * 100
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const DocumentUploadZone = ({ category }: { category: (typeof DOCUMENT_CATEGORIES)[0] }) => {
    const existingDoc = getDocumentsByCategory(category.id)[0]
    const isUploading = uploading === category.id

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, category.id),
      accept: {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
      disabled: isUploading || !!existingDoc,
    })

    if (existingDoc) {
      return (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">{existingDoc.originalName}</p>
                  <p className="text-sm text-green-700">
                    {formatFileSize(existingDoc.fileSize)} • Uploaded{" "}
                    {new Date(existingDoc.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {existingDoc.verified ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Cloud className="h-3 w-3 mr-1" />
                        Synced with University
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 text-xs">
                        <CloudOff className="h-3 w-3 mr-1" />
                        Local Only
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeDocument(existingDoc.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } ${isUploading ? "opacity-50" : ""}`}
      >
        <CardContent className="pt-6">
          <div {...getRootProps()} className="cursor-pointer text-center py-8">
            <input {...getInputProps()} />

            {isUploading ? (
              <div className="space-y-4">
                <RefreshCw className="h-8 w-8 text-blue-600 mx-auto animate-spin" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Uploading...</p>
                  <Progress value={uploadProgress} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isDragActive ? "Drop file here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPEG, PNG up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Document Upload Progress</span>
            <Badge variant="outline">{Math.round(getUploadProgress())}% Complete</Badge>
          </CardTitle>
          <CardDescription>Upload all required documents to complete your application</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={getUploadProgress()} className="mb-4" />
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{documents.length} documents uploaded</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cloud className="h-4 w-4 text-blue-600" />
              <span>{documents.filter((doc) => doc.verified).length} synced with universities</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span>{DOCUMENT_CATEGORIES.filter((cat) => cat.required).length} required documents</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Document Categories */}
      <Tabs defaultValue="required" className="space-y-4">
        <TabsList>
          <TabsTrigger value="required">Required Documents</TabsTrigger>
          <TabsTrigger value="optional">Optional Documents</TabsTrigger>
          <TabsTrigger value="all">All Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="required" className="space-y-4">
          {DOCUMENT_CATEGORIES.filter((cat) => cat.required).map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                {getDocumentsByCategory(category.id).length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <DocumentUploadZone category={category} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="optional" className="space-y-4">
          {DOCUMENT_CATEGORIES.filter((cat) => !cat.required).map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                {getDocumentsByCategory(category.id).length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <DocumentUploadZone category={category} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {documents.map((doc) => {
              const category = DOCUMENT_CATEGORIES.find((cat) => cat.id === doc.category)
              return (
                <Card key={doc.id} className="border-gray-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.originalName}</p>
                          <p className="text-sm text-gray-600">
                            {category?.name} • {formatFileSize(doc.fileSize)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Cloud className="h-3 w-3 mr-1" />
                            Synced
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            <CloudOff className="h-3 w-3 mr-1" />
                            Local
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {documents.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No documents uploaded yet</p>
                  <p className="text-sm text-gray-500">Start by uploading your required documents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* University Integration Status */}
      {universityCode && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Cloud className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">University Integration</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Documents are automatically synced with {universityCode.toUpperCase()} admissions system when
                  uploaded. Verified documents are immediately available to the admissions committee.
                </p>
                <div className="mt-3 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-blue-800">
                      {documents.filter((doc) => doc.verified).length} documents synced
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-blue-800">
                      {documents.filter((doc) => !doc.verified).length} pending sync
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
