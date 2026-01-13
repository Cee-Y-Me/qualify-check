"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface SubjectMark {
  subject: string
  mark: string
  level: string
}

interface PDFUploadProps {
  onSubjectsExtracted: (subjects: SubjectMark[]) => void
}

export function PDFUpload({ onSubjectsExtracted }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [extractedCount, setExtractedCount] = useState(0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus("idle")
    setErrorMessage("")

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/extract-pdf-marks", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process PDF")
      }

      if (data.success && data.subjects) {
        setUploadStatus("success")
        setExtractedCount(data.subjects.length)
        onSubjectsExtracted(data.subjects)
      }
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Upload Your Grade 12 Results PDF</span>
        </CardTitle>
        <CardDescription>
          Upload your official Grade 12 results document and we'll automatically extract your subjects and marks. This
          saves you time from entering everything manually.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">Select PDF File</Label>
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
        </div>

        {isUploading && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>Processing your PDF and extracting subjects and marks...</AlertDescription>
          </Alert>
        )}

        {uploadStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully extracted {extractedCount} subjects from your PDF! Please review the information below and
              make any necessary corrections.
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Supported Documents:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Official Grade 12 National Senior Certificate results</li>
            <li>• Department of Basic Education results documents</li>
            <li>• Provincial education department certificates</li>
            <li>• IEB (Independent Examinations Board) results</li>
          </ul>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-amber-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Please ensure your PDF is clear and readable</li>
            <li>• The document should contain your final Grade 12 marks</li>
            <li>• You can still edit the extracted information if needed</li>
            <li>• Your PDF is processed securely and not stored</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
