# Backend Tasks for Al Mahra Opticals E-commerce

## Overview
This document outlines the backend tasks that need to be completed for the Al Mahra Opticals e-commerce website using AWS Amplify Gen 2.

---

## 🎯 Backend Developer Responsibilities

### Phase 1: Authentication (Priority: HIGH)
**File: `amplify/auth/resource.ts`**

**Requirements:**
- Email-based authentication
- User attributes: name, phone number, addresses
- Email verification for new users
- Password reset functionality
- User roles: customer, admin

**Deliverable:** Users can sign up, sign in, and manage their accounts

---

### Phase 2: Database Models (Priority: HIGH)
**File: `amplify/data/resource.ts`**

Create the following data models:

#### 1. **Product Model**
```typescript
{
  id: string (auto-generated)
  name: string (required)
  brand: string (required)
  category: string (required) // "Eyeglasses", "Sunglasses", "Contact Lenses"
  price: float (required)
  images: string[] (URLs)
  stock: integer (required)
  description: string
  specifications: json {
    frameType?: string
    lensType?: string
    material?: string
    color?: string
    size?: string
  }
  featured: boolean (for homepage)
  createdAt: datetime
  updatedAt: datetime
}
```
**Access:** Public read, Admin write

#### 2. **Order Model**
```typescript
{
  id: string (auto-generated)
  userId: string (required) // FK to user
  items: json[] [{
    productId: string
    productName: string
    quantity: integer
    price: float
  }]
  subtotal: float
  tax: float
  shippingCost: float
  total: float (required)
  status: string (required) // "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"
  shippingAddress: json {
    name: string
    phone: string
    address: string
    city: string
    country: string
  }
  paymentMethod: string // "cash_on_delivery", "card"
  paymentStatus: string // "pending", "paid"
  notes: string
  createdAt: datetime
  updatedAt: datetime
}
```
**Access:** Owner read/write, Admin read/write

#### 3. **Appointment Model**
```typescript
{
  id: string (auto-generated)
  userId: string (required) // FK to user
  name: string (required)
  email: string (required)
  phone: string (required)
  branch: string (required) // "Al Sadd", "Al Munthaza", "Bin Mahmoud", "Al Gharrafa", "Al Rayyan"
  date: date (required)
  time: string (required) // "9:00 AM", "10:00 AM", etc.
  serviceType: string // "Eye Checkup", "Frame Selection", "Contact Lens Fitting"
  status: string (required) // "pending", "confirmed", "completed", "cancelled"
  notes: string
  createdAt: datetime
  updatedAt: datetime
}
```
**Access:** Owner read/write, Admin read/write

#### 4. **ContactQuery Model**
```typescript
{
  id: string (auto-generated)
  name: string (required)
  email: string (required)
  phone: string (required)
  subject: string (required)
  message: string (required)
  status: string (required) // "new", "in_progress", "resolved"
  adminNotes: string
  createdAt: datetime
  updatedAt: datetime
}
```
**Access:** Public create, Admin read/write

#### 5. **UserProfile Model**
```typescript
{
  id: string (auto-generated)
  userId: string (required) // FK to Cognito user
  email: string (required)
  name: string (required)
  phone: string
  addresses: json[] [{
    type: string // "home", "work"
    address: string
    city: string
    country: string
    isDefault: boolean
  }]
  preferences: json {
    prescriptionOnFile?: boolean
    communicationPreferences?: string
  }
  createdAt: datetime
  updatedAt: datetime
}
```
**Access:** Owner read/write

---

### Phase 3: Lambda Functions (Priority: MEDIUM)

#### 1. **Email Service Function**
**File: `amplify/functions/send-email/handler.ts`**

**Purpose:** Send transactional emails

**Triggers:**
- Order confirmation (when order is created)
- Appointment confirmation (when appointment is booked)
- Contact query confirmation (when query is submitted)
- Order status updates (when order status changes)
- Appointment reminders (1 day before appointment)

**Email Templates to Create:**
```typescript
1. order_confirmation
2. order_status_update
3. appointment_confirmation
4. appointment_reminder
5. contact_confirmation
6. contact_admin_notification
7. welcome_email (on signup)
8. password_reset
```

#### 2. **Order Management Function** (Optional)
**File: `amplify/functions/manage-order/handler.ts`**

**Purpose:** Business logic for orders
- Calculate totals (subtotal + tax + shipping)
- Update product stock when order is placed
- Send email notifications
- Generate order number

#### 3. **Inventory Management Function** (Optional)
**File: `amplify/functions/manage-inventory/handler.ts`**

