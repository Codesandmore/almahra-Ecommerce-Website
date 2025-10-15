// Mock data for Almahra Opticals products

// Filter options for eyewear
export const frameTypes = [
  { id: 'full-rim', name: 'Full Rim' },
  { id: 'rimless', name: 'Rimless' },
  { id: 'half-rim', name: 'Half Rim' }
];

export const frameShapes = [
  { id: 'rectangle', name: 'Rectangle' },
  { id: 'square', name: 'Square' },
  { id: 'round', name: 'Round' },
  { id: 'oval', name: 'Oval' },
  { id: 'aviator', name: 'Aviator' },
  { id: 'clubmaster', name: 'Clubmaster' },
  { id: 'geometric', name: 'Geometric' }
];

export const materials = [
  { id: 'acetate', name: 'Acetate' },
  { id: 'titanium', name: 'Titanium' },
  { id: 'stainless-steel', name: 'Stainless Steel' },
  { id: 'tr90', name: 'TR90' },
  { id: 'cellulose-acetate', name: 'Cellulose Acetate' },
  { id: 'ultem', name: 'Ultem' }
];

export const categories = [
  {
    id: 1,
    name: 'Sunglasses',
    slug: 'sunglasses',
    image: '/images/categories/sunglasses.jpg',
    description: 'Stylish sunglasses for every occasion'
  },
  {
    id: 2,
    name: 'Prescription Glasses',
    slug: 'prescription-glasses',
    image: '/images/categories/prescription.jpg',
    description: 'Clear vision with style'
  },
  {
    id: 3,
    name: 'Reading Glasses',
    slug: 'reading-glasses',
    image: '/images/categories/reading.jpg',
    description: 'Comfortable reading glasses'
  },
  {
    id: 4,
    name: 'Contact Lenses',
    slug: 'contact-lenses',
    image: '/images/categories/contacts.jpg',
    description: 'Premium contact lenses'
  }
];

export const brands = [
  { id: 1, name: 'Ray-Ban', logo: '/images/brands/rayban.png' },
  { id: 2, name: 'Oakley', logo: '/images/brands/oakley.png' },
  { id: 3, name: 'Persol', logo: '/images/brands/persol.png' },
  { id: 4, name: 'Maui Jim', logo: '/images/brands/mauijim.png' },
  { id: 5, name: 'Tom Ford', logo: '/images/brands/tomford.png' }
];

export const products = [
  {
    id: 1,
    name: 'Ray-Ban Wayfarer Sunglasses',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameType: 'full-rim',
    frameShape: 'rectangle',
    material: 'acetate',
    price: 139,
    originalPrice: 159,
    rating: 4.5,
    reviews: 128,
    images: [
      '/images/placeholder.svg',
      '/images/placeholder.svg',
      '/images/placeholder.svg'
    ],
    description: 'Classic Wayfarer style sunglasses with 100% UV protection.',
    features: ['100% UV Protection', 'Scratch Resistant', 'Polarized Lenses'],
    variants: [
      { id: 1, color: 'Black', colorCode: '#000000', stock: 15 },
      { id: 2, color: 'Brown', colorCode: '#8B4513', stock: 8 },
      { id: 3, color: 'Blue', colorCode: '#0066CC', stock: 12 }
    ],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: 'Ray-Ban Aviator Sunglasses',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameType: 'rimless',
    frameShape: 'aviator',
    material: 'titanium',
    price: 149,
    originalPrice: 169,
    rating: 4.7,
    reviews: 89,
    images: [
      '/images/placeholder.svg',
      '/images/placeholder.svg'
    ],
    description: 'Iconic aviator style with metal frame and gradient lenses.',
    features: ['Metal Frame', 'Gradient Lenses', 'Adjustable Nose Pads'],
    variants: [
      { id: 1, color: 'Gold', colorCode: '#FFD700', stock: 10 },
      { id: 2, color: 'Silver', colorCode: '#C0C0C0', stock: 6 }
    ],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: 'Ray-Ban Clubmaster Sunglasses',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameType: 'half-rim',
    frameShape: 'clubmaster',
    material: 'acetate',
    price: 169,
    rating: 4.6,
    reviews: 156,
    images: [
      '/images/placeholder.svg',
      '/images/placeholder.svg'
    ],
    description: 'Retro clubmaster style combining acetate and metal.',
    features: ['Acetate Frame', 'Metal Accents', 'Classic Design'],
    variants: [
      { id: 1, color: 'Black/Gold', colorCode: '#000000', stock: 7 },
      { id: 2, color: 'Tortoise', colorCode: '#8B4513', stock: 9 }
    ],
    inStock: true,
    featured: false
  },
  {
    id: 4,
    name: 'Ray-Ban Justin Sunglasses',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameType: 'full-rim',
    frameShape: 'square',
    material: 'tr90',
    price: 129,
    rating: 4.3,
    reviews: 73,
    images: [
      '/images/placeholder.svg'
    ],
    description: 'Modern rectangular design with rubberized finish.',
    features: ['Rubberized Frame', 'Modern Design', 'Lightweight'],
    variants: [
      { id: 1, color: 'Matte Black', colorCode: '#2C2C2C', stock: 11 }
    ],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: 'Ray-Ban Round Metal Sunglasses',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameType: 'full-rim',
    frameShape: 'round',
    material: 'stainless-steel',
    price: 159,
    rating: 4.4,
    reviews: 92,
    images: [
      '/images/placeholder.svg'
    ],
    description: 'Classic round metal frame with timeless appeal.',
    features: ['Metal Frame', 'Round Lenses', 'Vintage Style'],
    variants: [
      { id: 1, color: 'Gold', colorCode: '#FFD700', stock: 5 },
      { id: 2, color: 'Silver', colorCode: '#C0C0C0', stock: 8 }
    ],
    inStock: true,
    featured: true
  },
  {
    id: 6,
    name: 'Ray-Ban Erika Sunglasses',
    brand: 'Ray-Ban',
    category: 'Sunglasses',
    frameType: 'full-rim',
    frameShape: 'round',
    material: 'acetate',
    price: 149,
    rating: 4.5,
    reviews: 64,
    images: [
      '/images/placeholder.svg'
    ],
    description: 'Oversized round style with modern femininity.',
    features: ['Oversized Design', 'Lightweight', 'Feminine Style'],
    variants: [
      { id: 1, color: 'Black', colorCode: '#000000', stock: 13 },
      { id: 2, color: 'Havana', colorCode: '#8B4513', stock: 7 }
    ],
    inStock: true,
    featured: false
  }
];

