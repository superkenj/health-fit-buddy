"use client"

import { useEffect, useState } from "react"
import { checkStylesLoaded, reloadStyles } from "@/lib/utils"
import { AlertCircle, RefreshCw } from "lucide-react"

export function StyleChecker() {
  const [stylesLoaded, setStylesLoaded] = useState(true)

  useEffect(() => {
    // Check if styles are loaded after a short delay
    const timer = setTimeout(() => {
      const loaded = checkStylesLoaded()
      setStylesLoaded(loaded)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (stylesLoaded) return null

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      <span>Styles not loaded properly</span>
      <button
        onClick={() => {
          reloadStyles()
          window.location.reload()
        }}
        className="ml-2 bg-white text-red-500 p-1 rounded-md flex items-center"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  )
}
