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
          <Link
            to={HOME}
            className="font-display text-xl font-semibold text-ink shrink-0 tracking-tight"
          >
            Open Stock
          </Link>

          {/* Desktop category links */}
          <nav className="hidden md:flex items-center gap-5">
            {isLoading ? (
              <Skeleton variant="row" rows={1} className="w-48" />
            ) : (
              (categories ?? []).slice(0, 5).map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`${PRODUCTS}?categoryId=${cat.slug}`}
                  className={({ isActive }) =>
                    cn(
                      'text-sm font-medium transition-colors border-b-[1.5px] pb-0.5',
                      isActive
                        ? 'text-stamp border-stamp'
                        : 'text-ink/60 border-transparent hover:text-ink'
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
          <Link to={CUSTOMER_CART} className="relative p-2 text-ink/70 hover:text-ink">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-stamp text-paper text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to={CUSTOMER_PROFILE}
                className="flex items-center gap-1.5 text-sm font-medium text-ink/80 hover:text-ink"
              >
                <User size={16} />
                {customer?.first_name ?? 'Profile'}
              </Link>
              <button
                onClick={() => logoutCustomer()}
                className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink/80"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to={LOGIN}
              className="hidden sm:block text-sm font-medium text-stamp hover:text-stamp-dark"
            >
              Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ink/70"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink/15 px-4 py-3 space-y-2 bg-paper">
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.id}
              to={`${PRODUCTS}?categoryId=${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink/80 py-1.5"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-ink/15">
            {isAuthenticated ? (
              <>
                <Link
                  to={CUSTOMER_PROFILE}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-ink/80 py-1.5"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logoutCustomer()
                    setMobileOpen(false)
                  }}
                  className="block text-sm text-ink/50 py-1.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={LOGIN}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-stamp py-1.5"
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
