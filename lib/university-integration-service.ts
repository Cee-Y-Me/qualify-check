import { UniversityAPIFactory, type UniversityApplication, type UniversityStatus } from "./university-api-client"

export interface IntegrationConfig {
  universityCode: string
  enabled: boolean
  apiEndpoint?: string
  webhookEndpoint?: string
  authMethod: "oauth2" | "api_key" | "basic_auth" | "jwt"
  credentials: {
    apiKey?: string
    clientId?: string
    clientSecret?: string
    username?: string
    password?: string
    jwtSecret?: string
  }
  features: {
    directSubmission: boolean
    statusTracking: boolean
    documentUpload: boolean
    realTimeUpdates: boolean
  }
  fallbackMethod?: "email" | "manual" | "portal_redirect"
}

export class UniversityIntegrationService {
  private integrations: Map<string, IntegrationConfig> = new Map()

  constructor() {
    this.loadIntegrationConfigs()
  }

  private loadIntegrationConfigs(): void {
    // Load from environment variables or configuration file
    const configs: IntegrationConfig[] = [
      {
        universityCode: "uct",
        enabled: process.env.UCT_INTEGRATION_ENABLED === "true",
        apiEndpoint: process.env.UCT_API_BASE_URL,
        webhookEndpoint: process.env.UCT_WEBHOOK_URL,
        authMethod: "oauth2",
        credentials: {
          clientId: process.env.UCT_CLIENT_ID,
          clientSecret: process.env.UCT_CLIENT_SECRET,
          apiKey: process.env.UCT_API_KEY,
        },
        features: {
          directSubmission: true,
          statusTracking: true,
          documentUpload: true,
          realTimeUpdates: true,
        },
      },
      {
        universityCode: "wits",
        enabled: process.env.WITS_INTEGRATION_ENABLED === "true",
        apiEndpoint: process.env.WITS_API_BASE_URL,
        webhookEndpoint: process.env.WITS_WEBHOOK_URL,
        authMethod: "basic_auth",
        credentials: {
          username: process.env.WITS_USERNAME,
          password: process.env.WITS_PASSWORD,
          apiKey: process.env.WITS_API_KEY,
        },
        features: {
          directSubmission: true,
          statusTracking: true,
          documentUpload: true,
          realTimeUpdates: true,
        },
      },
      {
        universityCode: "stellenbosch",
        enabled: process.env.SUN_INTEGRATION_ENABLED === "true",
        apiEndpoint: process.env.SUN_API_BASE_URL,
        authMethod: "jwt",
        credentials: {
          jwtSecret: process.env.SUN_JWT_SECRET,
        },
        features: {
          directSubmission: false, // Not yet available
          statusTracking: true,
          documentUpload: false,
          realTimeUpdates: true,
        },
        fallbackMethod: "email",
      },
      {
        universityCode: "up",
        enabled: process.env.UP_INTEGRATION_ENABLED === "true",
        apiEndpoint: process.env.UP_API_BASE_URL,
        authMethod: "api_key",
        credentials: {
          apiKey: process.env.UP_API_KEY,
        },
        features: {
          directSubmission: false,
          statusTracking: false,
          documentUpload: false,
          realTimeUpdates: false,
        },
        fallbackMethod: "portal_redirect",
      },
    ]

    configs.forEach((config) => {
      this.integrations.set(config.universityCode, config)
    })
  }

  async submitApplication(
    universityCode: string,
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string; fallbackRequired?: boolean }> {
    const config = this.integrations.get(universityCode)

    if (!config || !config.enabled) {
      return {
        success: false,
        error: "University integration not available",
        fallbackRequired: true,
      }
    }

    if (!config.features.directSubmission) {
      return this.handleFallbackSubmission(config, application)
    }

    try {
      const client = UniversityAPIFactory.createClient(universityCode)
      const result = await client.submitApplication(application)

      if (!result.success && config.fallbackMethod) {
        return this.handleFallbackSubmission(config, application)
      }

      return result
    } catch (error) {
      console.error(`Integration error for ${universityCode}:`, error)

      if (config.fallbackMethod) {
        return this.handleFallbackSubmission(config, application)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Integration failed",
      }
    }
  }

