# User Profile Feature

This document outlines the comprehensive user profile feature added to the Almahra Ecommerce Website.

## Overview

The user profile feature provides a complete user account management system with multiple tabs for different functionalities, built using reusable components that align with the existing design system.

## Components Structure

### Main Components

```
src/pages/UserProfilePage/
├── UserProfilePage.jsx          # Main profile page container
└── UserProfilePage.css          # Page-specific styles

src/components/user/
├── ProfileHeader/               # User header with avatar and basic info
│   ├── ProfileHeader.jsx
│   └── ProfileHeader.css
├── ProfileTabs/                 # Navigation tabs for different sections
│   ├── ProfileTabs.jsx
│   └── ProfileTabs.css
├── PersonalInfo/                # Personal information management
│   ├── PersonalInfo.jsx
│   └── PersonalInfo.css
├── OrderHistory/                # Order history and tracking
│   ├── OrderHistory.jsx
│   └── OrderHistory.css
└── AddressBook/                 # Address management
    ├── AddressBook.jsx
    └── AddressBook.css
```

## Features

### 1. Profile Header
- **User Avatar**: Displays user photo or initials placeholder
- **Basic Info**: Name, email, join date, and loyalty points
- **Edit Profile Button**: Quick access to personal info editing

### 2. Navigation Tabs
- **Personal Info**: User details management
- **Order History**: Past orders with status tracking
- **Address Book**: Delivery address management
- **Wishlist**: Saved items for later purchase
- **Prescription**: Eye prescription management

### 3. Personal Information
- **View Mode**: Display current user information
- **Edit Mode**: Inline form editing with validation
- **Responsive Form**: Two-column layout on desktop, single column on mobile
- **Data Fields**: Name, email, phone, date of birth, gender

### 4. Order History
- **Order Cards**: Complete order information display
- **Status Badges**: Visual status indicators (delivered, processing, shipped, cancelled)
- **Order Details Modal**: Expandable detailed view
- **Action Buttons**: Reorder, track, view details functionality
- **Empty State**: Encouraging message when no orders exist

### 5. Address Book
- **Address Management**: Add, edit, delete addresses
- **Address Types**: Home, office, other with icons
- **Default Address**: Mark preferred delivery address
- **Form Validation**: Complete address form with validation
- **Visual Cards**: Clean address display with action buttons

### 6. Wishlist (Integrated)
- **Product Grid**: Visual product display
- **Stock Status**: Out of stock indicators
- **Price Display**: Current and original prices
- **Add to Cart**: Direct purchasing capability

### 7. Prescription (Integrated)
- **Eye Prescription**: Left and right eye details
- **Prescription Values**: Sphere, cylinder, axis, PD
- **Last Updated**: Prescription date tracking
- **Actions**: Update and download prescription

## Mock Data

The feature includes comprehensive mock data:

```javascript
// User profile data
export const mockUser = { ... }

// User addresses  
export const mockAddresses = [ ... ]

// Order history
export const mockUserOrders = [ ... ]

// Wishlist items
export const mockWishlist = [ ... ]
```

## Design System Compliance

### Colors
- Uses existing CSS custom properties from `--primary-color`, `--text-primary`, etc.
- Consistent status colors for different states
- Proper contrast ratios for accessibility

### Typography
- Follows existing font hierarchy (`--font-size-*`, `--font-weight-*`)
- Consistent line heights and spacing

### Spacing
- Uses spacing variables (`--spacing-xs` to `--spacing-3xl`)
- Consistent padding and margins throughout

### Components
- Reuses existing Button component with variants
- Consistent border radius and shadows
- Proper hover states and transitions

## Responsive Design

### Breakpoints
- **Desktop**: Full feature set with multi-column layouts
- **Tablet** (768px): Adjusted layouts with single columns where needed
- **Mobile** (480px): Stack layouts and simplified interactions

### Mobile Optimizations
- Collapsible navigation tabs
- Single-column forms
- Touch-friendly button sizes
- Optimized modal layouts

## Routing

The user profile is accessible via:
- **URL**: `/profile`
- **Navigation**: Header account icon
- **Direct Link**: From any page using React Router

## State Management

### Local State
- Form data for editing modes
- Active tab selection
- Modal visibility states

### Props Drilling
- User data passed through component hierarchy
- Event handlers for CRUD operations
- Consistent state updates across components

## Future Enhancements

### Potential Additions
1. **Photo Upload**: Avatar image upload functionality
2. **Two-Factor Authentication**: Security settings
3. **Notification Preferences**: Email/SMS settings
4. **Order Filtering**: Advanced order search and filtering
5. **Address Validation**: Real-time address verification
6. **Prescription Upload**: Image/PDF prescription upload
7. **Social Login**: OAuth integration
8. **Data Export**: Download personal data

### API Integration Points
- User profile CRUD operations
- Address management endpoints
- Order history retrieval
- Wishlist synchronization
- Prescription management

## Accessibility

### Features Included
- **Semantic HTML**: Proper heading hierarchy and form labels
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Tab-friendly interface
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG compliant color combinations

## Performance Considerations

### Optimizations
- **Lazy Loading**: Tab content loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Component Memoization**: React.memo for expensive renders
- **CSS Efficiency**: Minimal CSS with reusable classes

## Testing Recommendations

### Unit Tests
- Component rendering tests
- Form validation tests
- State management tests
- Event handler tests

### Integration Tests
- Tab navigation flow
- Form submission flow
- Modal interactions
- Responsive behavior

### E2E Tests
- Complete user profile workflow
- Address management flow
- Order history navigation
- Cross-browser compatibility

## Usage Example

```jsx
import UserProfilePage from './pages/UserProfilePage/UserProfilePage.jsx';

// In your router
<Route path="/profile" element={<UserProfilePage />} />
```

The feature is fully integrated and ready for use with proper fallbacks and error handling throughout the component tree.