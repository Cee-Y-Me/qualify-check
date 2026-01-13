"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, CheckCircle, AlertCircle, Info, ExternalLink } from "lucide-react"

interface NSFASResult {
  eligible: boolean
  eligibilityScore: number
  reasons: string[]
  estimatedFunding: {
    total: number
    breakdown: Record<string, number>
    note: string
  }
  applicationDeadlines: Record<string, string>
  requiredDocuments: string[]
  nextSteps: string[]
  additionalInfo: string[]
}

export default function FinancialAidPage() {
  const [formData, setFormData] = useState({
    householdIncome: "",
    dependents: "",
    province: "",
    studyMode: "",
    disability: false,
    previouslyFunded: false,
  })

  const [result, setResult] = useState<NSFASResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/nsfas-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          householdIncome: Number.parseInt(formData.householdIncome),
          dependents: Number.parseInt(formData.dependents) || 0,
          province: formData.province,
          studyMode: formData.studyMode,
          disability: formData.disability,
          previouslyFunded: formData.previouslyFunded,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to calculate eligibility")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error calculating NSFAS eligibility:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.householdIncome && formData.province && formData.studyMode

  const bursaryProviders = [
    {
      name: "Sasol Bursary Programme",
      fields: ["Engineering", "Science", "Technology", "Commerce"],
      amount: "Full tuition + R120,000 allowances",
      deadline: "31 August 2024",
      requirements: "Mathematics 70%+, Physical Sciences 70%+, English 60%+",
      website: "https://www.sasol.com/careers/bursaries",
      workCommitment: "5 years",
    },
    {
      name: "Anglo American Bursary",
      fields: ["Mining Engineering", "Metallurgy", "Geology", "Chemical Engineering"],
      amount: "R150,000 - R200,000 per year",
      deadline: "30 September 2024",
      requirements: "Top 10% of class, Leadership potential, Mathematics 75%+",
      website: "https://www.angloamerican.com/careers/bursaries",
      workCommitment: "3-5 years",
    },
    {
      name: "Eskom Bursary Programme",
      fields: ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
      amount: "Full tuition + R65,000 allowance",
      deadline: "31 July 2024",
      requirements: "Mathematics 75%+, Physics 75%+, English 65%+",
      website: "https://www.eskom.co.za/careers/bursaries",
      workCommitment: "5 years",
    },
    {
      name: "Discovery Bursary",
      fields: ["Actuarial Science", "Statistics", "Mathematics", "Computer Science"],
      amount: "R80,000 - R120,000 per year",
      deadline: "15 October 2024",
      requirements: "Mathematics 80%+, Top 5% academic performance",
      website: "https://www.discovery.co.za/careers/bursaries",
      workCommitment: "3 years",
    },
    {
      name: "Nedbank Bursary Programme",
      fields: ["Commerce", "Finance", "Economics", "IT"],
      amount: "R60,000 - R100,000 per year",
      deadline: "30 September 2024",
      requirements: "Mathematics 65%+, English 65%+, Leadership qualities",
      website: "https://www.nedbank.co.za/careers/bursaries",
      workCommitment: "2-3 years",
    },
    {
      name: "Transnet Bursary Programme",
      fields: ["Engineering", "Logistics", "Supply Chain", "Finance"],
      amount: "Full tuition + R45,000 allowance",
      deadline: "31 August 2024",
      requirements: "Mathematics 60%+, English 60%+, South African citizen",
      website: "https://www.transnet.net/careers/bursaries",
      workCommitment: "5 years",
    },
  ]

  const loanProviders = [
    {
      name: "Eduloan",
      description: "Comprehensive education financing with flexible terms",
      interestRate: "Prime + 2-4%",
      maxAmount: "R500,000",
      repayment: "6 months after graduation",
      features: ["No upfront fees", "Study abroad options", "Postgraduate funding"],
      website: "https://www.eduloan.co.za",
    },
    {
      name: "FNB Student Loans",
      description: "Banking solution for students with competitive rates",
      interestRate: "Prime + 1-3%",
      maxAmount: "R300,000",
      repayment: "6 months after graduation",
      features: ["FNB account benefits", "Online application", "Quick approval"],
      website: "https://www.fnb.co.za/loans/student-loans",
    },
    {
      name: "Standard Bank StudyLoan",
      description: "Flexible study financing with various options",
      interestRate: "Prime + 2-5%",
      maxAmount: "R400,000",
      repayment: "Flexible terms available",
      features: ["Grace period", "International study", "Parent/student options"],
      website: "https://www.standardbank.co.za/loans/student-loans",
    },
    {
      name: "ABSA Student Loans",
      description: "Comprehensive student financing solutions",
      interestRate: "Prime + 1.5-4%",
      maxAmount: "R350,000",
      repayment: "After graduation",
      features: ["Competitive rates", "Flexible repayment", "Online management"],
      website: "https://www.absa.co.za/personal/loans/student-loans",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Financial Aid Calculator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your NSFAS eligibility, explore bursary opportunities, and find the best funding options for your
            studies
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>2024 Application Season:</strong> NSFAS applications close on 30 November 2024. University
            applications typically close between July-September. Apply early for better chances!
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="nsfas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nsfas">NSFAS Calculator</TabsTrigger>
            <TabsTrigger value="bursaries">Bursary Database</TabsTrigger>
            <TabsTrigger value="loans">Study Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="nsfas" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* NSFAS Calculator Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>NSFAS Eligibility Calculator</span>
                  </CardTitle>
                  <CardDescription>
                    Enter your details to check NSFAS eligibility and get an estimated funding amount
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="income">Combined Household Income (per year) *</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="e.g., 250000"
                      value={formData.householdIncome}
                      onChange={(e) => setFormData({ ...formData, householdIncome: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Include all income sources (salaries, grants, pensions, etc.)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input
                      id="dependents"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.dependents}
                      onChange={(e) => setFormData({ ...formData, dependents: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">People financially dependent on household income</p>
                  </div>

                  <div>
                    <Label>Province *</Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => setFormData({ ...formData, province: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                        <SelectItem value="Free State">Free State</SelectItem>
                        <SelectItem value="Gauteng">Gauteng</SelectItem>
                        <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="Limpopo">Limpopo</SelectItem>
                        <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        <SelectItem value="North West">North West</SelectItem>
                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Study Mode *</Label>
                    <Select
                      value={formData.studyMode}
                      onValueChange={(value) => setFormData({ ...formData, studyMode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select study mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time on campus">Full-time on campus</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Distance learning">Distance learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disability"
                        checked={formData.disability}
                        onCheckedChange={(checked) => setFormData({ ...formData, disability: checked as boolean })}
                      />
                      <Label htmlFor="disability">I have a disability</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="previously-funded"
                        checked={formData.previouslyFunded}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, previouslyFunded: checked as boolean })
                        }
                      />
                      <Label htmlFor="previously-funded">Previously received NSFAS funding</Label>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={handleCalculate} disabled={loading || !isFormValid} className="w-full">
                    {loading ? "Calculating..." : "Calculate Eligibility"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    * Required fields. This is an estimate only - official eligibility determined by NSFAS.
                  </p>
                </CardContent>
              </Card>

              {/* Results */}
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {result.eligible ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span>{result.eligible ? "Likely NSFAS Eligible!" : "May Not Qualify for NSFAS"}</span>
                    </CardTitle>
                    <CardDescription>
                      {result.eligible
                        ? "Based on your information, you appear to meet NSFAS criteria"
                        : "Consider alternative funding options below"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Eligibility Score</span>
                        <Badge variant={result.eligible ? "default" : "destructive"}>
                          {result.eligibilityScore}/100
                        </Badge>
                      </div>
                      <Progress value={result.eligibilityScore} className="h-2" />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Assessment Details:</h4>
                      <ul className="space-y-2">
                        {result.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="mt-0.5 text-base">
                              {reason.startsWith("✓") ? "✅" : reason.startsWith("✗") ? "❌" : "⚠️"}
                            </span>
                            <span>{reason.substring(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.eligible && result.estimatedFunding.total > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Estimated Annual Funding:</h4>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="text-3xl font-bold text-green-700 mb-2">
                            R{result.estimatedFunding.total.toLocaleString()}
                          </div>
                          <p className="text-sm text-green-600 mb-3">{result.estimatedFunding.note}</p>
                          <div className="space-y-2">
                            {Object.entries(result.estimatedFunding.breakdown).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="capitalize">
                                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                                </span>
                                <span className="font-medium">R{value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {result.additionalInfo.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Additional Information:</h4>
                        <ul className="space-y-1 text-sm text-blue-700">
                          {result.additionalInfo.map((info, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Info className="h-3 w-3 mt-1 flex-shrink-0" />
                              <span>{info}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3">Next Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {result.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Important Deadlines:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(result.applicationDeadlines).map(([type, deadline]) => (
                          <div key={type} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="capitalize font-medium">{type}:</span>
                            <Badge variant="outline">{deadline}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full" asChild>
                        <a href="https://www.nsfas.org.za" target="_blank" rel="noopener noreferrer">
                          Apply on NSFAS Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bursaries" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Corporate Bursary Database</h2>
              <p className="text-gray-600">Explore bursary opportunities from leading South African companies</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {bursaryProviders.map((bursary, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{bursary.name}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{bursary.amount}</Badge>
                        <Badge variant="secondary">Work: {bursary.workCommitment}</Badge>
                      </div>
                      <span className="text-sm">Deadline: {bursary.deadline}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h5 className="font-semibold text-sm mb-2">Fields of Study:</h5>
                        <div className="flex flex-wrap gap-1">
                          {bursary.fields.map((field, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-1">Requirements:</h5>
                        <p className="text-sm text-gray-600">{bursary.requirements}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1" asChild>
                        <a href={bursary.website} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline">
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bursary Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Apply early - many bursaries have limited spots</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tailor your application to each company's values and requirements</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Highlight leadership experience and community involvement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Ensure your academic results meet the minimum requirements</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Prepare for interviews and assessment centers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Study Loan Options</h2>
              <p className="text-gray-600">Compare study loan providers and their terms</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {loanProviders.map((loan, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{loan.name}</CardTitle>
                    <CardDescription>{loan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Interest Rate:</span>
                          <p className="text-gray-600">{loan.interestRate}</p>
                        </div>
                        <div>
                          <span className="font-medium">Max Amount:</span>
                          <p className="text-gray-600">{loan.maxAmount}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-sm">Repayment:</span>
                        <p className="text-sm text-gray-600">{loan.repayment}</p>
                      </div>

                      <div>
                        <span className="font-medium text-sm">Key Features:</span>
                        <ul className="text-sm text-gray-600 mt-1">
                          {loan.features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1" asChild>
                        <a href={loan.website} target="_blank" rel="noopener noreferrer">
                          Get Quote
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline">
                        Compare
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Study Loan Considerations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Advantages</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>No work commitment after graduation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Flexible repayment terms</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Can cover full study costs</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Grace period after graduation</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">Considerations</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Interest accumulates during studies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Must repay regardless of employment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Credit checks and guarantees required</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Higher total cost due to interest</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
