"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sprout, Users, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

const translations = {
  en: {
    title: "Login to Uzhavan",
    subtitle: "Access your account",
    farmer: "Farmer",
    buyer: "Buyer",
    email: "Email",
    password: "Password",
    login: "Login",
    register: "Register",
    noAccount: "Don't have an account?",
    forgotPassword: "Forgot Password?",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    loginError: "Invalid email or password",
    loginSuccess: "Login successful!",
  },
  ta: {
    title: "உழவனில் உள்நுழையவும்",
    subtitle: "உங்கள் கணக்கை அணுகவும்",
    farmer: "விவசாயி",
    buyer: "வாங்குபவர்",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    login: "உள்நுழைய",
    register: "பதிவு செய்ய",
    noAccount: "கணக்கு இல்லையா?",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
    passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
    loginError: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்",
    loginSuccess: "உள்நுழைவு வெற்றிகரமாக!",
  },
}

export default function LoginPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [userType, setUserType] = useState<"farmer" | "buyer">("farmer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const t = translations[language]

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = storage.getCurrentUser()
    if (currentUser) {
      router.push(currentUser.userType === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const users = storage.getUsers()
      const user = users.find((u) => u.email === email && u.userType === userType)

      if (user) {
        // In a real app, you'd verify the password hash
        // For demo purposes, we'll accept any password
        storage.setCurrentUser(user.id)
        setSuccess(t.loginSuccess)

        setTimeout(() => {
          router.push(userType === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard")
        }, 1000)
      } else {
        setError(t.loginError)
      }
    } catch (err) {
      setError(t.loginError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-gray-200">
                  {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : t.login}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/register" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {t.noAccount} {t.register}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
