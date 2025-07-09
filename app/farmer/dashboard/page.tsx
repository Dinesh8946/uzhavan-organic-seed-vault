"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sprout,
  Plus,
  Eye,
  MessageCircle,
  TrendingUp,
  Package,
  Edit,
  Trash2,
  Phone,
  Mail,
  Moon,
  Sun,
  LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { storage, type Seed, type User, type Inquiry } from "@/lib/storage"

const translations = {
  en: {
    dashboard: "Farmer Dashboard",
    welcome: "Welcome back",
    overview: "Overview",
    mySeeds: "My Seeds",
    inquiries: "Inquiries",
    profile: "Profile",
    addNewSeed: "Add New Seed",
    totalSeeds: "Total Seeds",
    totalViews: "Total Views",
    activeInquiries: "Active Inquiries",
    totalEarnings: "Total Earnings",
    recentInquiries: "Recent Inquiries",
    seedName: "Seed Name",
    buyer: "Buyer",
    message: "Message",
    contact: "Contact",
    reply: "Reply",
    edit: "Edit",
    delete: "Delete",
    viewDetails: "View Details",
    status: "Status",
    active: "Active",
    soldOut: "Sold Out",
    pending: "Pending",
    noSeeds: "No seeds added yet. Start by adding your first seed!",
    noInquiries: "No inquiries yet. Share your seeds to get more visibility!",
    logout: "Logout",
    confirmDelete: "Are you sure you want to delete this seed?",
  },
  ta: {
    dashboard: "விவசாயி டாஷ்போர்டு",
    welcome: "மீண்டும் வரவேற்கிறோம்",
    overview: "மேலோட்டம்",
    mySeeds: "என் விதைகள்",
    inquiries: "விசாரணைகள்",
    profile: "சுயவிவரம்",
    addNewSeed: "புதிய விதை சேர்க்கவும்",
    totalSeeds: "மொத்த விதைகள்",
    totalViews: "மொத்த பார்வைகள்",
    activeInquiries: "செயலில் உள்ள விசாரணைகள்",
    totalEarnings: "மொத்த வருமானம்",
    recentInquiries: "சமீபத்திய விசாரணைகள்",
    seedName: "விதை பெயர்",
    buyer: "வாங்குபவர்",
    message: "செய்தி",
    contact: "தொடர்பு",
    reply: "பதில்",
    edit: "திருத்து",
    delete: "நீக்கு",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    status: "நிலை",
    active: "செயலில்",
    soldOut: "விற்றுத் தீர்ந்தது",
    pending: "நிலுவையில்",
    noSeeds: "இன்னும் விதைகள் சேர்க்கப்படவில்லை. உங்கள் முதல் விதையைச் சேர்ப்பதன் மூலம் தொடங்குங்கள்!",
    noInquiries: "இன்னும் விசாரணைகள் இல்லை. அதிக தெரிவுநிலையைப் பெற உங்கள் விதைகளைப் பகிருங்கள்!",
    logout: "வெளியேறு",
    confirmDelete: "இந்த விதையை நீக்க விரும்புகிறீர்களா?",
  },
}

