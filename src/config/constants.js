export const APP_NAME = 'KasFlow';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_CATEGORIES = {
  INCOME: ['Gaji', 'Bonus', 'Hasil Usaha', 'Investasi', 'Lainnya'],
  EXPENSE: ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya'],
};

export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
};

export const DEBT_TYPES = {
  PAYABLE: 'payable',
  RECEIVABLE: 'receivable',
};

export const DEBT_TYPE_LABELS = {
  payable: 'Hutang',
  receivable: 'Piutang',
};

export const RECURRING_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const FREQUENCY_LABELS = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export const DISCOUNT_TYPES = {
  PERCENT: 'percent',
  FIXED: 'fixed',
};
