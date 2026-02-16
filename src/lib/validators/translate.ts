import { z } from 'zod';
import {
  MAX_FILE_SIZE_BYTES,
  MAX_BATCH_SIZE,
  MAX_TARGET_LANGUAGES,
  ALLOWED_IMAGE_TYPES,
} from '@/lib/constants';
import { SUPPORTED_LANGUAGES } from '@/types';

const supportedLanguageCodes = SUPPORTED_LANGUAGES.map(l => l.code);

export const translateImageSchema = z.object({
  image: z
    .instanceof(File, { message: 'Please select an image file' })
    .refine(
      file => file.size <= MAX_FILE_SIZE_BYTES,
      'File size must be less than 10MB'
    )
    .refine(
      file =>
        ALLOWED_IMAGE_TYPES.includes(
          file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
        ),
      'File must be a JPEG, PNG, or WebP image'
    ),
  targetLang: z
    .string()
    .min(2, 'Please select a target language')
    .refine(
      lang => supportedLanguageCodes.includes(lang),
      'Please select a supported language'
    ),
  sourceLang: z.string().optional(),
  excludeText: z.string().optional(),
});

export const batchTranslateSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'Please select at least one image')
    .max(MAX_BATCH_SIZE, `Maximum ${MAX_BATCH_SIZE} images allowed`)
    .refine(
      files => files.every(file => file.size <= MAX_FILE_SIZE_BYTES),
      'Each file must be less than 10MB'
    )
    .refine(
      files =>
        files.every(file =>
          ALLOWED_IMAGE_TYPES.includes(
            file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
          )
        ),
      'All files must be JPEG, PNG, or WebP images'
    ),
  targetLanguages: z
    .array(z.string())
    .min(1, 'Please select at least one target language')
    .max(
      MAX_TARGET_LANGUAGES,
      `Maximum ${MAX_TARGET_LANGUAGES} languages allowed`
    )
    .refine(
      langs => langs.every(lang => supportedLanguageCodes.includes(lang)),
      'Please select supported languages only'
    ),
  sourceLanguage: z.string().optional(),
  excludeText: z.string().optional(),
});

export type TranslateImageFormData = z.infer<typeof translateImageSchema>;
export type BatchTranslateFormData = z.infer<typeof batchTranslateSchema>;
