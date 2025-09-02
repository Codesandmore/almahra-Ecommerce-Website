// Mock data for Almahra Opticals products
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
