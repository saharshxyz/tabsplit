import lzString from 'lz-string'
import { TabSchema } from '@/lib/schemas'

// Compress data to URL hash string
export function compressToHash(data: TabSchema): string {
  const params = new URLSearchParams()
  params.set("tabName", data.tabName || "")
  params.set("tabDescription", JSON.stringify(data.tabDescription))
  params.set("taxAmount", data.taxAmount?.toString() || "")
  params.set("tipBeforeTax", data.tipBeforeTax ? "true" : "false")
  params.set("tipAmount", data.tipAmount?.toString() || "")
  params.set("splitters", JSON.stringify(data.splitters))
  params.set("items", JSON.stringify(data.items))

  return lzString.compressToEncodedURIComponent(params.toString())
}

// Decompress from URL hash
export function decompressFromHash(compressedHash: string): URLSearchParams {
  try {
    const decompressed = lzString.decompressFromEncodedURIComponent(compressedHash)
    if (!decompressed) throw new Error("Failed to decompress hash")
    return new URLSearchParams(decompressed)
  } catch (err) {
    // If decompression fails, try to parse as a regular URLSearchParams
    // This handles backward compatibility with old links
    return new URLSearchParams(compressedHash)
  }
} 