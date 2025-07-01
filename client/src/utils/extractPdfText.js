// utils/extractPdfText.js
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerURL from 'pdfjs-dist/build/pdf.worker.min?url';

GlobalWorkerOptions.workerSrc = workerURL;

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}
