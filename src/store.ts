
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, Category, Settings, ItemStatus, DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from './types';

interface AppState {
  items: Item[];
  categories: Category[];
  settings: Settings;
  selectedCategoryId: string | null;
  filterStatus: ItemStatus | 'all';
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setFilterStatus: (status: ItemStatus | 'all') => void;
  getItemStatus: (item: Item) => ItemStatus;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],
      categories: DEFAULT_CATEGORIES,
      settings: DEFAULT_SETTINGS,
      selectedCategoryId: null,
      filterStatus: 'all',
      
      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (item) => set((state) => ({
        items: state.items.map((i) => i.id === item.id ? item : i),
      })),
      deleteItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      
      setCategories: (categories) => set({ categories }),
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (category) => set((state) => ({
        categories: state.categories.map((c) => c.id === category.id ? category : c),
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),
      
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings },
      })),
      
      setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      
      getItemStatus: (item) => {
        if (!item.expiryDate) return 'normal';
        const expiry = new Date(item.expiryDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        const { reminderDays } = get().settings;
        
        if (days < 0) return 'expired';
        if (days <= reminderDays) return 'expiring';
        return 'normal';
      },
    }),
    {
      name: 'home-organizer-storage',
    }
  )
);
