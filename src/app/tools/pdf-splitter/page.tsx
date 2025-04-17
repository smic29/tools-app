"use client"

import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { toast } from "sonner"
import PagePreview from "@/components/pdf-splitter/PagePreview"

export default function SplitPDFPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pageRanges, setPageRanges] = useState("")
  const [totalPages, setTotalPages] = useState<number>(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.type === "application/pdf") {
      try {
        const buffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(buffer)
        setTotalPages(pdfDoc.getPageCount())
        setPdfFile(file)
        toast.success("File uploaded successfully!")
      } catch {
        toast.error("Failed to load PDF")
        setPdfFile(null)
        setTotalPages(0)
      }
    } else {
      setPdfFile(null)
      setTotalPages(0)
      toast.error("Please upload a valid PDF file.")
    }
  }

  const handleSplit = async () => {
    if (!pdfFile || !pageRanges) {
      toast.error("Please upload a PDF and enter page ranges.")
      return
    }

    const buffer = await pdfFile.arrayBuffer()
    const pdfDoc = await PDFDocument.load(buffer)
    const totalPages = pdfDoc.getPageCount()

    if (totalPages > 200) {
      toast.error("PDF is too large (max 200 pages allowed).")
      return
    }

    const parts = pageRanges.split(",").map(range => range.trim())
    const pageGroups: [number, number][] = []

    try {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (part.includes("-")) {
          const [startStr, endStr] = part.split("-")
          const start = parseInt(startStr)
          const end = parseInt(endStr)

          if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > totalPages) {
            throw new Error(`Invalid range: ${part}`)
          }

          pageGroups.push([start, end])
        } else {
          const start = parseInt(part)
          if (isNaN(start) || start < 1 || start > totalPages) {
            throw new Error(`Invalid page: ${part}`)
          }

          let end = totalPages
          const next = parts[i + 1]
          if (next) {
            const nextStart = next.includes("-")
              ? parseInt(next.split("-")[0])
              : parseInt(next)
            if (!isNaN(nextStart) && nextStart > start) {
              end = nextStart - 1
            }
          }

          pageGroups.push([start, end])
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Invalid input format.")
      }
      return
    }

    for (let i = 0; i < pageGroups.length; i++) {
      const [start, end] = pageGroups[i]
      const range = [...Array(end - start + 1).keys()].map(j => j + (start - 1)) // 0-based

      const newPdf = await PDFDocument.create()
      const copiedPages = await newPdf.copyPages(pdfDoc, range)
      copiedPages.forEach(page => newPdf.addPage(page))

      const bytes = await newPdf.save()
      downloadBlob(bytes, `split-part-${i + 1}.pdf`)
    }

    toast.success("PDF split into parts!")
  }

  const downloadBlob = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">PDF Splitter</h1>
              <p className="text-muted-foreground mt-2">
                Split PDFs into multiple files by page ranges
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Tools</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="space-y-4 py-6">
            <h2 className="text-xl font-semibold text-center">PDF Page Splitter</h2>

            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            <Input
              type="text"
              placeholder="Enter page ranges (e.g. 1-3,4-6,7)"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
            />

            <PagePreview totalPages={totalPages} currentRanges={pageRanges} />

            <Button onClick={handleSplit} disabled={!pdfFile || !pageRanges}>
              Split PDF
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
