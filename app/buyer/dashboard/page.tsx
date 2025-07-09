"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sprout, Search, Heart, ShoppingCart, MessageCircle, Star, MapPin, Filter, Eye } from "lucide-react"
import Link from "next/link"

const translations = {
  en: {
    dashboard: "Buyer Dashboard",
    welcome: "Welcome back",
    browse: "Browse Seeds",
    wishlist: "Wishlist",
    orders: "My Orders",
    messages: "Messages",
    profile: "Profile",
    searchSeeds: "Search Seeds",
    filterBy: "Filter by category",
    allCategories: "All Categories",
    availableSeeds: "Available Seeds",
    addToWishlist: "Add to Wishlist",
    contactFarmer: "Contact Farmer",
    viewDetails: "View Details",
    addToCart: "Add to Cart",
    organic: "Organic",
    traditional: "Traditional",
    perKg: "per kg",
    available: "Available",
    farmer: "Farmer",
    location: "Location",
    rating: "Rating",
    recentlyViewed: "Recently Viewed",
    savedSeeds: "Saved Seeds",
    orderHistory: "Order History",
    activeChats: "Active Chats",
  },
  ta: {
    dashboard: "வாங்குபவர் டாஷ்போர்டு",
    welcome: "மீண்டும் வரவேற்கிறோம்",
    browse: "விதைகளைப் பார்க்கவும்",
    wishlist: "விருப்பப்பட்டியல்",
    orders: "என் ஆர்டர்கள்",
    messages: "செய்திகள்",
    profile: "சுயவிவரம்",
    searchSeeds: "விதைகளைத் தேடுங்கள்",
    filterBy: "வகையின் அடிப்படையில் வடிகட்டவும்",
    allCategories: "அனைத்து வகைகளும்",
    availableSeeds: "கிடைக்கும் விதைகள்",
    addToWishlist: "விருப்பப்பட்டியலில் சேர்க்கவும்",
    contactFarmer: "விவசாயியைத் தொடர்பு கொள்ளவும்",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    addToCart: "கார்ட்டில் சேர்க்கவும்",
    organic: "இயற்கை",
    traditional: "பாரம்பரிய",
    perKg: "கிலோ ஒன்றுக்கு",
    available: "கிடைக்கிறது",
    farmer: "விவசாயி",
    location: "இடம்",
    rating: "மதிப்பீடு",
    recentlyViewed: "சமீபத்தில் பார்த்தவை",
    savedSeeds: "சேமித்த விதைகள்",
    orderHistory: "ஆர்டர் வரலாறு",
    activeChats: "செயலில் உள்ள அரட்டைகள்",
  },
}

const seedCategories = [
  { en: "Paddy", ta: "நெல்" },
  { en: "Millet", ta: "சிறுதானியம்" },
  { en: "Pulses", ta: "பருப்பு வகைகள்" },
  { en: "Vegetables", ta: "காய்கறிகள்" },
  { en: "Spices", ta: "மசாலா பொருட்கள்" },
]

const availableSeeds = [
  {
    id: 1,
    name: { en: "Traditional Ponni Rice", ta: "பாரம்பரிய பொன்னி அரிசி" },
    farmer: { en: "Raman Kumar", ta: "ராமன் குமார்" },
    location: { en: "Thanjavur", ta: "தஞ்சாவூர்" },
    price: 120,
    category: { en: "Paddy", ta: "நெல்" },
    quantity: "50 kg",
    rating: 4.8,
    tags: ["organic", "traditional"],
    image: "/placeholder.svg?height=200&width=300",
    phone: "+91 98765 43210",
  },
  {
    id: 2,
    name: { en: "Finger Millet Seeds", ta: "கேழ்வரகு விதைகள்" },
    farmer: { en: "Lakshmi Devi", ta: "லட்சுமி தேவி" },
    location: { en: "Salem", ta: "சேலம்" },
    price: 80,
    category: { en: "Millet", ta: "சிறுதானியம்" },
    quantity: "25 kg",
    rating: 4.9,
    tags: ["organic"],
    image: "/placeholder.svg?height=200&width=300",
    phone: "+91 87654 32109",
  },
  {
    id: 3,
    name: { en: "Black Gram Seeds", ta: "உளுந்து விதைகள்" },
    farmer: { en: "Murugan S", ta: "முருகன் எஸ்" },
    location: { en: "Coimbatore", ta: "கோயம்புத்தூர்" },
    price: 150,
    category: { en: "Pulses", ta: "பருப்பு வகைகள்" },
    quantity: "30 kg",
    rating: 4.7,
    tags: ["traditional"],
    image: "/placeholder.svg?height=200&width=300",
    phone: "+91 76543 21098",
  },
]

