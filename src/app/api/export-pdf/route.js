import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import databaseService from '@/services/database';

export async function POST(request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: 'Invalid authentication token' }, { status: 401 });
  }

  if (!decodedToken.email_verified) {
    return NextResponse.json({ 
      message: 'Email not verified. Please check your inbox for a verification link.',
      code: 'EMAIL_NOT_VERIFIED'
    }, { status: 403 });
  }
  
  const userId = decodedToken.uid;

  // Check and deduct deepScans credits for PDF export
  const userHasCredits = await databaseService.checkAndDeductCredits(userId, 'deepScans');
  if (!userHasCredits) {
    return NextResponse.json({
      message: 'Insufficient Deep Scan credits. PDF exports require 1 Deep Scan credit.',
      code: 'INSUFFICIENT_CREDITS'
    }, { status: 402 }); // 402 Payment Required
  }

  try {
    const { analysisData, brandName, category } = await request.json();
    
    if (!analysisData || !brandName) {
      // Refund credit if required data is missing
      await databaseService.refundCredit(userId, 'deepScans');
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    // Track PDF export analytics
    await databaseService.updateAnalytics('pdf_export_started', brandName, { category, userId });

    // Generate PDF content (simplified HTML structure for now)
    const pdfHtml = generatePdfHtml(analysisData, brandName, category);
    
    // In a real implementation, you would use a PDF generation library like Puppeteer
    // For now, we'll return the HTML that would be converted to PDF
    const pdfData = {
      html: pdfHtml,
      filename: `${brandName}-analysis-report.pdf`,
      generatedAt: new Date().toISOString(),
      brandName,
      category
    };

    await databaseService.updateAnalytics('pdf_export_completed', brandName, { 
      category,
      userId,
      filename: pdfData.filename
    });

    return NextResponse.json({ 
      success: true, 
      data: pdfData,
      message: 'PDF export ready for download'
    });

  } catch (error) {
    console.error('PDF Export endpoint error:', error);
    // Refund credit on error
    await databaseService.refundCredit(userId, 'deepScans');
    await databaseService.updateAnalytics('pdf_export_error', 'unknown', { error: error.message, userId });
    return NextResponse.json({ success: false, message: 'An error occurred during PDF export' }, { status: 500 });
  }
}

function generatePdfHtml(analysisData, brandName, category) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Brand Analysis Report - ${brandName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
        .score-section { background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .score { font-size: 48px; font-weight: bold; color: ${analysisData.overallScore >= 80 ? '#10b981' : analysisData.overallScore >= 60 ? '#f59e0b' : '#ef4444'}; }
        .metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 30px 0; }
        .metric { padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .metric-title { font-weight: bold; color: #667eea; margin-bottom: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .domains { margin: 20px 0; }
        .domain-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .available { color: #10b981; font-weight: bold; }
        .taken { color: #ef4444; font-weight: bold; }
        .recommendation { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">VeritoLab</div>
        <h1>Brand Analysis Report</h1>
        <p><strong>${brandName}</strong> in ${category}</p>
        <p>Generated on ${currentDate}</p>
    </div>

    <div class="score-section">
        <h2>Overall Viability Score</h2>
        <div class="score">${analysisData.overallScore}/100</div>
        <p>${analysisData.overallScore >= 80 ? 'Strong Contender' : analysisData.overallScore >= 60 ? 'Moderate Potential' : 'Needs Consideration'}</p>
    </div>

    <div class="metrics">
        <div class="metric">
            <div class="metric-title">Domain Strength</div>
            <div class="metric-value">${analysisData.scores.domainStrength}/100</div>
        </div>
        <div class="metric">
            <div class="metric-title">Competition Intensity</div>
            <div class="metric-value">${analysisData.scores.competitionIntensity}/100</div>
        </div>
        <div class="metric">
            <div class="metric-title">SEO Difficulty</div>
            <div class="metric-value">${analysisData.scores.seoDifficulty}/100</div>
        </div>
    </div>

    <h3>Domain Availability</h3>
    <div class="domains">
        ${analysisData.detailedAnalysis.domainAvailability.map(domain => `
            <div class="domain-item">
                <span>${domain.domain}</span>
                <span class="${domain.isAvailable ? 'available' : 'taken'}">${domain.isAvailable ? 'Available' : 'Taken'}</span>
            </div>
        `).join('')}
    </div>

    <div class="recommendation">
        <h3>AI Strategic Analysis</h3>
        <p>${analysisData.recommendation || 'Analysis complete. Please review the scores above.'}</p>
    </div>

    <div class="footer">
        <p>This report was generated by VeritoLab's AI-powered brand analysis engine.</p>
        <p>© ${new Date().getFullYear()} VeritoLab. All rights reserved.</p>
    </div>
</body>
</html>
  `;
} 