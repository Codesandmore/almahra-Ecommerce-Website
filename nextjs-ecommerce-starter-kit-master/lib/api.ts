import {
  ICategory,
  IProduct,
  ICategoryItem,
  IPagination,
  BoundlessClient,
} from "boundless-api-client";

// Mock environment variables for compatibility
export const baseURL = "";
export const permanentToken = "";
export const instanceId = 0;
export const s3Prefix = "";
export const mediaServer = "";

// Mock data for development - using any to avoid strict type checking
const mockCategories: any[] = [
  {
    category_id: 1,
    title: "Electronics",
    url_key: "electronics",
    parent_id: null,
    children: [],
  },
  {
    category_id: 2,
    title: "Clothing",
    url_key: "clothing",
    parent_id: null,
    children: [],
  },
  {
    category_id: 3,
    title: "Home & Garden",
    url_key: "home-garden",
    parent_id: null,
    children: [],
  },
  {
    category_id: 4,
    title: "Sports",
    url_key: "sports",
    parent_id: null,
    children: [],
  },
];

const mockProducts: any[] = [
  {
    product_id: 1,
    title: "Sample Product 1",
    url_key: "sample-product-1",
    prices: [{ value: 99.99, currency: "USD" }],
    images: [
      {
        alt: "Sample Product 1",
        path: "/placeholder-product.jpg",
      },
    ],
    in_stock: true,
    sku: "SP001",
  },
  {
    product_id: 2,
    title: "Sample Product 2",
    url_key: "sample-product-2",
    prices: [{ value: 149.99, currency: "USD" }],
    images: [
      {
        alt: "Sample Product 2",
        path: "/placeholder-product.jpg",
      },
    ],
    in_stock: true,
    sku: "SP002",
  },
];

// Create a mock API client that implements the minimum needed functionality
class MockApiClient {
  catalog = {
    getCategoryTree: async () => mockCategories,
    getFlatCategories: async () => mockCategories,
    getCategoryItem: async (slug: string) => {
      const category = mockCategories.find(
        (cat) => cat.url_key === slug || cat.category_id.toString() === slug
      );
      if (!category) throw new Error("Category not found");
      return {
        ...category,
        text: {
          description_top: `<p>Welcome to our ${category.title} section</p>`,
          description_bottom: `<p>Explore more ${category.title} products</p>`,
        },
        seo: {
          title: category.title,
          metaDesc: `Shop the best ${category.title} products`,
        },
      };
    },
    getProducts: async () => ({
      products: mockProducts,
      pagination: {
        currentPage: 1,
        perPage: 30,
        totalCount: mockProducts.length,
        pageCount: 1,
      },
    }),
    getProduct: async (slug: string) => {
      const product = mockProducts.find(
        (p) => p.url_key === slug || p.product_id.toString() === slug
      );
      if (!product) throw new Error("Product not found");
      return {
        ...product,
        text: {
          description: `<p>This is a detailed description of ${product.title}</p>`,
        },
        seo: {
          title: product.title,
          metaDesc: `Buy ${product.title} - High quality product`,
        },
      };
    },
  };

  system = {
    fetchSettings: async (keys: string[], options?: any) => {
      // Mock system settings
      const mockSettings: any = {
        "system.locale": {
          code: "en",
          title: "English",
        },
        "system.currency": {
          code: "USD",
          title: "US Dollar",
          symbol: "$",
        },
      };

      const result: any = {};
      keys.forEach((key) => {
        if (mockSettings[key]) {
          result[key] = mockSettings[key];
        }
      });

      return result;
    },
  };

  customer = {
    login: async (email: string, password: string, cartId?: any) => {
      // Mock login - always succeeds
      return {
        authToken: "mock-auth-token",
        customer: {
          id: 1,
          email: email,
          firstName: "Mock",
          lastName: "User",
        },
        activeCart: cartId
          ? {
              id: cartId,
              total: { value: 0, currency: "USD" },
            }
          : null,
      };
    },
    register: async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => {
      // Mock register - always succeeds
      return {
        authToken: "mock-auth-token",
        customer: {
          id: 1,
          email: email,
          firstName: firstName || "Mock",
          lastName: lastName || "User",
        },
      };
    },
    restorePassword: async (email: string) => {
      // Mock password restore - always succeeds
      return { success: true };
    },
  };

  // Add methods that BoundlessClient has to make it compatible
  setInstanceId = () => {};
  setBaseUrl = () => {};
  setS3FolderPrefix = () => {};
  setMediaServerUrl = () => {};
}

export const apiClient = new MockApiClient() as any;

export const perPage = 30;

//5 minutes revalidation
export const revalidate = 60 * 5;
