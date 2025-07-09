"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sprout, Upload, ArrowLeft, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

import { get, set } from "@/lib/utils"

const translations = {
  en: {
    title: "Add New Seed",
    subtitle: "List your organic seeds for buyers",
    basicInfo: "Basic Information",
    seedName: "Seed Name",
    seedNamePlaceholder: "Enter seed name (e.g., Traditional Ponni Rice)",
    category: "Category",
    selectCategory: "Select category",
    variety: "Variety/Type",
    varietyPlaceholder: "Enter variety or type",
    description: "Description",
    descriptionPlaceholder: "Describe your seed quality, farming method, etc.",
    pricingStock: "Pricing & Stock",
    pricePerKg: "Price per KG (₹)",
    pricePlaceholder: "Enter price",
    availableQuantity: "Available Quantity (KG)",
    quantityPlaceholder: "Enter quantity",
    minimumOrder: "Minimum Order (KG)",
    minOrderPlaceholder: "Enter minimum order",
    certifications: "Certifications & Tags",
    organic: "Organic Certified",
    traditional: "Traditional/Heirloom",
    nonGmo: "Non-GMO",
    pesticidefree: "Pesticide Free",
    images: "Images",
    uploadImages: "Upload Seed Images",
    dragDrop: "Drag and drop images here, or click to select",
    location: "Location Details",
    district: "District",
    selectDistrict: "Select district",
    village: "Village/Area",
    villagePlaceholder: "Enter village or area name",
    contact: "Contact Information",
    phone: "Phone Number",
    phonePlaceholder: "Enter phone number",
    whatsapp: "WhatsApp Number",
    whatsappPlaceholder: "Enter WhatsApp number (optional)",
    email: "Email",
    emailPlaceholder: "Enter email address",
    save: "Save Seed Listing",
    cancel: "Cancel",
    back: "Back to Dashboard",
  },
  ta: {
    title: "புதிய விதை சேர்க்கவும்",
    subtitle: "வாங்குபவர்களுக்கு உங்கள் இயற்கை விதைகளைப் பட்டியலிடுங்கள்",
    basicInfo: "அடிப்படை தகவல்",
    seedName: "விதை பெயர்",
    seedNamePlaceholder: "விதை பெயரை உள்ளிடவும் (எ.கா., பாரம்பரிய பொன்னி அரிசி)",
    category: "வகை",
    selectCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
    variety: "வகை/வகை",
    varietyPlaceholder: "வகை அல்லது வகையை உள்ளிடவும்",
    description: "விளக்கம்",
    descriptionPlaceholder: "உங்கள் விதை தரம், விவசாய முறை போன்றவற்றை விவரிக்கவும்",
    pricingStock: "விலை மற்றும் இருப்பு",
    pricePerKg: "கிலோ ஒன்றுக்கு விலை (₹)",
    pricePlaceholder: "விலையை உள்ளிடவும்",
    availableQuantity: "கிடைக்கும் அளவு (கிலோ)",
    quantityPlaceholder: "அளவை உள்ளிடவும்",
    minimumOrder: "குறைந்தபட்ச ஆர்டர் (கிலோ)",
    minOrderPlaceholder: "குறைந்தபட்ச ஆர்டரை உள்ளிடவும்",
    certifications: "சான்றிதழ்கள் மற்றும் குறிச்சொற்கள்",
    organic: "இயற்கை சான்றிதழ்",
    traditional: "பாரம்பரிய/பரம்பரை",
    nonGmo: "மரபணு மாற்றமில்லாத",
    pesticidefree: "பூச்சிக்கொல்லி இல்லாத",
    images: "படங்கள்",
    uploadImages: "விதை படங்களை பதிவேற்றவும்",
    dragDrop: "படங்களை இங்கே இழுத்து விடவும், அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும்",
    location: "இடம் விவரங்கள்",
    district: "மாவட்டம்",
    selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
    village: "கிராமம்/பகுதி",
    villagePlaceholder: "கிராமம் அல்லது பகுதி பெயரை உள்ளிடவும்",
    contact: "தொடர்பு தகவல்",
    phone: "தொலைபேசி எண்",
    phonePlaceholder: "தொலைபேசி எண்ணை உள்ளிடவும்",
    whatsapp: "வாட்ஸ்அப் எண்",
    whatsappPlaceholder: "வாட்ஸ்அப் எண்ணை உள்ளிடவும் (விருப்பம்)",
    email: "மின்னஞ்சல்",
    emailPlaceholder: "மின்னஞ்சல் முகவரியை உள்ளிடவும்",
    save: "விதை பட்டியலைச் சேமிக்கவும்",
    cancel: "ரத்து செய்",
    back: "டாஷ்போர்டுக்குத் திரும்பு",
  },
}

const categories = [
  { en: "Paddy", ta: "நெல்" },
  { en: "Millet", ta: "சிறுதானியம்" },
  { en: "Pulses", ta: "பருப்பு வகைகள்" },
  { en: "Vegetables", ta: "காய்கறிகள்" },
  { en: "Spices", ta: "மசாலா பொருட்கள்" },
  { en: "Oil Seeds", ta: "எண்ணெய் விதைகள்" },
]

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

