// Common
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

// Auth
export type AdminRole = 'super_admin' | 'maintainer' | 'viewer'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AdminAuthResponse extends AuthTokens {
  user: AdminUser
}

export interface CustomerAuthResponse extends AuthTokens {
  customer: Customer
}

// Admin
export interface AdminUser {
  id: string
  username: string
  email: string
  role: AdminRole
  isActive: boolean
  createdAt: string
}

// Inventory
export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string | null
  categoryId: string
  category: Pick<Category, 'id' | 'name'>
  createdAt: string
  updatedAt: string
}

export interface StockAdjustment {
  productId: string
  delta: number
  reason?: string
  newQuantity: number
  adjustedAt: string
}

// Customer
export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export interface CartItem {
  id: string
  productId: string
  product: Pick<Product, 'id' | 'name' | 'price' | 'imageUrl' | 'stockQuantity'>
  quantity: number
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface GuestCartItem {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
}
