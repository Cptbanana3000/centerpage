import { useState } from 'react';

export default function usePdfExport({ user }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  async function exportPdf({ analysis, brandName, category, deepScanData }) {
    setExportError(null);
    if (!user) {
      setExportError('Please log in to export PDF reports.');
      return false;
    }
    if (!analysis) {
      setExportError('No analysis data available for export.');
      return false;
    }

    try {
      setExporting(true);
      const token = await user.getIdToken();

      // Call export endpoint. The response will either be a PDF file or a JSON error.
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ analysisData: analysis, brandName, category, deepScanData }),
      });

      // If the response is not OK, it's a JSON error from the API.
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'PDF export failed.');
      }

      // The response is the PDF file. Treat it as a blob to create a download link.
      const pdfBlob = await res.blob();
      
      // Get the filename from the Content-Disposition header.
      const disposition = res.headers.get('content-disposition');
      let filename = 'brand-analysis-report.pdf'; // Fallback filename.
      if (disposition && disposition.includes('attachment')) {
        const filenameMatch = disposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      return true;
    } catch (err) {
      console.error('PDF export error:', err);
      setExportError(err.message);
      return false;
    } finally {
      setExporting(false);
    }
  }

  return { exporting, exportError, exportPdf };
} 