export const featuredBanners = [
  {
    id: 1,
    title: 'Try AR Glasses',
    subtitle: 'Experience virtual try-on',
    cta: 'Try Now',
    image: '/images/banners/ar-banner.jpg',
    link: '/ar-try-on'
  },
  {
    id: 2,
    title: 'Get Frame Recommendations',
    subtitle: 'Find your perfect frame',
    cta: 'Get Recommendations',
    image: '/images/banners/recommendation-banner.jpg',
    link: '/recommendations'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing quality glasses and excellent customer service!',
    image: '/images/testimonials/sarah.jpg'
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 5,
    comment: 'Fast delivery and perfect fit. Highly recommended!',
    image: '/images/testimonials/mike.jpg'
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 4,
    comment: 'Great selection of frames and competitive prices.',
    image: '/images/testimonials/emily.jpg'
  }
];

// Mock user data
export const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+91 98765 43210',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  avatar: '/images/avatars/default-avatar.png',
  joinDate: '2023-01-15',
  loyaltyPoints: 450,
  preferredFrameType: 'full-rim',
  preferredFrameShape: 'rectangle',
  eyePrescription: {
    rightEye: {
      sphere: -2.5,
      cylinder: -0.5,
      axis: 90
    },
    leftEye: {
      sphere: -2.0,
      cylinder: -0.25,
      axis: 85
    },
    pd: 64,
    lastUpdated: '2024-03-15'
  }
};

// Mock user addresses
export const mockAddresses = [
  {
    id: 1,
    type: 'home',
    isDefault: true,
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    country: 'India',
    phone: '+91 98765 43210'
  },
  {
    id: 2,
    type: 'office',
    isDefault: false,
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '456 Business Park',
    addressLine2: 'Floor 5, Office 502',
    city: 'Gurgaon',
    state: 'Haryana',
    postalCode: '122001',
    country: 'India',
    phone: '+91 98765 43211'
  }
];

// Mock user orders
export const mockUserOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-09-15',
    status: 'delivered',
    total: 8500,
    items: [
      {
        id: 1,
        name: 'Ray-Ban Wayfarer Sunglasses',
        brand: 'Ray-Ban',
        image: '/images/placeholder.svg',
        price: 8500,
        quantity: 1,
        variant: 'Black'
      }
    ],
    shippingAddress: {
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001'
    },
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-2024-002',
    date: '2024-08-20',
    status: 'delivered',
    total: 12000,
    items: [
      {
        id: 2,
        name: 'Oakley Holbrook Sunglasses',
        brand: 'Oakley',
        image: '/images/placeholder.svg',
        price: 12000,
        quantity: 1,
        variant: 'Matte Black'
      }
    ],
    shippingAddress: {
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001'
    },
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD-2024-003',
    date: '2024-09-25',
    status: 'processing',
    total: 15500,
    items: [
      {
        id: 3,
        name: 'Tom Ford Prescription Glasses',
        brand: 'Tom Ford',
        image: '/images/placeholder.svg',
        price: 15500,
        quantity: 1,
        variant: 'Brown Tortoise'
      }
    ],
    shippingAddress: {
      addressLine1: '456 Business Park',
      addressLine2: 'Floor 5, Office 502',
      city: 'Gurgaon',
      state: 'Haryana',
      postalCode: '122001'
    },
    trackingNumber: 'TRK456789123'
  }
];

// Mock wishlist items
export const mockWishlist = [
  {
    id: 4,
    name: 'Persol PO3019S Sunglasses',
    brand: 'Persol',
    price: 18500,
    originalPrice: 21000,
    image: '/images/placeholder.svg',
    inStock: true,
    addedDate: '2024-09-20'
  },
  {
    id: 5,
    name: 'Maui Jim Peahi Sunglasses',
    brand: 'Maui Jim',
    price: 16800,
    originalPrice: 16800,
    image: '/images/placeholder.svg',
    inStock: false,
    addedDate: '2024-09-10'
  }
];
