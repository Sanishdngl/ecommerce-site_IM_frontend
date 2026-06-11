// Admin
export const ADMIN_LOGIN = '/admin/login'
export const ADMIN_DASHBOARD = '/admin/dashboard'

export const ADMIN_USERS = '/admin/users'
export const ADMIN_USERS_NEW = '/admin/users/new'
export const adminUsersEdit = (id: string) => `/admin/users/${id}/edit`

export const ADMIN_CATEGORIES = '/admin/inventory/categories'
export const ADMIN_CATEGORIES_NEW = '/admin/inventory/categories/new'
export const adminCategoriesEdit = (id: string) => `/admin/inventory/categories/${id}/edit`

export const ADMIN_PRODUCTS = '/admin/inventory/products'
export const ADMIN_PRODUCTS_NEW = '/admin/inventory/products/new'
export const adminProductsEdit = (id: string) => `/admin/inventory/products/${id}/edit`

export const ADMIN_BULK_UPLOAD = '/admin/inventory/bulk-upload'

// Public
export const HOME = '/'
export const PRODUCTS = '/products'
export const productDetail = (id: string) => `/products/${id}`
export const LOGIN = '/login'
export const REGISTER = '/register'
export const AUTH_CALLBACK = '/auth/callback'
export const NOT_FOUND = '*'

// Customer 
export const CUSTOMER_PROFILE = '/customer/profile'
export const CUSTOMER_CART = '/customer/cart'
