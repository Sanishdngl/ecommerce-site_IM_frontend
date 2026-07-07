// Common
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export interface ApiPagination {
  total: number
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Auth
export type AdminRole = 'super_admin' | 'maintainer' | 'reporter'

export interface AdminAuthResponse {
  token: string
  user: AdminUser
}

export interface CustomerAuthResponse {
  token: string
  customer: Customer
}

// Admin
export interface AdminUser {
  id: string
  username: string
  email: string
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

// Inventory
export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string
  price: string
  stock_quantity: number
  thumbnail_url: string | null
  list_image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StockAdjustment {
  product_id: string
  stock_quantity: number
}

// System checker
export interface DashboardStats {
  total_products: number
  total_categories: number
  total_admin_users: number
  low_stock_count: number
}

export interface HealthStatus {
  service: string
  ok: boolean
  message: string
  checked_at: string
}

export interface SystemHealth {
  gateway: HealthStatus
  admin: HealthStatus
  inventory: HealthStatus
  customer: HealthStatus
}

export type AuditEntityType = 'admin_user' | 'product' | 'category'
export type AuditAction = 'create' | 'update' | 'delete'

export interface AuditLogEntry {
  id: string
  entity_type: AuditEntityType
  entity_id: string
  action: AuditAction
  performed_by: string
  performed_by_username: string
  metadata: Record<string, unknown> | null
  ip_address: string
  created_at: string
}

// Customer
export interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  oauth_provider: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  product_name: string
  price: string
  thumbnail_url: string | null
  quantity: number
  stock_quantity: number
}

export interface CartResponse {
  items: CartItem[]
}

export interface GuestCartItem {
  productId: string
  name: string
  price: string
  imageUrl: string | null
  quantity: number
}
