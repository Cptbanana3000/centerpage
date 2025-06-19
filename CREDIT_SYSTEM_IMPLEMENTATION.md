# VeritoLab Two-Credit System Implementation

## Overview
VeritoLab now implements a sophisticated two-credit system that properly values different types of analyses and operations, moving beyond a simple search counter to provide fair pricing for different resource intensities.

## Credit Types

### 1. Standard Analyses Credits (`standardAnalyses`)
- **Purpose**: Primary credits for basic brand validation
- **Consumed By**: Running standard analyses (domain availability checks, Google search analysis, initial AI verdict)
- **Cost**: 1 credit per standard analysis
- **Features Included**:
  - Domain availability checking across multiple TLDs (.com, .io, .ai, etc.)
  - Google search competitor analysis
  - AI-powered scoring for domain strength, competition intensity, and SEO difficulty
  - Overall brand viability score with recommendations

### 2. Deep Scan Credits (`deepScans`)
- **Purpose**: Premium credits for resource-intensive operations
- **Consumed By**: 
  - Deep competitor scans (AI-powered website analysis)
  - PDF report exports
- **Cost**: 1 credit per operation
- **Features Included**:
  - Comprehensive competitor website scraping and analysis
  - AI-generated strategic battle plans
  - Professional PDF report generation
  - Advanced competitor intelligence

## User Tiers

### Free Tier
- New users receive **5 Standard Analyses credits** and **0 Deep Scan credits** upon signup
- Allows users to sample the core functionality before purchasing

### Paid Model
- **No subscriptions** - One-time credit pack purchases only
- **Two Credit Packs Available**:

#### Starter Pack - $4.99 (was $7.99)
- 25 Standard Analyses credits
- 10 Deep Scan credits
- For a focused brainstorming session to find a great name

#### Pro Pack - $9.99 (was $14.99) - Most Popular
- 75 Standard Analyses credits
- 35 Deep Scan credits
- For comprehensive research on one or more projects

## Technical Implementation

### Backend Credit Management

#### Database Structure
```javascript
// User document in Firestore
{
  uid: "user123",
  email: "user@example.com",
  credits: {
    standardAnalyses: 5,
    deepScans: 0
  },
  createdAt: serverTimestamp()
}
```

#### API Endpoints

1. **`/api/analyze`** - Consumes `standardAnalyses` credits
   - Checks and deducts credits before analysis
   - Refunds on failure
   - Requires authentication and email verification

2. **`/api/deep-scan`** - Consumes `deepScans` credits
   - Validates credit availability before processing
   - Includes comprehensive error handling with refunds
   - Advanced competitor analysis with AI insights

3. **`/api/export-pdf`** - Consumes `deepScans` credits
   - Generates professional PDF reports
   - Credit checking with proper error handling
   - HTML-to-PDF conversion ready

4. **`/api/user-credits`** - Fetches current credit balances
   - Secure endpoint for dashboard and UI updates
   - Real-time credit balance retrieval

5. **`/api/pre-analysis-check`** - Enhanced validation
   - Returns detailed credit information
   - Supports both credit types
   - Used by frontend for pre-flight checks

### Frontend Components

#### Credit Display System
- **`CreditDisplay`** component with two variants:
  - `full`: Complete credit cards with refill buttons
  - `compact`: Minimal display for navbar
- Real-time credit balance updates
- Direct links to purchase page

#### Purchase Flow
- **`CreditPacks`** component for credit purchasing
- **`/purchase-credits`** dedicated page
- Integrated with existing authentication system
- Ready for payment processor integration (Stripe, etc.)

#### User Experience
- Credit warnings in toast notifications
- Pre-analysis credit checking
- Seamless credit validation across all features
- Clear messaging when credits are insufficient

### Security & Error Handling

#### Credit Protection
- Server-side credit validation on all protected endpoints
- Automatic refunds on operation failures
- Secure Firebase Admin SDK integration
- Token-based authentication for all credit operations

#### User Experience
- Graceful degradation when credits are insufficient
- Clear error messages with actionable next steps
- Credit balance visibility throughout the application
- Seamless integration with existing authentication flow

## Usage Flow

### Standard Analysis Flow
1. User enters brand name and category
2. Pre-analysis check validates `standardAnalyses` credits
3. If sufficient credits, analysis proceeds
4. Credit is deducted before processing
5. Analysis results delivered
6. Credit refunded only if critical error occurs

### Deep Scan Flow
1. User clicks "Perform Deep Scan" on analysis page
2. System checks `deepScans` credit availability
3. Credit deducted before processing begins
4. Comprehensive competitor analysis performed
5. AI-generated strategic insights delivered
6. Results displayed with actionable intelligence

### PDF Export Flow
1. User clicks "Export PDF Report" on analysis page
2. System validates `deepScans` credit availability
3. Credit deducted before PDF generation
4. Professional report generated with branding
5. Download initiated automatically
6. Analytics tracked for business intelligence

## Integration Points

### Firebase Integration
- User credits stored in Firestore user documents
- Real-time updates using Firebase Admin SDK
- Secure server-side credit management
- Automatic user document creation on signup

### Authentication System
- Builds on existing Firebase Auth implementation
- Email verification required for credit usage
- Seamless integration with existing AuthContext
- Protected routes with credit validation

### Analytics & Tracking
- Credit usage analytics via existing `databaseService`
- Purchase tracking and user behavior analysis
- Feature usage patterns for business optimization
- Error tracking for system reliability

## Future Enhancements

### Payment Integration
- Stripe integration for secure payment processing
- Webhook handlers for automatic credit fulfillment
- Invoice generation and receipt management
- Subscription options if market demands

### Advanced Features
- Credit sharing for team accounts
- Bulk discount pricing for large purchases
- Credit expiration policies
- Referral credit bonuses

### Business Intelligence
- Credit usage analytics dashboard
- Revenue tracking and forecasting
- User cohort analysis
- Feature popularity metrics

## Testing Considerations

### Unit Tests
- Credit deduction logic validation
- Refund mechanism testing
- API endpoint security testing
- Frontend component behavior

### Integration Tests
- End-to-end purchase flow testing
- Multi-user credit management
- Database consistency validation
- Error handling across all scenarios

### User Acceptance Testing
- Credit purchase experience
- Feature access validation
- Error message clarity
- Performance under load

This implementation provides a solid foundation for VeritoLab's monetization strategy while maintaining an excellent user experience and ensuring system reliability. 