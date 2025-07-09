// Local storage utilities for data persistence
export interface Seed {
  id: string
  name: { en: string; ta: string }
  farmer: { en: string; ta: string }
  location: { en: string; ta: string }
  price: number
  category: { en: string; ta: string }
  variety: string
  description: string
  quantity: string
  minimumOrder: string
  district: string
  village: string
  phone: string
  whatsapp?: string
  email: string
  organic: boolean
  traditional: boolean
  nonGmo: boolean
  pesticideFree: boolean
  tags: string[]
  image?: string
  rating: number
  views: number
  inquiries: number
  status: "active" | "soldOut" | "pending"
  dateAdded: string
  farmerId: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  userType: "farmer" | "buyer"
  district: string
  location: string
  farmSize?: string
  experience?: string
  specialization?: string
}

export interface Inquiry {
  id: string
  seedId: string
  seedName: { en: string; ta: string }
  buyerId: string
  buyerName: string
  buyerPhone: string
  buyerEmail: string
  farmerId: string
  message: { en: string; ta: string }
  date: string
  status: "pending" | "replied" | "closed"
}

export interface Wishlist {
  id: string
  buyerId: string
  seedId: string
  dateAdded: string
}

// Storage functions
export const storage = {
  // Seeds
  getSeeds: (): Seed[] => {
    if (typeof window === "undefined") return []
    const seeds = localStorage.getItem("uzhavan_seeds")
    return seeds ? JSON.parse(seeds) : []
  },

  saveSeeds: (seeds: Seed[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("uzhavan_seeds", JSON.stringify(seeds))
  },

  addSeed: (seed: Omit<Seed, "id" | "views" | "inquiries" | "rating" | "dateAdded">) => {
    const seeds = storage.getSeeds()
    const newSeed: Seed = {
      ...seed,
      id: Date.now().toString(),
      views: 0,
      inquiries: 0,
      rating: 0,
      dateAdded: new Date().toISOString(),
    }
    seeds.push(newSeed)
    storage.saveSeeds(seeds)
    return newSeed
  },

  updateSeed: (id: string, updates: Partial<Seed>) => {
    const seeds = storage.getSeeds()
    const index = seeds.findIndex((seed) => seed.id === id)
    if (index !== -1) {
      seeds[index] = { ...seeds[index], ...updates }
      storage.saveSeeds(seeds)
      return seeds[index]
    }
    return null
  },

  deleteSeed: (id: string) => {
    const seeds = storage.getSeeds()
    const filteredSeeds = seeds.filter((seed) => seed.id !== id)
    storage.saveSeeds(filteredSeeds)
  },

  // Users
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("uzhavan_users")
    return users ? JSON.parse(users) : []
  },

  saveUsers: (users: User[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("uzhavan_users", JSON.stringify(users))
  },

  addUser: (user: Omit<User, "id">) => {
    const users = storage.getUsers()
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    }
    users.push(newUser)
    storage.saveUsers(users)
    return newUser
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userId = localStorage.getItem("uzhavan_current_user")
    if (!userId) return null
    const users = storage.getUsers()
    return users.find((user) => user.id === userId) || null
  },

  setCurrentUser: (userId: string) => {
    if (typeof window === "undefined") return
    localStorage.setItem("uzhavan_current_user", userId)
  },

  logout: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("uzhavan_current_user")
  },

  // Inquiries
  getInquiries: (): Inquiry[] => {
    if (typeof window === "undefined") return []
    const inquiries = localStorage.getItem("uzhavan_inquiries")
    return inquiries ? JSON.parse(inquiries) : []
  },

  saveInquiries: (inquiries: Inquiry[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("uzhavan_inquiries", JSON.stringify(inquiries))
  },

  addInquiry: (inquiry: Omit<Inquiry, "id" | "date" | "status">) => {
    const inquiries = storage.getInquiries()
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "pending",
    }
    inquiries.push(newInquiry)
    storage.saveInquiries(inquiries)

    // Update seed inquiry count
    const seeds = storage.getSeeds()
    const seedIndex = seeds.findIndex((seed) => seed.id === inquiry.seedId)
    if (seedIndex !== -1) {
      seeds[seedIndex].inquiries += 1
      storage.saveSeeds(seeds)
    }

    return newInquiry
  },

  // Wishlist
  getWishlist: (): Wishlist[] => {
    if (typeof window === "undefined") return []
    const wishlist = localStorage.getItem("uzhavan_wishlist")
    return wishlist ? JSON.parse(wishlist) : []
  },

  saveWishlist: (wishlist: Wishlist[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("uzhavan_wishlist", JSON.stringify(wishlist))
  },

  addToWishlist: (buyerId: string, seedId: string) => {
    const wishlist = storage.getWishlist()
    const exists = wishlist.find((item) => item.buyerId === buyerId && item.seedId === seedId)
    if (!exists) {
      const newItem: Wishlist = {
        id: Date.now().toString(),
        buyerId,
        seedId,
        dateAdded: new Date().toISOString(),
      }
      wishlist.push(newItem)
      storage.saveWishlist(wishlist)
      return newItem
    }
    return null
  },

  removeFromWishlist: (buyerId: string, seedId: string) => {
    const wishlist = storage.getWishlist()
    const filtered = wishlist.filter((item) => !(item.buyerId === buyerId && item.seedId === seedId))
    storage.saveWishlist(filtered)
  },
}
