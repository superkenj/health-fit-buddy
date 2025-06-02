import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add a helper function to determine if the browser has loaded the CSS
export function checkStylesLoaded(): boolean {
  if (typeof window === "undefined") return false

  // Create a test element
  const testElement = document.createElement("div")
  testElement.className = "fitness-card"
  testElement.style.display = "none"
  document.body.appendChild(testElement)

  // Check if our custom styles are applied
  const styles = window.getComputedStyle(testElement)
  const hasCustomStyles = styles.background.includes("linear-gradient") || styles.boxShadow.includes("rgba")

  // Clean up
  document.body.removeChild(testElement)

  return hasCustomStyles
}

// Add a helper to force reload CSS
export function reloadStyles() {
  const links = document.querySelectorAll('link[rel="stylesheet"]')
  links.forEach((link) => {
    const href = link.getAttribute("href")
    if (href) {
      const newHref = href.includes("?") ? `${href}&reload=${Date.now()}` : `${href}?reload=${Date.now()}`
      link.setAttribute("href", newHref)
    }
  })
}
