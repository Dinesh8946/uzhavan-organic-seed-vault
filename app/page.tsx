"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sprout, Users, Search, MessageCircle, Star, MapPin, Filter, Moon, Sun, Heart } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { storage, type Seed, type User } from "@/lib/storage"

const translations = {
  en: {
    title: "Uzhavan Organic Seed Vault",
    subtitle: "Connecting Traditional Farmers with Seed Buyers",
    description: "Direct access to authentic organic seeds from traditional farmers across Tamil Nadu",
    farmerPortal: "Farmer Portal",
    buyerPortal: "Buyer Portal",
    farmerDesc: "Sell your organic seeds directly to buyers",
    buyerDesc: "Find authentic organic seeds from trusted farmers",
    featuredSeeds: "Available Seeds",
    searchPlaceholder: "Search seeds...",
    filterBy: "Filter by category",
    allCategories: "All Categories",
    viewDetails: "View Details",
    contactFarmer: "Contact Farmer",
    organic: "Organic",
    traditional: "Traditional",
    available: "Available",
    perKg: "per kg",
    noSeeds: "No seeds available yet. Farmers can start adding their seeds!",
    addToWishlist: "Add to Wishlist",
    removeFromWishlist: "Remove from Wishlist",
  },
  ta: {
    title: "உழவன் இயற்கை விதை வங்கி",
    subtitle: "பாரம்பரிய விவசாயிகளை விதை வாங்குபவர்களுடன் இணைக்கிறது",
    description: "தமிழ்நாடு முழுவதும் உள்ள பாரம்பரிய விவசாயிகளிடமிருந்து உண்மையான இயற்கை விதைகளுக்கு நேரடி அணுகல்",
    farmerPortal: "விவசாயி போர்ட்டல்",
    buyerPortal: "வாங்குபவர் போர்ட்டல்",
    farmerDesc: "உங்கள் இயற்கை விதைகளை வாங்குபவர்களுக்கு நேரடியாக விற்கவும்",
    buyerDesc: "நம்பகமான விவசாயிகளிடமிருந்து உண்மையான இயற்கை விதைகளைக் கண்டறியவும்",
    featuredSeeds: "கிடைக்கும் விதைகள்",
    searchPlaceholder: "விதைகளைத் தேடுங்கள்...",
    filterBy: "வகையின் அடிப்படையில் வடிகட்டவும்",
    allCategories: "அனைத்து வகைகளும்",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    contactFarmer: "விவசாயியைத் தொடர்பு கொள்ளவும்",
    organic: "இயற்கை",
    traditional: "பாரம்பரிய",
    available: "கிடைக்கிறது",
    perKg: "கிலோ ஒன்றுக்கு",
    noSeeds: "இன்னும் விதைகள் கிடைக்கவில்லை. விவசாயிகள் தங்கள் விதைகளைச் சேர்க்கத் தொடங்கலாம்!",
    addToWishlist: "விருப்பப்பட்டியலில் சேர்க்கவும்",
    removeFromWishlist: "விருப்பப்பட்டியலிலிருந்து அகற்றவும்",
  },
}

