import { adminKeyStorage } from '@/lib/api/admin';

export const adminEnabled = () => adminKeyStorage.has();
