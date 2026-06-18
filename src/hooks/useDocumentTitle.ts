import { useEffect } from 'react'

const APP_NAME = 'ShopAdmin'

export function useDocumentTitle(pageName: string) {
  useEffect(() => {
    document.title = `${pageName} — ${APP_NAME}`
  }, [pageName])
}
