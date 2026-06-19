import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react'
import { usePublicCategoryList } from '@/hooks/inventory/useCategories'
import { useCartStore } from '@/stores/cart.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useCustomerLogout } from '@/hooks/customer/useCustomerAuth'
import { useCartQuery } from '@/hooks/customer/useCart'
import { Skeleton } from '@/components/common/Skeleton'
import { HOME, PRODUCTS, LOGIN, CUSTOMER_PROFILE, CUSTOMER_CART } from '@/constants/routes'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: categories, isLoading } = usePublicCategoryList()
  const guestCartCount = useCartStore((s) => s.items.length)
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const customer = useCustomerAuthStore((s) => s.customer)
  const { mutate: logoutCustomer } = useCustomerLogout()

  const { data: serverCart } = useCartQuery()
  const cartCount = isAuthenticated ? (serverCart?.length ?? 0) : guestCartCount

  return (
    <div className="w-full">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link to={HOME} className="text-lg font-bold text-gray-900 shrink-0">
            ShopFront
          </Link>

          {/* Desktop category links */}
          <nav className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <Skeleton variant="row" rows={1} className="w-48" />
            ) : (
              (categories ?? []).slice(0, 5).map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`${PRODUCTS}?categoryId=${cat.slug}`}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors',
                      isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                    )
                  }
                >
                  {cat.name}
                </NavLink>
              ))
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to={CUSTOMER_CART} className="relative p-2 text-gray-600 hover:text-gray-900">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px]">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to={CUSTOMER_PROFILE}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <User size={16} />
                {customer?.first_name ?? 'Profile'}
              </Link>
              <button
                onClick={() => logoutCustomer()}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={LOGIN}
              className="hidden sm:block text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 space-y-2">
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.id}
              to={`${PRODUCTS}?categoryId=${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-700 py-1.5"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <>
                <Link
                  to={CUSTOMER_PROFILE}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 py-1.5"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logoutCustomer()
                    setMobileOpen(false)
                  }}
                  className="block text-sm text-gray-500 py-1.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={LOGIN}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-primary-600 py-1.5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