export default function FarmerDashboard() {
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [activeTab, setActiveTab] = useState("overview")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [seeds, setSeeds] = useState<Seed[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState({
    totalSeeds: 0,
    totalViews: 0,
    activeInquiries: 0,
    totalEarnings: 0,
  })
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const t = translations[language]

  useEffect(() => {
    const user = storage.getCurrentUser()
    if (!user || user.userType !== "farmer") {
      router.push("/auth/login")
      return
    }

    setCurrentUser(user)

    // Load farmer's seeds
    const allSeeds = storage.getSeeds()
    const farmerSeeds = allSeeds.filter((seed) => seed.farmerId === user.id)
    setSeeds(farmerSeeds)

    // Load inquiries for farmer's seeds
    const allInquiries = storage.getInquiries()
    const farmerInquiries = allInquiries.filter((inquiry) => inquiry.farmerId === user.id)
    setInquiries(farmerInquiries)

    // Calculate stats
    const totalViews = farmerSeeds.reduce((sum, seed) => sum + seed.views, 0)
    const activeInquiries = farmerInquiries.filter((inquiry) => inquiry.status === "pending").length
    const totalEarnings = farmerSeeds.reduce((sum, seed) => sum + seed.price * Number.parseInt(seed.quantity || "0"), 0)

    setStats({
      totalSeeds: farmerSeeds.length,
      totalViews,
      activeInquiries,
      totalEarnings,
    })
  }, [router])

  const handleLogout = () => {
    storage.logout()
    router.push("/")
  }

  const handleDeleteSeed = (seedId: string) => {
    if (window.confirm(t.confirmDelete)) {
      storage.deleteSeed(seedId)
      setSeeds((prev) => prev.filter((seed) => seed.id !== seedId))
    }
  }

  const handleStatusChange = (seedId: string, newStatus: "active" | "soldOut" | "pending") => {
    const updatedSeed = storage.updateSeed(seedId, { status: newStatus })
    if (updatedSeed) {
      setSeeds((prev) => prev.map((seed) => (seed.id === seedId ? updatedSeed : seed)))
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-green-800 dark:text-green-400">Uzhavan</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
                {language === "en" ? "தமிழ்" : "English"}
              </Button>
              <Button asChild>
                <Link href="/farmer/add-seed">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addNewSeed}
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.welcome}, {currentUser.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {language === "en"
              ? "Manage your seed listings and connect with buyers"
              : "உங்கள் விதை பட்டியல்களை நிர்வகிக்கவும் மற்றும் வாங்குபவர்களுடன் இணைக்கவும்"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8 dark:bg-gray-800">
            <TabsTrigger value="overview" className="dark:data-[state=active]:bg-gray-700">
              {t.overview}
            </TabsTrigger>
            <TabsTrigger value="seeds" className="dark:data-[state=active]:bg-gray-700">
              {t.mySeeds}
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="dark:data-[state=active]:bg-gray-700">
              {t.inquiries}
            </TabsTrigger>
            <TabsTrigger value="profile" className="dark:data-[state=active]:bg-gray-700">
              {t.profile}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">{t.totalSeeds}</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.totalSeeds}</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Active listings" : "செயலில் உள்ள பட்டியல்கள்"}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">{t.totalViews}</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Total seed views" : "மொத்த விதை பார்வைகள்"}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">{t.activeInquiries}</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">{stats.activeInquiries}</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Pending responses" : "நிலுவையில் உள்ள பதில்கள்"}
                  </p>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-200">{t.totalEarnings}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold dark:text-white">₹{stats.totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Potential earnings" : "சாத்தியமான வருமானம்"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Inquiries */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t.recentInquiries}</CardTitle>
              </CardHeader>
              <CardContent>
                {inquiries.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">{t.noInquiries}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.slice(0, 5).map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-start justify-between p-4 border dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold dark:text-white">{inquiry.seedName[language]}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {language === "en" ? "From:" : "அனுப்பியவர்:"} {inquiry.buyerName}
                          </p>
                          <p className="text-sm dark:text-gray-300">{inquiry.message[language]}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {inquiry.buyerPhone}
                            </span>
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {inquiry.buyerEmail}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {t.contact}
                          </Button>
                          <Button size="sm">{t.reply}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seeds" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold dark:text-white">{t.mySeeds}</h3>
              <Button asChild>
                <Link href="/farmer/add-seed">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addNewSeed}
                </Link>
              </Button>
            </div>

            {seeds.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="text-center py-12">
                  <Sprout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{t.noSeeds}</p>
                  <Button asChild>
                    <Link href="/farmer/add-seed">
                      <Plus className="h-4 w-4 mr-2" />
                      {t.addNewSeed}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {seeds.map((seed) => (
                  <Card key={seed.id} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                          {seed.image ? (
                            <img
                              src={seed.image || "/placeholder.svg"}
                              alt={seed.name[language]}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sprout className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-semibold dark:text-white">{seed.name[language]}</h4>
                              <p className="text-gray-600 dark:text-gray-400">{seed.category[language]}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>₹{seed.price}/kg</span>
                                <span>{seed.quantity}</span>
                                <span className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {seed.views}
                                </span>
                                <span className="flex items-center">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {seed.inquiries}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={seed.status === "active" ? "default" : "secondary"}
                                className="dark:bg-gray-700"
                              >
                                {seed.status === "active"
                                  ? t.active
                                  : seed.status === "soldOut"
                                    ? t.soldOut
                                    : t.pending}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4 mr-1" />
                                {t.edit}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteSeed(seed.id)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                {t.delete}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inquiries">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t.inquiries}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {language === "en"
                    ? "Manage inquiries from potential buyers"
                    : "சாத்தியமான வாங்குபவர்களிடமிருந்து விசாரணைகளை நிர்வகிக்கவும்"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inquiries.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">{t.noInquiries}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-4 border dark:border-gray-600 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold dark:text-white">{inquiry.seedName[language]}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {language === "en" ? "From:" : "அனுப்பியவர்:"} {inquiry.buyerName}
                            </p>
                            <p className="text-sm mb-3 dark:text-gray-300">{inquiry.message[language]}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {inquiry.buyerPhone}
                              </span>
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {inquiry.buyerEmail}
                              </span>
                              <span>{new Date(inquiry.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              {t.contact}
                            </Button>
                            <Button size="sm">{t.reply}</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t.profile}</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {language === "en"
                    ? "Manage your farmer profile information"
                    : "உங்கள் விவசாயி சுயவிவர தகவலை நிர்வகிக்கவும்"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        {language === "en" ? "Name" : "பெயர்"}
                      </label>
                      <p className="text-lg dark:text-white">{currentUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        {language === "en" ? "Location" : "இடம்"}
                      </label>
                      <p className="text-lg dark:text-white">
                        {currentUser.location}, {currentUser.district}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        {language === "en" ? "Phone" : "தொலைபேசி"}
                      </label>
                      <p className="text-lg dark:text-white">{currentUser.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        {language === "en" ? "Email" : "மின்னஞ்சல்"}
                      </label>
                      <p className="text-lg dark:text-white">{currentUser.email}</p>
                    </div>
                    {currentUser.farmSize && (
                      <div>
                        <label className="text-sm font-medium dark:text-gray-200">
                          {language === "en" ? "Farm Size" : "பண்ணை அளவு"}
                        </label>
                        <p className="text-lg dark:text-white">{currentUser.farmSize} acres</p>
                      </div>
                    )}
                    {currentUser.experience && (
                      <div>
                        <label className="text-sm font-medium dark:text-gray-200">
                          {language === "en" ? "Experience" : "அனுபவம்"}
                        </label>
                        <p className="text-lg dark:text-white">{currentUser.experience} years</p>
                      </div>
                    )}
                  </div>
                  {currentUser.specialization && (
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        {language === "en" ? "Specialization" : "சிறப்பு"}
                      </label>
                      <p className="text-lg dark:text-white">{currentUser.specialization}</p>
                    </div>
                  )}
                  <Button className="mt-4">{language === "en" ? "Edit Profile" : "சுயவிவரத்தைத் திருத்தவும்"}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
