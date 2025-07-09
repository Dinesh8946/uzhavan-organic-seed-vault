"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sprout, Users, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

const translations = {
  en: {
    title: "Register with Uzhavan",
    subtitle: "Create your account",
    farmer: "Farmer",
    buyer: "Buyer",
    name: "Full Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    phone: "Phone Number",
    location: "Location",
    district: "District",
    register: "Register",
    login: "Login",
    haveAccount: "Already have an account?",
    namePlaceholder: "Enter your full name",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    confirmPasswordPlaceholder: "Confirm your password",
    phonePlaceholder: "Enter your phone number",
    locationPlaceholder: "Enter your location",
    selectDistrict: "Select your district",
    farmSize: "Farm Size (acres)",
    farmSizePlaceholder: "Enter farm size",
    experience: "Farming Experience (years)",
    experiencePlaceholder: "Years of experience",
    specialization: "Specialization",
    specializationPlaceholder: "e.g., Organic farming, Traditional seeds",
    passwordMismatch: "Passwords do not match",
    emailExists: "Email already exists",
    registrationSuccess: "Registration successful!",
    registrationError: "Registration failed. Please try again.",
  },
  ta: {
    title: "உழவனில் பதிவு செய்யுங்கள்",
    subtitle: "உங்கள் கணக்கை உருவாக்கவும்",
    farmer: "விவசாயி",
    buyer: "வாங்குபவர்",
    name: "முழு பெயர்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    phone: "தொலைபேசி எண்",
    location: "இடம்",
    district: "மாவட்டம்",
    register: "பதிவு செய்ய",
    login: "உள்நுழைய",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    namePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",
    emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
    confirmPasswordPlaceholder: "உங்கள் கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    phonePlaceholder: "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
    locationPlaceholder: "உங்கள் இடத்தை உள்ளிடவும்",
    selectDistrict: "உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    farmSize: "பண்ணை அளவு (ஏக்கர்)",
    farmSizePlaceholder: "பண்ணை அளவை உள்ளிடவும்",
    experience: "விவசாய அனுபவம் (ஆண்டுகள்)",
    experiencePlaceholder: "அனுபவ ஆண்டுகள்",
    specialization: "சிறப்பு",
    specializationPlaceholder: "எ.கா., இயற்கை விவசாயம், பாரம்பரிய விதைகள்",
    passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை",
    emailExists: "மின்னஞ்சல் ஏற்கனவே உள்ளது",
    registrationSuccess: "பதிவு வெற்றிகரமாக!",
    registrationError: "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
  },
}

const districts = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Thanjavur",
  "Vellore",
  "Erode",
  "Dindigul",
  "Thoothukudi",
  "Kanchipuram",
]

export default function RegisterPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [userType, setUserType] = useState<"farmer" | "buyer">("farmer")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    district: "",
    farmSize: "",
    experience: "",
    specialization: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const t = translations[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError(t.passwordMismatch)
        setIsLoading(false)
        return
      }

      // Check if email already exists
      const users = storage.getUsers()
      const emailExists = users.some((user) => user.email === formData.email)
      if (emailExists) {
        setError(t.emailExists)
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = storage.addUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userType,
        district: formData.district,
        location: formData.location,
        farmSize: formData.farmSize || undefined,
        experience: formData.experience || undefined,
        specialization: formData.specialization || undefined,
      })

      // Auto login
      storage.setCurrentUser(newUser.id)
      setSuccess(t.registrationSuccess)

      setTimeout(() => {
        router.push(userType === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard")
      }, 1000)
    } catch (err) {
      setError(t.registrationError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-800 dark:text-green-400">Uzhavan</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>

          <div className="flex items-center justify-center space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
              {language === "en" ? "தமிழ்" : "English"}
            </Button>
          </div>
        </div>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "farmer" | "buyer")}>
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-700">
                <TabsTrigger
                  value="farmer"
                  className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-600"
                >
                  <Sprout className="h-4 w-4" />
                  <span>{t.farmer}</span>
                </TabsTrigger>
                <TabsTrigger value="buyer" className="flex items-center space-x-2 dark:data-[state=active]:bg-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{t.buyer}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertDescription className="text-red-800 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                <AlertDescription className="text-green-800 dark:text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-gray-200">
                    {t.name}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-gray-200">
                    {t.phone}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="dark:text-gray-200">
                    {t.password}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="dark:text-gray-200">
                    {t.confirmPassword}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district" className="dark:text-gray-200">
                    {t.district}
                  </Label>
                  <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder={t.selectDistrict} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="dark:text-gray-200">
                    {t.location}
                  </Label>
                  <Input
                    id="location"
                    placeholder={t.locationPlaceholder}
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Farmer-specific fields */}
              {userType === "farmer" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmSize" className="dark:text-gray-200">
                        {t.farmSize}
                      </Label>
                      <Input
                        id="farmSize"
                        type="number"
                        placeholder={t.farmSizePlaceholder}
                        value={formData.farmSize}
                        onChange={(e) => handleInputChange("farmSize", e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience" className="dark:text-gray-200">
                        {t.experience}
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder={t.experiencePlaceholder}
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="dark:text-gray-200">
                      {t.specialization}
                    </Label>
                    <Input
                      id="specialization"
                      placeholder={t.specializationPlaceholder}
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : t.register}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {t.haveAccount} {t.login}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