export default function AddSeedPage() {
  const [language, setLanguage] = useState<"en" | "ta">("en")
  const [formData, setFormData] = useState({
    seedName: "",
    category: "",
    variety: "",
    description: "",
    price: "",
    quantity: "",
    minimumOrder: "",
    district: "",
    village: "",
    phone: "",
    whatsapp: "",
    email: "",
    organic: false,
    traditional: false,
    nonGmo: false,
    pesticideFree: false,
  })
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const t = translations[language]

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = get("seedFormData")
    if (storedData) {
      setFormData(storedData)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors: any = {}
    if (!formData.seedName) validationErrors.seedName = "Seed Name is required"
    if (!formData.category) validationErrors.category = "Category is required"
    if (!formData.price) validationErrors.price = "Price is required"
    if (!formData.quantity) validationErrors.quantity = "Quantity is required"
    if (!formData.district) validationErrors.district = "District is required"
    if (!formData.phone) validationErrors.phone = "Phone is required"
    if (!formData.email) validationErrors.email = "Email is required"

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    // In a real app, this would submit to backend
    console.log("Seed data:", formData)
    set("seedFormData", formData) // Save to localStorage
    router.push("/farmer/dashboard")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/farmer/dashboard" className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                <ArrowLeft className="h-5 w-5" />
                <span>{t.back}</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-green-800 dark:text-green-500">{t.title}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === "light" ? "Dark" : "Light"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === "en" ? "ta" : "en")}>
                {language === "en" ? "தமிழ்" : "English"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t.basicInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seedName" className="text-gray-700 dark:text-gray-300">
                      {t.seedName}
                    </Label>
                    <Input
                      id="seedName"
                      placeholder={t.seedNamePlaceholder}
                      value={formData.seedName}
                      onChange={(e) => handleInputChange("seedName", e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.seedName && <p className="text-red-500">{errors.seedName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                      {t.category}
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        {categories.map((category, index) => (
                          <SelectItem
                            key={index}
                            value={category[language]}
                            className="text-gray-900 dark:text-gray-100"
                          >
                            {category[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500">{errors.category}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="variety" className="text-gray-700 dark:text-gray-300">
                    {t.variety}
                  </Label>
                  <Input
                    id="variety"
                    placeholder={t.varietyPlaceholder}
                    value={formData.variety}
                    onChange={(e) => handleInputChange("variety", e.target.value)}
                    className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    {t.description}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t.descriptionPlaceholder}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Stock */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t.pricingStock}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-gray-700 dark:text-gray-300">
                      {t.pricePerKg}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder={t.pricePlaceholder}
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.price && <p className="text-red-500">{errors.price}</p>}
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="text-gray-700 dark:text-gray-300">
                      {t.availableQuantity}
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder={t.quantityPlaceholder}
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                  </div>
                  <div>
                    <Label htmlFor="minimumOrder" className="text-gray-700 dark:text-gray-300">
                      {t.minimumOrder}
                    </Label>
                    <Input
                      id="minimumOrder"
                      type="number"
                      placeholder={t.minOrderPlaceholder}
                      value={formData.minimumOrder}
                      onChange={(e) => handleInputChange("minimumOrder", e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t.certifications}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={formData.organic}
                      onCheckedChange={(checked) => handleInputChange("organic", checked as boolean)}
                      className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Label htmlFor="organic" className="text-gray-700 dark:text-gray-300">
                      {t.organic}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="traditional"
                      checked={formData.traditional}
                      onCheckedChange={(checked) => handleInputChange("traditional", checked as boolean)}
                      className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Label htmlFor="traditional" className="text-gray-700 dark:text-gray-300">
                      {t.traditional}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nonGmo"
                      checked={formData.nonGmo}
                      onCheckedChange={(checked) => handleInputChange("nonGmo", checked as boolean)}
                      className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Label htmlFor="nonGmo" className="text-gray-700 dark:text-gray-300">
                      {t.nonGmo}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pesticideFree"
                      checked={formData.pesticideFree}
                      onCheckedChange={(checked) => handleInputChange("pesticideFree", checked as boolean)}
                      className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Label htmlFor="pesticideFree" className="text-gray-700 dark:text-gray-300">
                      {t.pesticidefree}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t.images}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{t.uploadImages}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.dragDrop}</p>
                  <Button type="button" variant="outline" className="mt-4 bg-transparent">
                    {language === "en" ? "Select Images" : "படங்களைத் தேர்ந்தெடுக்கவும்"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t.location}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district" className="text-gray-700 dark:text-gray-300">
                      {t.district}
                    </Label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder={t.selectDistrict} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        {districts.map((district) => (
                          <SelectItem key={district} value={district} className="text-gray-900 dark:text-gray-100">
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.district && <p className="text-red-500">{errors.district}</p>}
                  </div>
                  <div>
                    <Label htmlFor="village" className="text-gray-700 dark:text-gray-300">
                      {t.village}
                    </Label>
                    <Input
                      id="village"
                      placeholder={t.villagePlaceholder}
                      value={formData.village}
                      onChange={(e) => handleInputChange("village", e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white dark:bg-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{t.contact}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                      {t.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="whatsapp" className="text-gray-700 dark:text-gray-300">
                      {t.whatsapp}
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder={t.whatsappPlaceholder}
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      {t.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                {t.cancel}
              </Button>
              <Button type="submit">{t.save}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