const wishlistSeeds = [
  {
    id: 1,
    name: { en: "Traditional Ponni Rice", ta: "பாரம்பரிய பொன்னி அரிசி" },
    farmer: { en: "Raman Kumar", ta: "ராமன் குமார்" },
    price: 120,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    name: { en: "Finger Millet Seeds", ta: "கேழ்வரகு விதைகள்" },
    farmer: { en: "Lakshmi Devi", ta: "லட்சுமி தேவி" },
    price: 80,
    image: "/placeholder.svg?height=100&width=150",
  },
]

export default function BuyerDashboard() {
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const t = translations[language]

  const filteredSeeds = availableSeeds.filter((seed) => {
    const matchesSearch =
      seed.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      seed.farmer[language].toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || seed.category[language] === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-green-800">Uzhavan</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
                {language === "en" ? "தமிழ்" : "English"}
              </Button>
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (2)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}, Priya!</h2>
          <p className="text-gray-600">
            {language === "en"
              ? "Discover authentic organic seeds from trusted farmers"
              : "நம்பகமான விவசாயிகளிடமிருந்து உண்மையான இயற்கை விதைகளைக் கண்டறியுங்கள்"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="browse">{t.browse}</TabsTrigger>
            <TabsTrigger value="wishlist">{t.wishlist}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
            <TabsTrigger value="messages">{t.messages}</TabsTrigger>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={t.searchSeeds}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={t.filterBy} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allCategories}</SelectItem>
                      {seedCategories.map((category, index) => (
                        <SelectItem key={index} value={category[language]}>
                          {category[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Available Seeds */}
            <div>
              <h3 className="text-2xl font-bold mb-6">{t.availableSeeds}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeeds.map((seed) => (
                  <Card key={seed.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                      <img
                        src={seed.image || "/placeholder.svg"}
                        alt={seed.name[language]}
                        className="w-full h-full object-cover"
                      />
                      <Button size="sm" variant="outline" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{seed.name[language]}</CardTitle>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {seed.location[language]}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{seed.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">
                            ₹{seed.price} {t.perKg}
                          </span>
                          <span className="text-sm text-gray-600">
                            {seed.quantity} {t.available}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{seed.category[language]}</Badge>
                          {seed.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-green-600">
                              {tag === "organic" ? t.organic : t.traditional}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600">
                          {t.farmer}: {seed.farmer[language]}
                        </p>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {t.addToCart}
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {t.contactFarmer}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">{t.savedSeeds}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistSeeds.map((seed) => (
                  <Card key={seed.id}>
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      <img
                        src={seed.image || "/placeholder.svg"}
                        alt={seed.name[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{seed.name[language]}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {t.farmer}: {seed.farmer[language]}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">
                          ₹{seed.price} {t.perKg}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {t.addToCart}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          {t.viewDetails}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t.orderHistory}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Track your seed orders and purchase history"
                    : "உங்கள் விதை ஆர்டர்கள் மற்றும் வாங்குதல் வரலாற்றைக் கண்காணிக்கவும்"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === "en"
                      ? "No orders yet. Start shopping for organic seeds!"
                      : "இன்னும் ஆர்டர்கள் இல்லை. இயற்கை விதைகளுக்கு ஷாப்பிங் செய்யத் தொடங்குங்கள்!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>{t.activeChats}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Communicate with farmers about seed inquiries"
                    : "விதை விசாரணைகள் குறித்து விவசாயிகளுடன் தொடர்பு கொள்ளுங்கள்"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === "en"
                      ? "No active conversations. Contact farmers to start chatting!"
                      : "செயலில் உள்ள உரையாடல்கள் இல்லை. அரட்டை தொடங்க விவசாயிகளைத் தொடர்பு கொள்ளுங்கள்!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t.profile}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Manage your buyer profile information"
                    : "உங்கள் வாங்குபவர் சுயவிவர தகவலை நிர்வகிக்கவும்"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{language === "en" ? "Name" : "பெயர்"}</label>
                      <p className="text-lg">Priya Sharma</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{language === "en" ? "Location" : "இடம்"}</label>
                      <p className="text-lg">Chennai, Tamil Nadu</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{language === "en" ? "Phone" : "தொலைபேசி"}</label>
                      <p className="text-lg">+91 98765 43210</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{language === "en" ? "Email" : "மின்னஞ்சல்"}</label>
                      <p className="text-lg">priya@email.com</p>
                    </div>
                  </div>
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
