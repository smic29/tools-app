import { useEffect, useState } from "react"

interface PagePreviewProps {
  totalPages: number
  currentRanges: string
}

// Update the interface
interface PageGroup {
  start: number
  end: number
  pages: number[]
  colorClass: string
}

// Color classes for different files
const FILE_COLORS = [
  "bg-blue-100 border-blue-500 text-blue-800",
  "bg-green-100 border-green-500 text-green-800",
  "bg-purple-100 border-purple-500 text-purple-800",
  "bg-yellow-100 border-yellow-500 text-yellow-800",
  "bg-pink-100 border-pink-500 text-pink-800",
]

function PagePreview({ totalPages, currentRanges }: PagePreviewProps) {
  const [pageGroups, setPageGroups] = useState<PageGroup[]>([])

  useEffect(() => {
    if (!currentRanges || !totalPages) {
      setPageGroups([])
      return
    }

    try {
      const parts = currentRanges.split(",").map(range => range.trim())
      const newGroups: PageGroup[] = []
      let currentColorIndex = 0

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        let start: number, end: number

        if (part.includes("-")) {
          // Handle explicit range (e.g. "1-3")
          const [startStr, endStr] = part.split("-")
          start = parseInt(startStr)
          end = parseInt(endStr)
        } else {
          // Handle single page marker (e.g. "5")
          start = parseInt(part)
          end = totalPages // Default to end of document

          // If there's a next part, end before that page starts
          if (i < parts.length - 1) {
            const nextPart = parts[i + 1]
            const nextStart = nextPart.includes("-")
              ? parseInt(nextPart.split("-")[0])
              : parseInt(nextPart)
            if (!isNaN(nextStart) && nextStart > start) {
              end = nextStart - 1
            }
          }
        }

        if (isNaN(start)) continue

        // Ensure we don't go beyond total pages
        end = Math.min(end, totalPages)
        start = Math.max(1, start)

        const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
        
        newGroups.push({
          start,
          end,
          pages,
          colorClass: FILE_COLORS[currentColorIndex % FILE_COLORS.length]
        })

        currentColorIndex++
      }

      setPageGroups(newGroups)
    } catch {
      setPageGroups([])
    }
  }, [currentRanges, totalPages])

  if (!totalPages) return null

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-sm font-medium">Preview ({totalPages} pages total)</h3>
      
      {/* Files summary */}
      <div className="space-y-2">
        {pageGroups.map((group, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${group.colorClass}`}>
              {index + 1}
            </div>
            <span className="text-sm">
              File {index + 1} - Pages {group.start}{group.start !== group.end ? `-${group.end}` : ''}
              {group.pages.length > 1 ? ` (${group.pages.length} pages)` : ''}
            </span>
          </div>
        ))}
      </div>

      {/* Visual pages grid */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const groupIndex = pageGroups.findIndex(g => g.pages.includes(page))
          const group = groupIndex >= 0 ? pageGroups[groupIndex] : null
          
          return (
            <div
              key={page}
              className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium ${
                group
                  ? `${group.colorClass} border-2 font-bold`
                  : "bg-background border-border"
              }`}
            >
              {page}
            </div>
          )
        })}
      </div>

      {/* Help text */}
      {!pageGroups.length && (
        <p className="text-xs text-muted-foreground">
          {`Enter page ranges above (e.g. "1-3,5,8-10")`}
        </p>
      )}
    </div>
  )
}

export default PagePreview