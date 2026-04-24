import { useState, useEffect } from 'react'

/**
 * Custom hook to track screen size breakpoints
 * Mobile: < 640px
 * Tablet: 640px - 1024px
 * Desktop: > 1024px
 */
export default function useBreakpoint() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const isDesktop = width >= 1024
  const isSmall = width < 1024 // Mobile + Tablet

  return { width, isMobile, isTablet, isDesktop, isSmall }
}