  async getApplicationStatus(
    universityCode: string,
    applicationId: string,
  ): Promise<{ success: boolean; status?: UniversityStatus; error?: string }> {
    const config = this.integrations.get(universityCode)

    if (!config || !config.enabled || !config.features.statusTracking) {
      return {
        success: false,
        error: "Status tracking not available for this university",
      }
    }

    try {
      const client = UniversityAPIFactory.createClient(universityCode)
      return await client.getApplicationStatus(applicationId)
    } catch (error) {
      console.error(`Status check error for ${universityCode}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Status check failed",
      }
    }
  }

  async uploadDocument(
    universityCode: string,
    applicationId: string,
    document: File,
    documentType: string,
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    const config = this.integrations.get(universityCode)

    if (!config || !config.enabled || !config.features.documentUpload) {
      return {
        success: false,
        error: "Document upload not available for this university",
      }
    }

    try {
      const client = UniversityAPIFactory.createClient(universityCode)
      return await client.uploadDocument(applicationId, document, documentType)
    } catch (error) {
      console.error(`Document upload error for ${universityCode}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Document upload failed",
      }
    }
  }

  private async handleFallbackSubmission(
    config: IntegrationConfig,
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string; fallbackRequired: boolean }> {
    switch (config.fallbackMethod) {
      case "email":
        return this.submitViaEmail(config, application)
      case "portal_redirect":
        return this.redirectToPortal(config, application)
      case "manual":
        return this.createManualSubmission(config, application)
      default:
        return {
          success: false,
          error: "No fallback method available",
          fallbackRequired: true,
        }
    }
  }

  private async submitViaEmail(
    config: IntegrationConfig,
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string; fallbackRequired: boolean }> {
    try {
      // Generate application PDF
      const applicationPDF = await this.generateApplicationPDF(application)

      // Send email to university admissions
      const emailResult = await fetch("/api/notifications/send-application-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          universityCode: config.universityCode,
          application,
          attachments: [applicationPDF],
        }),
      })

      if (emailResult.ok) {
        const tempApplicationNumber = `TEMP_${Date.now()}`
        return {
          success: true,
          applicationNumber: tempApplicationNumber,
          fallbackRequired: true,
        }
      }

      throw new Error("Email submission failed")
    } catch (error) {
      return {
        success: false,
        error: "Email fallback failed",
        fallbackRequired: true,
      }
    }
  }

  private async redirectToPortal(
    config: IntegrationConfig,
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string; fallbackRequired: boolean }> {
    // Pre-fill university portal with application data
    const portalUrl = this.generatePortalURL(config, application)

    return {
      success: true,
      applicationNumber: `REDIRECT_${Date.now()}`,
      error: `Please complete your application at: ${portalUrl}`,
      fallbackRequired: true,
    }
  }

  private async createManualSubmission(
    config: IntegrationConfig,
    application: UniversityApplication,
  ): Promise<{ success: boolean; applicationNumber?: string; error?: string; fallbackRequired: boolean }> {
    // Create a manual submission record for admin processing
    const manualSubmission = {
      universityCode: config.universityCode,
      application,
      status: "pending_manual_processing",
      createdAt: new Date().toISOString(),
    }

    // Store in database for manual processing
    // await db.manualSubmissions.create({ data: manualSubmission })

    return {
      success: true,
      applicationNumber: `MANUAL_${Date.now()}`,
      fallbackRequired: true,
    }
  }

  private async generateApplicationPDF(application: UniversityApplication): Promise<Buffer> {
    // Generate PDF from application data
    // This would use a PDF generation library like puppeteer or jsPDF
    return Buffer.from("PDF content placeholder")
  }

  private generatePortalURL(config: IntegrationConfig, application: UniversityApplication): string {
    // Generate pre-filled portal URL
    const baseUrl = config.apiEndpoint?.replace("/api/", "/portal/")
    const params = new URLSearchParams({
      firstName: application.personalInfo.firstName,
      lastName: application.personalInfo.lastName,
      email: application.personalInfo.email,
      courseCode: application.courseCode,
    })

    return `${baseUrl}?${params.toString()}`
  }

  getIntegrationStatus(universityCode: string): IntegrationConfig | null {
    return this.integrations.get(universityCode) || null
  }

  getSupportedUniversities(): string[] {
    return Array.from(this.integrations.keys()).filter((code) => this.integrations.get(code)?.enabled)
  }
}

// Singleton instance
export const universityIntegrationService = new UniversityIntegrationService()
