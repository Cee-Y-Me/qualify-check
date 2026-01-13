import { z } from "zod"

// Standard schemas for university API integration
const UniversityApplicationSchema = z.object({
  applicationId: z.string(),
  studentId: z.string(),
  courseCode: z.string(),
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    idNumber: z.string(),
    email: z.string().email(),
    phone: z.string(),
    dateOfBirth: z.string(),
    nationality: z.string(),
  }),
  academicInfo: z.object({
    matricYear: z.string(),
    schoolName: z.string(),
    subjects: z.array(
      z.object({
        name: z.string(),
        level: z.string(),
        mark: z.number(),
      }),
    ),
    previousQualifications: z.array(z.any()).optional(),
  }),
  documents: z.array(
    z.object({
      type: z.string(),
      filename: z.string(),
      url: z.string(),
      verified: z.boolean().default(false),
    }),
  ),
  applicationData: z.any(),
})

const UniversityStatusSchema = z.object({
  applicationId: z.string(),
  status: z.enum(["received", "under_review", "documents_required", "accepted", "rejected", "waitlisted"]),
  message: z.string(),
  lastUpdated: z.string(),
  nextSteps: z.array(z.string()).optional(),
  requirements: z
    .array(
      z.object({
        type: z.string(),
        description: z.string(),
        completed: z.boolean(),
        dueDate: z.string().optional(),
      }),
    )
    .optional(),
})

export type UniversityApplication = z.infer<typeof UniversityApplicationSchema>
export type UniversityStatus = z.infer<typeof UniversityStatusSchema>

// Base university API client interface
export interface UniversityAPIClient {
  submitApplication(
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string }>
  getApplicationStatus(applicationId: string): Promise<{ success: boolean; status?: UniversityStatus; error?: string }>
  uploadDocument(
    applicationId: string,
    document: File,
    documentType: string,
  ): Promise<{ success: boolean; documentId?: string; error?: string }>
  getRequirements(courseCode: string): Promise<{ success: boolean; requirements?: any[]; error?: string }>
  validateApplication(application: Partial<UniversityApplication>): Promise<{ valid: boolean; errors?: string[] }>
}

