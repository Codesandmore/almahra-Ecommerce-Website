# AWS Amplify Gen 2 - Backend Integration Guide for Al Mahra Opticals

## Overview
This guide will help you migrate your frontend-only e-commerce site to use AWS Amplify Gen 2 for backend functionality. Gen 2 is the modern, code-first approach that's simpler and more powerful than Gen 1.

---

## ✅ Phase 1: Initial Setup (COMPLETED)

### 1. Install Amplify CLI ✅

```powershell
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify CLI
amplify configure
```

**What you did:**
- ✅ Installed Amplify CLI
- ✅ Created IAM user for AWS access
- ✅ Set up AWS credentials

---

## ✅ Phase 2: Initialize Amplify Gen 2 (COMPLETED)

### 2. Create Amplify Project ✅

```powershell
cd "c:\Users\DELL\almahra-Ecommerce-Website\Almahra Ecommerce"

# Create Amplify Gen 2 project
npm create amplify@latest
```

**What you did:**
- ✅ Initialized Amplify Gen 2 in your project
- ✅ Created `amplify` folder with backend configuration

---

## 🔄 Phase 3: Start Sandbox & Add Authentication (CURRENT)

### 3. Start Amplify Sandbox

The sandbox is a local development environment that creates real AWS resources for testing.

```powershell
npx ampx sandbox
```

**What this does:**
- Creates AWS resources in your account
- Watches for changes in your backend code
- Auto-deploys changes as you develop
- Generates TypeScript types for your frontend

**Keep this running in a terminal while developing!**

---

### 4. Install Amplify Libraries

Open a **new terminal** (keep sandbox running) and install:

```powershell
npm install aws-amplify @aws-amplify/ui-react
```

---

### 5. Add Authentication

Create a new file for authentication configuration:

**Create: `amplify/auth/resource.ts`**

```typescript
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    name: {
      required: true,
      mutable: true,
    },
    phoneNumber: {
      required: false,
      mutable: true,
    },
  },
});
```

**Update: `amplify/backend.ts`**

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

