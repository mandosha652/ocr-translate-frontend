export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_BATCH_SIZE = 100; // Match backend limit
export const FREE_TIER_MAX_TARGET_LANGUAGES = 5;
export const PRO_TIER_MAX_TARGET_LANGUAGES = 26;
export const MAX_TARGET_LANGUAGES = PRO_TIER_MAX_TARGET_LANGUAGES; // Absolute max
export const MAX_CONCURRENT_BATCHES = 3; // Max active batches per user

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
