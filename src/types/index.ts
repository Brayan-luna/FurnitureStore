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
  logoUrl?: string;
  whatsappNumber: string;
  whatsappLink?: string;
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

export interface AddonItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  active?: boolean;
}

export interface CustomizerQualityItem {
  name: string;
  wood: string;
  finish: string;
  standardMeasure?: string;
  priceModifier: number;
}

export interface CustomizerQualityConfig {
  plus: CustomizerQualityItem;
  premium: CustomizerQualityItem;
}

export interface CustomizerSizeOption {
  id: string;
  name: string;
  label: string;
  dimension: string;
  priceModifier: number;
  active?: boolean;
}

export interface CustomizerMattressOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  compatibleSizes: string[];
  active?: boolean;
}

export interface CustomizerColorOption {
  id: string;
  name: string;
  hex: string;
  active?: boolean;
}

export interface CustomizerAddonOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  active?: boolean;
}

export interface CustomizerConfig {
  quality: CustomizerQualityConfig;
  sizes: CustomizerSizeOption[];
  mattresses: CustomizerMattressOption[];
  colors: CustomizerColorOption[];
  addons: CustomizerAddonOption[];
}

export interface SelectedCustomization {
  quality: 'PLUS' | 'PREMIUM';
  qualityModifier: number;
  size: CustomizerSizeOption;
  mattress?: CustomizerMattressOption | null;
  color?: CustomizerColorOption;
  addons: CustomizerAddonOption[];
  totalPrice: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  imageUrl: string;
  selectedType?: ProductTypeOption;
  selectedAdditional?: ProductAdditionalOption;
  customization?: SelectedCustomization;
  unitPrice: number;
  quantity: number;
  isAddon?: boolean;
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
    quantity?: number,
    customization?: SelectedCustomization
  ) => void;
  addAddonToCart: (addon: AddonItem, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  updateCartItem: (
    oldCartItemId: string,
    newType: ProductTypeOption,
    newAdditional: ProductAdditionalOption,
    newUnitPrice: number
  ) => void;
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
  addons: AddonItem[];
  customizerConfig: CustomizerConfig;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addAddon: (addon: Omit<AddonItem, 'id'> & { id?: string }) => AddonItem;
  updateAddon: (id: string, updatedData: Partial<AddonItem>) => void;
  deleteAddon: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updatedData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateCustomizerConfig: (updates: Partial<CustomizerConfig>) => void;
  resetCustomizerConfig: () => void;
  resetToDefaults: () => void;
  loadCustomData: (data: { products?: Product[]; categories?: Category[]; addons?: AddonItem[]; customizerConfig?: CustomizerConfig }) => void;
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

