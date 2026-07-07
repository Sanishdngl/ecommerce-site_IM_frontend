import { useEffect } from 'react'

const STOREFRONT_APP_NAME = 'Open Stock'
const ADMIN_APP_NAME = 'Operations'

export function useDocumentTitle(pageName: string) {
  useEffect(() => {
    document.title = `${pageName} — ${STOREFRONT_APP_NAME}`
  }, [pageName])
}

export function useAdminDocumentTitle(pageName: string) {
  useEffect(() => {
    document.title = `${pageName} — ${ADMIN_APP_NAME}`
  }, [pageName])
}
