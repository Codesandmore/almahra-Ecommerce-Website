# Almahra Opticals - Project Structure

## 📁 Project Organization

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button/       # Custom button component
│   │   ├── Input/        # Form input components
│   │   ├── Modal/        # Modal/popup components
│   │   └── Loading/      # Loading indicators
│   ├── layout/           # Layout components
│   │   ├── Header/       # Site header with navigation
│   │   ├── Footer/       # Site footer
│   │   └── Sidebar/      # Sidebar components
│   ├── product/          # Product-related components
│   │   ├── ProductCard/  # Product display card
│   │   ├── ProductGrid/  # Product grid layout
│   │   ├── ProductFilter/# Filter/search components
│   │   └── ProductDetail/# Single product view
│   ├── auth/             # Authentication components
│   │   ├── LoginForm/    # Login component
│   │   ├── RegisterForm/ # Registration component
│   │   └── Profile/      # User profile components
│   └── cart/             # Shopping cart components
│       ├── CartItem/     # Individual cart item
│       ├── CartSidebar/  # Cart dropdown/sidebar
│       └── Checkout/     # Checkout process
├── pages/                # Page components
│   ├── Home/             # Homepage
│   ├── Products/         # Product listing page
│   ├── ProductDetail/    # Individual product page
│   ├── Cart/             # Shopping cart page
│   ├── Checkout/         # Checkout page
│   ├── Profile/          # User profile page
│   └── About/            # About page
├── context/              # React Context providers
│   ├── CartContext.jsx   # Shopping cart state
│   ├── AuthContext.jsx   # Authentication state
│   └── ThemeContext.jsx  # Theme/UI preferences
├── hooks/                # Custom React hooks
│   ├── useCart.js        # Cart functionality
│   ├── useAuth.js        # Authentication logic
│   ├── useLocalStorage.js# Local storage management
│   └── useApi.js         # API calls
├── utils/                # Utility functions
│   ├── helpers.js        # General helper functions
│   ├── validation.js     # Form validation
│   ├── constants.js      # App constants
│   └── api.js            # API configuration
├── data/                 # Mock data and configs
│   ├── mockData.js       # Sample product data
│   └── categories.js     # Product categories
└── styles/               # Global styles
    ├── variables.css     # CSS custom properties
    ├── global.css        # Global styles and utilities
    └── components.css    # Component-specific styles
```

## 🎨 Design System

### Color Variables
- **Primary Colors**: Main brand colors for buttons, links, and accents
- **Secondary Colors**: Supporting colors for highlights and CTAs
- **Neutral Colors**: Grays, whites, and blacks for text and backgrounds
- **Status Colors**: Success, warning, error, and info states

### Typography
- **Font Families**: Primary (Inter) and Secondary (Playfair Display)
- **Font Sizes**: Responsive scale from xs to 4xl
- **Font Weights**: Light to Bold variations
- **Line Heights**: Tight, normal, and relaxed options

### Spacing System
- **Consistent Scale**: xs (0.25rem) to 3xl (4rem)
- **Responsive**: Adapts to different screen sizes
- **Grid-based**: Easy to maintain and scale

## 🛠 Key Features Implemented

### 1. Component Architecture
- **Reusable Components**: Button, ProductCard with consistent APIs
- **Composition**: Components can be easily combined and extended
- **Props Interface**: Well-defined props for customization

### 2. State Management
- **Cart Context**: Global shopping cart state with add/remove/update
- **Local Storage**: Persistent cart data across sessions
- **Reducer Pattern**: Predictable state updates

### 3. Responsive Design
- **Mobile-First**: Designed for mobile and scaled up
- **Breakpoint System**: Consistent breakpoints across components
- **Flexible Layouts**: Grid and flexbox for responsive layouts

### 4. Performance Optimization
- **CSS Variables**: Easy theming and color changes
- **Minimal Bundle**: Only necessary components loaded
- **Optimized Images**: Placeholder system for image optimization

## 🔧 Development Workflow

### Adding New Components
1. Create component folder in appropriate category
2. Include .jsx and .css files
3. Export from index.js for clean imports
4. Follow naming conventions (PascalCase for components)

### Styling Guidelines
- Use CSS variables for colors and spacing
- Follow BEM methodology for class naming
- Include responsive breakpoints
- Use utility classes when appropriate

### State Management
- Use Context for global state (cart, auth, theme)
- Use local state for component-specific data
- Implement custom hooks for reusable logic

## 📱 Responsive Breakpoints
- **sm**: 640px (Small tablets)
- **md**: 768px (Tablets)
- **lg**: 1024px (Laptops)
- **xl**: 1280px (Desktops)
- **2xl**: 1536px (Large screens)

## 🎯 Next Steps
1. Add more page components (ProductDetail, Checkout)
2. Implement authentication system
3. Add product filtering and search
4. Create admin dashboard components
5. Add AR try-on functionality
6. Implement appointment booking system

This structure provides a solid foundation for the Almahra Opticals ecommerce website with scalability, maintainability, and performance in mind.
