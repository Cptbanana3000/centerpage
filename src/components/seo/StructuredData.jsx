export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.getcenterpage.com/#organization",
        "name": "CenterPage",
        "url": "https://www.getcenterpage.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.getcenterpage.com/logo.png",
          "width": 512,
          "height": 512
        },
        "description": "AI-powered brand name validation and viability checker helping businesses make data-driven branding decisions.",
        "foundingDate": "2024",
        "sameAs": [
          "https://twitter.com/getcenterpage",
          "https://linkedin.com/company/getcenterpage"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.getcenterpage.com/#website",
        "url": "https://www.getcenterpage.com",
        "name": "CenterPage - Brand Name Validation/viability checker & Analysis Platform",
        "description": "Validate and check if your brand name is viable with AI-powered analysis. Check domain availability, analyze competitors, get SEO insights, and make data-driven branding decisions.",
        "publisher": {
          "@id": "https://www.getcenterpage.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.getcenterpage.com/analysis?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.getcenterpage.com/#webpage",
        "url": "https://www.getcenterpage.com",
        "name": "CenterPage - AI-Powered Brand Name Validation/viability checker & Analysis",
        "isPartOf": {
          "@id": "https://www.getcenterpage.com/#website"
        },
        "about": {
          "@id": "https://www.getcenterpage.com/#organization"
        },
        "description": "Validate and check if your brand name is viable with AI-powered analysis. Check domain availability, analyze competitors, get SEO insights, and make data-driven branding decisions.",
        "breadcrumb": {
          "@id": "https://www.getcenterpage.com/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.getcenterpage.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.getcenterpage.com"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "CenterPage Brand Viability Checker",
        "description": "AI-powered brand name validation and viability checker platform",
        "url": "https://www.getcenterpage.com",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": [
          {
            "@type": "Offer",
            "name": "Basic Pack",
            "price": "7.99",
            "priceCurrency": "USD",
            "description": "10 Standard Analyses with domain availability checking"
          },
          {
            "@type": "Offer",
            "name": "Starter Pack", 
            "price": "19.99",
            "priceCurrency": "USD",
            "description": "15 Standard Analyses + 7 Deep Scan Reports"
          },
          {
            "@type": "Offer",
            "name": "Founders Pack",
            "price": "39.99", 
            "priceCurrency": "USD",
            "description": "30 Standard Analyses + 14 Deep Scan Reports"
          }
        ],
        "featureList": [
          "Brand name analysis",
          "Brand viability checking",
          "Domain availability checking",
          "Competitor analysis",
          "SEO difficulty scoring",
          "AI-powered insights",
          "PDF report generation"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
