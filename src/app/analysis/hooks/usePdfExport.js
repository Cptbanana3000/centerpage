import { useState } from 'react';

export default function usePdfExport({ user }) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  async function exportPdf({ analysis, brandName, category }) {
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
      // Verify credits
      const creditRes = await fetch('/api/user-credits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!creditRes.ok) throw new Error('Unable to verify credits.');
      const credits = await creditRes.json();
      if ((credits.deepScans || 0) <= 0) {
        throw new Error('Insufficient Deep Scan credits. PDF exports require 1 Deep Scan credit.');
      }

      // Call export endpoint
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ analysisData: analysis, brandName, category }),
      });

      const data = await res.json();
      if (res.status === 402 || res.status === 403) {
        throw new Error(data.message || 'PDF export failed');
      }
      if (!data.success) {
        throw new Error(data.message || 'PDF export failed.');
      }

      // For MVP: download returned HTML as .html; in future as real PDF
      const blob = new Blob([data.data.html], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.data.filename.replace('.pdf', '.html');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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