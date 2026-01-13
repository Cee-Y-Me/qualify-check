import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Calculator,
  TrendingUp,
  Users,
  MapPin,
  Award,
  BookOpen,
  DollarSign,
  Target,
  Zap,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
      title: "Smart Course Matching",
      description: "AI-powered recommendations based on your Grade 12 results and career interests",
      link: "/qualification",
    },
    {
      icon: <Calculator className="h-8 w-8 text-green-600" />,
      title: "NSFAS Calculator",
      description: "Instantly check your NSFAS eligibility and estimate funding amounts",
      link: "/financial-aid",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Career Guidance",
      description: "Explore career paths, salary expectations, and industry trends",
      link: "/career-guidance",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "University Comparison",
      description: "Compare universities, courses, fees, and admission requirements",
      link: "/university-comparison",
    },
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: "Bursary Database",
      description: "Access comprehensive database of bursaries and scholarships",
      link: "/financial-aid",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      title: "Application Tracker",
      description: "Track your university applications and important deadlines",
      link: "/applications",
    },
  ]

  const stats = [
    { label: "Universities", value: "26", icon: <MapPin className="h-5 w-5" /> },
    { label: "Courses", value: "500+", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Students Helped", value: "10,000+", icon: <Users className="h-5 w-5" /> },
    { label: "Success Rate", value: "94%", icon: <Target className="h-5 w-5" /> },
  ]

  const testimonials = [
    {
      name: "Thabo Mthembu",
      location: "Johannesburg, Gauteng",
      course: "Computer Science at Wits",
      quote:
        "This platform helped me find the perfect course match and secure NSFAS funding. I'm now studying my dream course!",
    },
    {
      name: "Nomsa Dlamini",
      location: "Cape Town, Western Cape",
      course: "Medicine at UCT",
      quote: "The career guidance section opened my eyes to opportunities I never knew existed. Highly recommended!",
    },
    {
      name: "Sipho Ndlovu",
      location: "Durban, KwaZulu-Natal",
      course: "Engineering at UKZN",
      quote: "The bursary database helped me find funding I didn't even know was available. Thank you!",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              South Africa's #1 University Guidance Platform
            </Badge>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {" "}
              University Match
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized university and course recommendations based on your Grade 12 results, career interests, and
            financial needs. Start your journey to higher education success today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/qualification">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Assessment
                <GraduationCap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/career-guidance">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                Explore Careers
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-blue-600">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for University Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and information you need to make informed decisions
              about your higher education journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.link}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-blue-50 transition-colors bg-transparent"
                    >
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your perfect university match</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Results</h3>
              <p className="text-gray-600">
                Input your Grade 12 marks and personal information through our dynamic questionnaire
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and matches you with suitable courses and universities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply & Succeed</h3>
              <p className="text-gray-600">
                Use our guidance to apply for courses, funding, and start your university journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from students who found their path with our platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0">
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {testimonial.course}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have found their perfect university match. Start your assessment today and
            take the first step towards your future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/qualification">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Start Free Assessment
                <GraduationCap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/financial-aid">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Check NSFAS Eligibility
                <DollarSign className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
