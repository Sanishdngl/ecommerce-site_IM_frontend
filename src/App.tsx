import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { AdminRoute } from '@/components/guards/AdminRoute'
import { CustomerRoute } from '@/components/guards/CustomerRoute'
import { RoleRoute } from '@/components/guards/RoleRoute'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import * as R from '@/constants/routes'

const AdminLoginPage = lazy(() => import('@/pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const SystemCheckerPage = lazy(() => import('@/pages/admin/SystemCheckerPage'))
const UsersPage = lazy(() => import('@/pages/admin/users/UsersPage'))
const CreateUserPage = lazy(() => import('@/pages/admin/users/CreateUserPage'))
const EditUserPage = lazy(() => import('@/pages/admin/users/EditUserPage'))
const CategoriesPage = lazy(() => import('@/pages/admin/inventory/CategoriesPage'))
const CreateCategoryPage = lazy(() => import('@/pages/admin/inventory/CreateCategoryPage'))
const EditCategoryPage = lazy(() => import('@/pages/admin/inventory/EditCategoryPage'))
const ProductsPage = lazy(() => import('@/pages/admin/inventory/ProductsPage'))
const CreateProductPage = lazy(() => import('@/pages/admin/inventory/CreateProductPage'))
const EditProductPage = lazy(() => import('@/pages/admin/inventory/EditProductPage'))
const BulkUploadPage = lazy(() => import('@/pages/admin/inventory/BulkUploadPage'))

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const PublicProductsPage = lazy(() => import('@/pages/public/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'))
const LoginPage = lazy(() => import('@/pages/public/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))

const ProfilePage = lazy(() => import('@/pages/public/customer/ProfilePage'))
const CartPage = lazy(() => import('@/pages/public/customer/CartPage'))

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* ── Admin ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <ErrorBoundary>
                  <AdminLayout />
                </ErrorBoundary>
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to={R.ADMIN_DASHBOARD} replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="system-checker" element={<SystemCheckerPage />} />

            {/* super_admin only */}
            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={['super_admin']}>
                  <UsersPage />
                </RoleRoute>
              }
            />
            <Route
              path="users/new"
              element={
                <RoleRoute allowedRoles={['super_admin']}>
                  <CreateUserPage />
                </RoleRoute>
              }
            />
            <Route
              path="users/:id/edit"
              element={
                <RoleRoute allowedRoles={['super_admin']}>
                  <EditUserPage />
                </RoleRoute>
              }
            />

            {/* super_admin + maintainer */}
            <Route path="inventory/categories" element={<CategoriesPage />} />
            <Route
              path="inventory/categories/new"
              element={
                <RoleRoute allowedRoles={['super_admin', 'maintainer']}>
                  <CreateCategoryPage />
                </RoleRoute>
              }
            />
            <Route
              path="inventory/categories/:id/edit"
              element={
                <RoleRoute allowedRoles={['super_admin', 'maintainer']}>
                  <EditCategoryPage />
                </RoleRoute>
              }
            />
            <Route path="inventory/products" element={<ProductsPage />} />
            <Route
              path="inventory/products/new"
              element={
                <RoleRoute allowedRoles={['super_admin', 'maintainer']}>
                  <CreateProductPage />
                </RoleRoute>
              }
            />
            <Route
              path="inventory/products/:id/edit"
              element={
                <RoleRoute allowedRoles={['super_admin', 'maintainer']}>
                  <EditProductPage />
                </RoleRoute>
              }
            />
            <Route
              path="inventory/bulk-upload"
              element={
                <RoleRoute allowedRoles={['super_admin', 'maintainer']}>
                  <BulkUploadPage />
                </RoleRoute>
              }
            />
          </Route>

          {/* ── Public ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<PublicProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ── Customer (protected) ── */}
          <Route
            element={
              <CustomerRoute>
                <CustomerLayout />
              </CustomerRoute>
            }
          >
            <Route path="/customer/profile" element={<ProfilePage />} />
            <Route path="/customer/cart" element={<CartPage />} />
          </Route>

          {/* ── 404 ── */}
          <Route path={R.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
