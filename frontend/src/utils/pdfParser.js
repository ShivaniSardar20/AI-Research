import * as pdfjsLib from 'pdfjs-dist'

// Point to the pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

/**
 * Extracts all text content from a PDF file (client-side, no upload needed for preview).
 * @param {File} file - the PDF File object
 * @returns {Promise<{text: string, pages: number}>}
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  const pages = pdf.numPages

  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => item.str).join(' ')
    fullText += pageText + '\n\n'
  }

  await pdf.destroy()
  return { text: fullText.trim(), pages }
}
