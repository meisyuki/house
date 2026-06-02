
export interface Item {
  id: string;
  name: string;
  categoryId: string;
  location: string;
  images: string[];
  purchaseDate?: string;
  expiryDate?: string;
  notes?: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  order: number;
  hidden: boolean;
  createdAt: string;
}

export interface Settings {
  reminderDays: number;
}

export type ItemStatus = 'normal' | 'expiring' | 'expired';

export const LOCATIONS = ['客厅', '卧室', '厨房', '冰箱', '储物柜', '自定义位置'];

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '日化洗护',
    order: 1,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '美妆护肤',
    order: 2,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '食品零食',
    order: 3,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: '药品',
    order: 4,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: '家居杂物',
    order: 5,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: '服饰配件',
    order: 6,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: '厨卫用品',
    order: 7,
    hidden: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: Settings = {
  reminderDays: 7,
};
