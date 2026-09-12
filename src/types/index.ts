export interface ProductTypeOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface ProductAdditionalOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  imageUrl: string;
  types: ProductTypeOption[];
  additionals: ProductAdditionalOption[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface BusinessConfig {
  name: string;
  slogan: string;
  whatsappNumber: string;
  displayPhone: string;
  instagram: string;
  website: string;
  city: string;
  cityNote: string;
  logoText: string;
  currency: string;
  hero: {
    tag: string;
    title: string;
    description: string;
    bgImage: string;
    whatsappButtonText: string;
    catalogButtonText: string;
  };
  navLinks: NavLink[];
}

export interface BusinessSettings extends Partial<BusinessConfig> {}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  imageUrl: string;
  selectedType?: ProductTypeOption;
  selectedAdditional?: ProductAdditionalOption;
  unitPrice: number;
  quantity: number;
}

export interface LastAddedItem {
  name: string;
  typeName?: string;
  addName?: string;
  price: number;
}

export interface CartContextValue {
  items: CartItem[];
  addToCart: (
    product: Product,
    selectedType?: ProductTypeOption,
    selectedAdditional?: ProductAdditionalOption,
    unitPrice?: number,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  lastAddedItem: LastAddedItem | null;
}

export interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updatedData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetToDefaults: () => void;
  loadCustomData: (data: { products?: Product[]; categories?: Category[] }) => void;
}

export interface BusinessContextType {
  business: BusinessConfig;
  updateBusiness: (updates: Partial<BusinessConfig>) => void;
  resetBusinessDefaults: () => void;
  setEntireBusiness: (newSettings: BusinessConfig) => void;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
