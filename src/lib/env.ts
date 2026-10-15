import { z } from "zod";

const bool = z
  .enum(["true", "false"])
  .default("true")
  .transform((v) => v === "true");

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_API_BASE_URL: z.string().url().default("https://dummyjson.com"),
  VITE_DISCOUNT_RATE: z.coerce.number().min(0).max(1).default(0.1),
  VITE_DEFAULT_COUPON: z.string().default("DISCOUNT10"),
  VITE_SUPPORT_EMAIL: z.string().default("support@dokan.com"),
  VITE_SUPPORT_PHONE: z.string().default("+88015-88888-9999"),
  VITE_ENABLE_GOOGLE_AUTH: bool,
  VITE_PRODUCTS_PAGE_SIZE: z.coerce.number().int().positive().default(20),
  VITE_SIMULATE_PAYMENT_DELAY_MS: z.coerce.number().int().min(0).default(1500),
  VITE_CURRENCY_CODE: z.string().default("USD"),
  VITE_CURRENCY_LOCALE: z.string().default("en-US"),
  VITE_SITE_NAME: z.string().default("Dokan"),
  VITE_SITE_URL: z.string().default(""),
  VITE_FREE_SHIPPING_THRESHOLD: z.coerce.number().min(0).default(0),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) {
  const fields = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
  throw new Error(
    `Invalid environment variables: ${fields}. Copy .env.example to .env.local (or set them in Vercel).`,
  );
}

const e = parsed.data;

export const env = {
  supabaseUrl: e.VITE_SUPABASE_URL,
  supabaseAnonKey: e.VITE_SUPABASE_ANON_KEY,
  apiBaseUrl: e.VITE_API_BASE_URL,
  discountRate: e.VITE_DISCOUNT_RATE,
  defaultCoupon: e.VITE_DEFAULT_COUPON,
  supportEmail: e.VITE_SUPPORT_EMAIL,
  supportPhone: e.VITE_SUPPORT_PHONE,
  enableGoogleAuth: e.VITE_ENABLE_GOOGLE_AUTH,
  productsPageSize: e.VITE_PRODUCTS_PAGE_SIZE,
  paymentDelayMs: e.VITE_SIMULATE_PAYMENT_DELAY_MS,
  currencyCode: e.VITE_CURRENCY_CODE,
  currencyLocale: e.VITE_CURRENCY_LOCALE,
  siteName: e.VITE_SITE_NAME,
  siteUrl: e.VITE_SITE_URL,
  freeShippingThreshold: e.VITE_FREE_SHIPPING_THRESHOLD,
} as const;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(env.currencyLocale, {
    style: "currency",
    currency: env.currencyCode,
  }).format(value);
}

export function applyDiscount(subtotal: number): {
  discount: number;
  total: number;
} {
  const discount = subtotal * env.discountRate;
  return { discount, total: subtotal - discount };
}