const seedCategories = [
  { en: "Paddy", ta: "நெல்" },
  { en: "Millet", ta: "சிறுதானியம்" },
  { en: "Pulses", ta: "பருப்பு வகைகள்" },
  { en: "Vegetables", ta: "காய்கறிகள்" },
  { en: "Spices", ta: "மசாலா பொருட்கள்" },
]

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [seeds, setSeeds] = useState<Seed[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const { theme, setTheme } = useTheme()

  const t = translations[language]

  useEffect(() => {
    // Load seeds and user data
    const loadedSeeds = storage.getSeeds()
    const user = storage.getCurrentUser()
    setSeeds(loadedSeeds)
    setCurrentUser(user)

    if (user && user.userType === "buyer") {
      const userWishlist = storage
        .getWishlist()
        .filter((item) => item.buyerId === user.id)
        .map((item) => item.seedId)
      setWishlist(userWishlist)
    }
  }, [])

  const filteredSeeds = seeds.filter((seed) => {
    const matchesSearch =
      seed.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      seed.farmer[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      seed.location[language].toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || seed.category[language] === selectedCategory
    return matchesSearch && matchesCategory && seed.status === "active"
  })

  const handleWishlistToggle = (seedId: string) => {
    if (!currentUser || currentUser.userType !== "buyer") return

    const isInWishlist = wishlist.includes(seedId)
    if (isInWishlist) {
      storage.removeFromWishlist(currentUser.id, seedId)
      setWishlist((prev) => prev.filter((id) => id !== seedId))
    } else {
      storage.addToWishlist(currentUser.id, seedId)
      setWishlist((prev) => [...prev, seedId])
    }
  }

  const handleSeedView = (seedId: string) => {
    // Increment view count
    const updatedSeed = storage.updateSeed(seedId, { views: seeds.find((s) => s.id === seedId)?.views || 0 + 1 })
    if (updatedSeed) {
      setSeeds((prev) => prev.map((seed) => (seed.id === seedId ? updatedSeed : seed)))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">{t.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
                {language === "en" ? "தமிழ்" : "English"}
              </Button>
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Welcome, {currentUser.name}</span>
                  <Link href={currentUser.userType === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard"}>
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.subtitle}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">{t.description}</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <Link href="/farmer/dashboard">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Sprout className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-green-800 dark:text-green-400">{t.farmerPortal}</CardTitle>
                  <CardDescription className="dark:text-gray-300">{t.farmerDesc}</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <Link href="/buyer/dashboard">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-blue-800 dark:text-blue-400">{t.buyerPortal}</CardTitle>
                  <CardDescription className="dark:text-gray-300">{t.buyerDesc}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 dark:text-white">{t.featuredSeeds}</h3>

          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 dark:bg-gray-800 dark:border-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t.filterBy} />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                <SelectItem value="all">{t.allCategories}</SelectItem>
                {seedCategories.map((category, index) => (
                  <SelectItem key={index} value={category[language]}>
                    {category[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seeds Grid */}
          {filteredSeeds.length === 0 ? (
            <div className="text-center py-12">
              <Sprout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t.noSeeds}</p>
              {!currentUser && (
                <div className="mt-4">
                  <Link href="/auth/register">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeeds.map((seed) => (
                <Card key={seed.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden relative">
                    {seed.image ? (
                      <img
                        src={seed.image || "/placeholder.svg"}
                        alt={seed.name[language]}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sprout className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {currentUser && currentUser.userType === "buyer" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                        onClick={() => handleWishlistToggle(seed.id)}
                      >
                        {wishlist.includes(seed.id) ? (
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg dark:text-white">{seed.name[language]}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {seed.location[language]}
                        </p>
                      </div>
                      {seed.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1 dark:text-gray-300">{seed.rating}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg dark:text-white">
                          ₹{seed.price} {t.perKg}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {seed.quantity} {t.available}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                          {seed.category[language]}
                        </Badge>
                        {seed.organic && (
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 dark:border-green-400">
                            {t.organic}
                          </Badge>
                        )}
                        {seed.traditional && (
                          <Badge variant="outline" className="text-blue-600 dark:text-blue-400 dark:border-blue-400">
                            {t.traditional}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === "en" ? "Farmer:" : "விவசாயி:"} {seed.farmer[language]}
                      </p>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1" onClick={() => handleSeedView(seed.id)}>
                          {t.viewDetails}
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center bg-transparent">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {t.contactFarmer}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 dark:bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sprout className="h-6 w-6" />
            <span className="text-lg font-semibold">{t.title}</span>
          </div>
          <p className="text-green-200 dark:text-gray-400">
            {language === "en"
              ? "Preserving traditional seeds, connecting communities"
              : "பாரம்பரிய விதைகளைப் பாதுகாத்தல், சமூகங்களை இணைத்தல்"}
          </p>
        </div>
      </footer>
    </div>
  )
}
