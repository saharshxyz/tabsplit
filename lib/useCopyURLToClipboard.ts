import { useCallback } from "react"
import { toast } from "sonner"

export const useCopyURLToClipboard = () => {
  const copyUrlToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("URL copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast.error("Failed to copy URL to clipboard.")
      })
  }, [])

  return copyUrlToClipboard
}