// University of Cape Town API Client
export class UCTAPIClient implements UniversityAPIClient {
  private baseUrl = process.env.UCT_API_BASE_URL || "https://api.uct.ac.za/admissions/v1"
  private apiKey = process.env.UCT_API_KEY
  private clientId = process.env.UCT_CLIENT_ID
  private clientSecret = process.env.UCT_CLIENT_SECRET

  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.clientId!,
          client_secret: this.clientSecret!,
          scope: "admissions:write admissions:read documents:upload",
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Authentication failed: ${data.error_description}`)
      }

      return data.access_token
    } catch (error) {
      console.error("UCT API authentication error:", error)
      throw error
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey!,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`UCT API error: ${data.message || response.statusText}`)
    }

    return data
  }

  async submitApplication(
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string }> {
    try {
      // Transform our application format to UCT's expected format
      const uctApplication = {
        student: {
          firstName: application.personalInfo.firstName,
          lastName: application.personalInfo.lastName,
          idNumber: application.personalInfo.idNumber,
          email: application.personalInfo.email,
          cellphone: application.personalInfo.phone,
          dateOfBirth: application.personalInfo.dateOfBirth,
          nationality: application.personalInfo.nationality,
        },
        academic: {
          matriculationYear: Number.parseInt(application.academicInfo.matricYear),
          schoolName: application.academicInfo.schoolName,
          subjects: application.academicInfo.subjects.map((subject) => ({
            subjectCode: this.mapSubjectToUCTCode(subject.name),
            level: subject.level,
            finalMark: subject.mark,
          })),
        },
        application: {
          courseCode: application.courseCode,
          studyMode: application.applicationData.studyMode || "FULL_TIME",
          accommodationRequired: application.applicationData.accommodationRequired || false,
          financialAidRequired: application.applicationData.financialAid || false,
          motivationStatement: application.applicationData.motivationLetter,
        },
        documents: application.documents.map((doc) => ({
          documentType: this.mapDocumentType(doc.type),
          filename: doc.filename,
          downloadUrl: doc.url,
        })),
      }

      const result = await this.makeRequest("/applications", {
        method: "POST",
        body: JSON.stringify(uctApplication),
      })

      return {
        success: true,
        applicationNumber: result.applicationNumber,
      }
    } catch (error) {
      console.error("UCT application submission error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async getApplicationStatus(
    applicationId: string,
  ): Promise<{ success: boolean; status?: UniversityStatus; error?: string }> {
    try {
      const result = await this.makeRequest(`/applications/${applicationId}/status`)

      const status: UniversityStatus = {
        applicationId: result.applicationNumber,
        status: this.mapUCTStatus(result.status),
        message: result.statusMessage,
        lastUpdated: result.lastUpdated,
        nextSteps: result.nextSteps,
        requirements: result.outstandingRequirements?.map((req: any) => ({
          type: req.requirementType,
          description: req.description,
          completed: req.completed,
          dueDate: req.dueDate,
        })),
      }

      return { success: true, status }
    } catch (error) {
      console.error("UCT status check error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get status",
      }
    }
  }

  async uploadDocument(
    applicationId: string,
    document: File,
    documentType: string,
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      const formData = new FormData()
      formData.append("file", document)
      formData.append("documentType", this.mapDocumentType(documentType))
      formData.append("applicationId", applicationId)

      const token = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/applications/${applicationId}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-Key": this.apiKey!,
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Document upload failed")
      }

      return {
        success: true,
        documentId: result.documentId,
      }
    } catch (error) {
      console.error("UCT document upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Document upload failed",
      }
    }
  }

  async getRequirements(courseCode: string): Promise<{ success: boolean; requirements?: any[]; error?: string }> {
    try {
      const result = await this.makeRequest(`/courses/${courseCode}/requirements`)

      return {
        success: true,
        requirements: result.requirements,
      }
    } catch (error) {
      console.error("UCT requirements error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get requirements",
      }
    }
  }

  async validateApplication(
    application: Partial<UniversityApplication>,
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const result = await this.makeRequest("/applications/validate", {
        method: "POST",
        body: JSON.stringify(application),
      })

      return {
        valid: result.valid,
        errors: result.errors,
      }
    } catch (error) {
      console.error("UCT validation error:", error)
      return {
        valid: false,
        errors: ["Validation service unavailable"],
      }
    }
  }

  private mapSubjectToUCTCode(subjectName: string): string {
    const subjectMap: { [key: string]: string } = {
      Mathematics: "MATH",
      "Physical Sciences": "PHYS",
      "Life Sciences": "LIFE",
      "English Home Language": "ENGL_HL",
      "English First Additional Language": "ENGL_FAL",
      "Afrikaans Home Language": "AFRI_HL",
      "Afrikaans First Additional Language": "AFRI_FAL",
      Accounting: "ACCO",
      "Business Studies": "BUSI",
      Economics: "ECON",
      Geography: "GEOG",
      History: "HIST",
      "Information Technology": "INFO",
      "Computer Applications Technology": "CAT",
    }

    return subjectMap[subjectName] || subjectName.toUpperCase().replace(/\s+/g, "_")
  }

  private mapDocumentType(documentType: string): string {
    const documentMap: { [key: string]: string } = {
      id_document: "ID_COPY",
      matric_certificate: "MATRIC_CERT",
      academic_transcripts: "ACADEMIC_RECORD",
      motivation_letter: "MOTIVATION_LETTER",
      proof_of_address: "PROOF_ADDRESS",
      medical_certificate: "MEDICAL_CERT",
    }

    return documentMap[documentType] || documentType.toUpperCase()
  }

  private mapUCTStatus(uctStatus: string): UniversityStatus["status"] {
    const statusMap: { [key: string]: UniversityStatus["status"] } = {
      RECEIVED: "received",
      IN_REVIEW: "under_review",
      DOCS_REQUIRED: "documents_required",
      ACCEPTED: "accepted",
      REJECTED: "rejected",
      WAITLISTED: "waitlisted",
    }

    return statusMap[uctStatus] || "received"
  }
}

// Wits University API Client
export class WitsAPIClient implements UniversityAPIClient {
  private baseUrl = process.env.WITS_API_BASE_URL || "https://api.wits.ac.za/student-services/v2"
  private apiKey = process.env.WITS_API_KEY
  private username = process.env.WITS_USERNAME
  private password = process.env.WITS_PASSWORD

  private async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey!,
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(`Wits authentication failed: ${data.message}`)
      }

      return data.sessionToken
    } catch (error) {
      console.error("Wits API authentication error:", error)
      throw error
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const sessionToken = await this.authenticate()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey!,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Wits API error: ${data.error || response.statusText}`)
    }

    return data
  }

  async submitApplication(
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string }> {
    try {
      // Wits uses a different application format
      const witsApplication = {
        applicant: {
          personalDetails: {
            firstName: application.personalInfo.firstName,
            surname: application.personalInfo.lastName,
            idNumber: application.personalInfo.idNumber,
            emailAddress: application.personalInfo.email,
            mobileNumber: application.personalInfo.phone,
            birthDate: application.personalInfo.dateOfBirth,
            citizenship: application.personalInfo.nationality,
          },
          academicHistory: {
            matriculationYear: application.academicInfo.matricYear,
            highSchool: application.academicInfo.schoolName,
            matricResults: application.academicInfo.subjects.map((subject) => ({
              subject: subject.name,
              level: subject.level,
              percentage: subject.mark,
            })),
          },
        },
        applicationDetails: {
          programCode: application.courseCode,
          studyType: application.applicationData.studyMode?.toUpperCase() || "FULLTIME",
          residenceRequired: application.applicationData.accommodationRequired || false,
          bursaryApplication: application.applicationData.financialAid || false,
          personalStatement: application.applicationData.motivationLetter,
        },
        supportingDocuments: application.documents.map((doc) => ({
          category: this.mapWitsDocumentCategory(doc.type),
          fileName: doc.filename,
          fileUrl: doc.url,
          verified: doc.verified,
        })),
      }

      const result = await this.makeRequest("/admissions/applications", {
        method: "POST",
        body: JSON.stringify(witsApplication),
      })

      return {
        success: true,
        applicationNumber: result.applicationReference,
      }
    } catch (error) {
      console.error("Wits application submission error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Application submission failed",
      }
    }
  }

  async getApplicationStatus(
    applicationId: string,
  ): Promise<{ success: boolean; status?: UniversityStatus; error?: string }> {
    try {
      const result = await this.makeRequest(`/admissions/applications/${applicationId}`)

      const status: UniversityStatus = {
        applicationId: result.applicationReference,
        status: this.mapWitsStatus(result.currentStatus),
        message: result.statusDescription,
        lastUpdated: result.lastStatusUpdate,
        nextSteps: result.actionItems,
        requirements: result.pendingRequirements?.map((req: any) => ({
          type: req.category,
          description: req.description,
          completed: req.satisfied,
          dueDate: req.deadline,
        })),
      }

      return { success: true, status }
    } catch (error) {
      console.error("Wits status check error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Status check failed",
      }
    }
  }

  async uploadDocument(
    applicationId: string,
    document: File,
    documentType: string,
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      // Wits requires documents to be uploaded to their document service first
      const uploadFormData = new FormData()
      uploadFormData.append("document", document)
      uploadFormData.append("category", this.mapWitsDocumentCategory(documentType))

      const sessionToken = await this.authenticate()

      const uploadResponse = await fetch(`${this.baseUrl}/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "X-API-Key": this.apiKey!,
        },
        body: uploadFormData,
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.message || "Document upload failed")
      }

      // Then attach the document to the application
      const attachResult = await this.makeRequest(`/admissions/applications/${applicationId}/documents`, {
        method: "POST",
        body: JSON.stringify({
          documentId: uploadResult.documentId,
          category: this.mapWitsDocumentCategory(documentType),
        }),
      })

      return {
        success: true,
        documentId: uploadResult.documentId,
      }
    } catch (error) {
      console.error("Wits document upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Document upload failed",
      }
    }
  }

  async getRequirements(courseCode: string): Promise<{ success: boolean; requirements?: any[]; error?: string }> {
    try {
      const result = await this.makeRequest(`/academic/programs/${courseCode}/admission-requirements`)

      return {
        success: true,
        requirements: result.admissionRequirements,
      }
    } catch (error) {
      console.error("Wits requirements error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get requirements",
      }
    }
  }

  async validateApplication(
    application: Partial<UniversityApplication>,
  ): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const result = await this.makeRequest("/admissions/applications/validate", {
        method: "POST",
        body: JSON.stringify(application),
      })

      return {
        valid: result.isValid,
        errors: result.validationErrors,
      }
    } catch (error) {
      console.error("Wits validation error:", error)
      return {
        valid: false,
        errors: ["Validation service unavailable"],
      }
    }
  }

  private mapWitsDocumentCategory(documentType: string): string {
    const categoryMap: { [key: string]: string } = {
      id_document: "IDENTITY_DOCUMENT",
      matric_certificate: "MATRIC_CERTIFICATE",
      academic_transcripts: "ACADEMIC_TRANSCRIPT",
      motivation_letter: "PERSONAL_STATEMENT",
      proof_of_address: "PROOF_OF_RESIDENCE",
      medical_certificate: "MEDICAL_CERTIFICATE",
    }

    return categoryMap[documentType] || documentType.toUpperCase()
  }

  private mapWitsStatus(witsStatus: string): UniversityStatus["status"] {
    const statusMap: { [key: string]: UniversityStatus["status"] } = {
      SUBMITTED: "received",
      UNDER_REVIEW: "under_review",
      PENDING_DOCUMENTS: "documents_required",
      OFFER_MADE: "accepted",
      DECLINED: "rejected",
      WAITING_LIST: "waitlisted",
    }

    return statusMap[witsStatus] || "received"
  }
}

// University API Factory
export class UniversityAPIFactory {
  static createClient(universityCode: string): UniversityAPIClient {
    switch (universityCode.toLowerCase()) {
      case "uct":
      case "uct_001":
        return new UCTAPIClient()
      case "wits":
      case "wits_001":
        return new WitsAPIClient()
      default:
        throw new Error(`Unsupported university: ${universityCode}`)
    }
  }

  static getSupportedUniversities(): string[] {
    return ["uct", "wits"]
  }
}