**Purpose:** Stock management
- Update stock levels
- Low stock alerts
- Stock availability checks

---

### Phase 4: File Storage (Priority: MEDIUM)
**File: `amplify/storage/resource.ts`**

**Storage Buckets:**

1. **Product Images** (`product-images/`)
   - Access: Public read, Admin write
   - Used for: Product catalog images

2. **User Uploads** (`user-uploads/`)
   - Access: Authenticated read/write (owner only)
   - Used for: Prescription uploads, profile pictures

---

### Phase 5: API Endpoints (Priority: HIGH)

If using REST API instead of GraphQL, create these endpoints:

```
GET    /products              // List all products
GET    /products/:id          // Get single product
POST   /products              // Create product (admin only)
PUT    /products/:id          // Update product (admin only)
DELETE /products/:id          // Delete product (admin only)

GET    /orders                // List user's orders
GET    /orders/:id            // Get single order
POST   /orders                // Create order
PUT    /orders/:id            // Update order status (admin)

GET    /appointments          // List user's appointments
POST   /appointments          // Create appointment
PUT    /appointments/:id      // Update appointment
DELETE /appointments/:id      // Cancel appointment

POST   /contact               // Submit contact form
GET    /contact               // List all queries (admin)
PUT    /contact/:id           // Update query status (admin)
```

---

## 🔒 Security Requirements

### Authorization Rules:

1. **Public Access:**
   - Read products
   - Create contact queries
   - View branch information

2. **Authenticated Users:**
   - CRUD their own orders
   - CRUD their own appointments
   - CRUD their own profile
   - Upload files to their folder

3. **Admin Users:**
   - Full access to all data
   - Manage products
   - View/update all orders
   - View/respond to contact queries
   - Access analytics

### Implement Admin Role:
- Add custom attribute `custom:role` in Cognito
- Set to "admin" for admin users
- Use in authorization rules

---

## 📧 Email Configuration

### Amazon SES Setup:

1. **Verify sender email:**
   ```powershell
   aws ses verify-email-identity --email-address support@almahra-opticals.com
   ```

2. **Move out of sandbox mode** (for production):
   - Request production access in SES console
   - This allows sending to any email address

3. **Create email templates** in SES or use HTML in Lambda

---

## 🧪 Testing Checklist

- [ ] Users can sign up with email
- [ ] Users receive verification email
- [ ] Users can sign in
- [ ] Users can reset password
- [ ] Products can be fetched (public)
- [ ] Products can be created (admin only)
- [ ] Orders can be created
- [ ] Order confirmation email sent
- [ ] Appointments can be booked
- [ ] Appointment confirmation email sent
- [ ] Contact form submissions work
- [ ] Files can be uploaded to S3
- [ ] Product images display correctly

---

## 📝 Documentation Required

Please document:

1. **API Documentation:**
   - List all available queries/mutations (if GraphQL)
   - List all REST endpoints (if REST)
   - Request/response examples

2. **Data Models:**
   - Explain each field
   - Validation rules
   - Relationships between models

3. **Email Templates:**
   - List available email types
   - Variables used in each template

4. **Environment Variables:**
   - Any configuration needed
   - AWS region
   - SES sender email

---

## 🚀 Deployment Process

### Development:
```powershell
npx ampx sandbox
```
Runs continuously, auto-deploys changes

### Staging/Production:
```powershell
npx ampx sandbox --once
```
Or use Amplify Console CI/CD

---

## 📊 Success Criteria

Backend is complete when:

- [ ] All 5 data models are created and working
- [ ] Authentication flow is fully functional
- [ ] Email service sends all 8 email types
- [ ] File upload works for product images
- [ ] Authorization rules prevent unauthorized access
- [ ] Admin can manage all resources
- [ ] Customers can only access their own data
- [ ] All endpoints are documented
- [ ] Frontend can successfully integrate

---

## 💡 Tips

1. **Start with Auth** - Everything else depends on it
2. **Use TypeScript** - Better type safety
3. **Test incrementally** - Test each model as you create it
4. **Use sandbox** - It creates real AWS resources for testing
5. **Check AWS Console** - View your DynamoDB tables, Cognito users, etc.
6. **Monitor logs** - Use `npx ampx logs` to debug

---

## 📞 Questions?

Refer to:
- `AWS_SETUP_GUIDE_GEN2.md` - Detailed setup guide
- `BACKEND_DEVELOPER_SETUP.md` - Initial setup instructions
- Official docs: https://docs.amplify.aws/react/

Good luck! 🎉