defineBackend({
  auth,
});
```

The sandbox will automatically detect these changes and deploy authentication!

---

### 6. Configure Amplify in Your Frontend

**Update: `src/main.jsx`**

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## Phase 4: Add Database (Day 3-5)

### 7. Define Data Models

Create a new file for your database schema:

**Create: `amplify/data/resource.ts`**

```typescript
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // User Profile
  UserProfile: a
    .model({
      userId: a.id().required(),
      email: a.email().required(),
      name: a.string().required(),
      phone: a.phone(),
      addresses: a.json(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),

  // Product
  Product: a
    .model({
      name: a.string().required(),
      brand: a.string().required(),
      category: a.string().required(),
      price: a.float().required(),
      images: a.string().array(),
      stock: a.integer().required(),
      description: a.string(),
      specifications: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey().to(['read'])]),

  // Order
  Order: a
    .model({
      userId: a.id().required(),
      items: a.json().required(),
      total: a.float().required(),
      status: a.string().required(),
      shippingAddress: a.json().required(),
      paymentMethod: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),

  // Appointment
  Appointment: a
    .model({
      userId: a.id().required(),
      branch: a.string().required(),
      date: a.date().required(),
      time: a.string().required(),
      status: a.string().required(),
      phone: a.phone().required(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  // Contact Query
  ContactQuery: a
    .model({
      name: a.string().required(),
      email: a.email().required(),
      phone: a.phone().required(),
      subject: a.string().required(),
      message: a.string().required(),
      status: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

**Update: `amplify/backend.ts`**

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({
  auth,
  data,
});
```

The sandbox will automatically create DynamoDB tables!

---

### 8. Use Data in Your Frontend

**Example: Fetch Products**

```javascript
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

// Create a product
const createProduct = async (productData) => {
  try {
    const result = await client.models.Product.create(productData);
    console.log('Product created:', result);
    return result;
  } catch (error) {
    console.error('Error creating product:', error);
  }
};

// Get all products
const fetchProducts = async () => {
  try {
    const { data: products } = await client.models.Product.list();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a single product
const getProduct = async (productId) => {
  try {
    const { data: product } = await client.models.Product.get({ id: productId });
    return product;
  } catch (error) {
    console.error('Error getting product:', error);
  }
};

// Update a product
const updateProduct = async (productId, updates) => {
  try {
    const result = await client.models.Product.update({
      id: productId,
      ...updates,
    });
    return result;
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

// Delete a product
const deleteProduct = async (productId) => {
  try {
    await client.models.Product.delete({ id: productId });
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};
```

---

## Phase 5: Update Authentication in Frontend (Day 5-7)

### 9. Replace Your Current Auth Logic

**Update your LoginPage/SignupPage to use Amplify Auth:**

```javascript
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';

// Sign Up
const handleSignUp = async (email, password, name, phone) => {
  try {
    const { userId, nextStep } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
          phone_number: phone,
        },
      },
    });
    
    console.log('Sign up success:', userId);
    // nextStep will tell you if email confirmation is needed
    if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
      // Show confirmation code input
      console.log('Check email for confirmation code');
    }
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

// Confirm Sign Up (after email verification)
const handleConfirmSignUp = async (email, confirmationCode) => {
  try {
    await confirmSignUp({
      username: email,
      confirmationCode,
    });
    console.log('Email confirmed successfully');
  } catch (error) {
    console.error('Error confirming sign up:', error);
  }
};

// Sign In
const handleSignIn = async (email, password) => {
  try {
    const { isSignedIn } = await signIn({
      username: email,
      password,
    });
    
    if (isSignedIn) {
      console.log('Sign in successful');
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

// Sign Out
const handleSignOut = async () => {
  try {
    await signOut();
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Get Current User
const fetchCurrentUser = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch {
    return null;
  }
};
```

---

## Phase 6: Add Storage for Images (Day 7-8)

### 10. Add S3 Storage

**Create: `amplify/storage/resource.ts`**

```typescript
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'productImages',
  access: (allow) => ({
    'product-images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'user-uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});
```

**Update: `amplify/backend.ts`**

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

defineBackend({
  auth,
  data,
  storage,
});
```

### 11. Upload and Retrieve Images

```javascript
import { uploadData, getUrl, remove } from 'aws-amplify/storage';

// Upload image
const uploadProductImage = async (file, productId) => {
  try {
    const result = await uploadData({
      path: `product-images/${productId}/${file.name}`,
      data: file,
      options: {
        contentType: file.type
      }
    }).result;
    
    console.log('Upload success:', result);
    return result.path;
  } catch (error) {
    console.error('Error uploading:', error);
  }
};

// Get image URL
const getProductImageUrl = async (imagePath) => {
  try {
    const url = await getUrl({ path: imagePath });
    return url.url;
  } catch (error) {
    console.error('Error getting URL:', error);
  }
};

// Delete image
const deleteProductImage = async (imagePath) => {
  try {
    await remove({ path: imagePath });
  } catch (error) {
    console.error('Error deleting:', error);
  }
};
```

---

## Phase 7: Add Email Service with Lambda (Day 8-10)

### 12. Create Email Lambda Function

**Create: `amplify/functions/send-email/resource.ts`**

```typescript
import { defineFunction } from '@aws-amplify/backend';

export const sendEmail = defineFunction({
  name: 'sendEmail',
  entry: './handler.ts'
});
```

**Create: `amplify/functions/send-email/handler.ts`**

```typescript
import type { Handler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' }); // Change to your region

export const handler: Handler = async (event) => {
  const { to, subject, htmlBody, textBody } = JSON.parse(event.body);

  const params = {
    Source: 'support@almahra-opticals.com', // Must be verified in SES
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: htmlBody,
        },
        Text: {
          Data: textBody || '',
        },
      },
    },
  };

  try {
    await ses.send(new SendEmailCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
```

**Update: `amplify/backend.ts`**

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { sendEmail } from './functions/send-email/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  storage,
  sendEmail,
});

// Grant SES permissions to Lambda
backend.sendEmail.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    resources: ['*'],
  })
);
```

---

## Phase 8: Deploy to Production (Day 10-11)

### 13. Deploy Backend

When you're ready to deploy to production:

```powershell
# Stop the sandbox (Ctrl+C)

# Deploy to production
npx ampx sandbox --once
```

Or use the Amplify Console for CI/CD:

```powershell
# Connect to Git and deploy
npx ampx pipeline-deploy --branch main
```

---

## Phase 9: Deploy Frontend with Amplify Hosting (Day 11-12)

### 14. Deploy to Amplify Hosting

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Select branch: `main`
5. Build settings (auto-detected):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
6. Click "Save and deploy"

Your site will be live at: `https://main.xxxxx.amplifyapp.com`

---

## Key Differences: Gen 2 vs Gen 1

| Feature | Gen 1 (Old Guide) | Gen 2 (This Guide) |
|---------|-------------------|-------------------|
| **Configuration** | CLI prompts, amplify commands | Code files in TypeScript |
| **Backend Definition** | `amplify add auth/api` | `amplify/auth/resource.ts` |
| **Data Models** | GraphQL schema files | TypeScript with `a.schema()` |
| **Type Safety** | Manual types | Auto-generated TypeScript |
| **Local Development** | Mock data only | Real AWS resources in sandbox |
| **Deployment** | `amplify push` | `npx ampx sandbox` |

---

## Cost Estimation (Free Tier)

**Monthly Free Tier Limits (12 months):**
- **Cognito**: 50,000 monthly active users - FREE forever
- **DynamoDB**: 25 GB storage, 200M requests/month
- **Lambda**: 1 million requests, 400,000 GB-seconds
- **S3**: 5 GB storage, 20,000 GET, 2,000 PUT
- **API Gateway**: 1 million calls
- **SES**: 3,000 emails/month (permanently free)
- **Amplify Hosting**: 1,000 build minutes, 15 GB served, 5 GB storage

**Your e-commerce site should stay FREE for first year!**

---

## Progress Checklist

### ✅ Week 1: Setup (DONE)
- [x] Install Amplify CLI
- [x] Configure AWS credentials
- [x] Initialize Amplify Gen 2

### 🔄 Week 2: Core Backend (IN PROGRESS)
- [ ] Start sandbox
- [ ] Add authentication
- [ ] Add data models
- [ ] Test auth flow

### Week 3: Features
- [ ] Migrate product catalog to DynamoDB
- [ ] Migrate user profiles
- [ ] Migrate orders
- [ ] Migrate appointments
- [ ] Migrate contact queries

### Week 4: Storage & Email
- [ ] Setup S3 for product images
- [ ] Upload existing images
- [ ] Create email Lambda function
- [ ] Verify email in SES
- [ ] Test email sending

### Week 5: Testing
- [ ] Test all features
- [ ] Fix bugs
- [ ] Performance testing
- [ ] Security review

### Week 6: Deployment
- [ ] Deploy backend to production
- [ ] Deploy frontend to Amplify Hosting
- [ ] Setup custom domain (optional)
- [ ] Monitor and optimize

---

## Helpful Commands

```powershell
# Start development sandbox
npx ampx sandbox

# Generate TypeScript types
npx ampx generate graphql-client-code

# Deploy once (for testing)
npx ampx sandbox --once

# View logs
npx ampx logs

# Delete sandbox resources
npx ampx sandbox delete

# Get help
npx ampx help
```

---

## Common Issues & Solutions

### Issue 1: "Sandbox deployment failed"
**Solution**: Check AWS credentials with `aws sts get-caller-identity`

### Issue 2: "Module not found: amplify_outputs.json"
**Solution**: Wait for sandbox to finish deploying, file is auto-generated

### Issue 3: Authentication errors
**Solution**: Make sure `Amplify.configure(outputs)` is called before any auth operations

### Issue 4: CORS errors
**Solution**: Gen 2 handles CORS automatically, but verify your API calls use the generated client

---

## Helpful Resources

1. **Amplify Gen 2 Docs**: https://docs.amplify.aws/react/
2. **Gen 2 Tutorial**: https://docs.amplify.aws/react/start/quickstart/
3. **Data Modeling Guide**: https://docs.amplify.aws/react/build-a-backend/data/
4. **Auth Guide**: https://docs.amplify.aws/react/build-a-backend/auth/
5. **Storage Guide**: https://docs.amplify.aws/react/build-a-backend/storage/

---

## Next Steps

1. **Run `npx ampx sandbox`** to start development
2. **Add authentication** as shown in Phase 3
3. **Add data models** as shown in Phase 4
4. **Test each feature** before moving to the next

Good luck with your AWS Amplify Gen 2 integration! 🚀
