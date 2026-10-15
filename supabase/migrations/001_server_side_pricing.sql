/*
  ================================================================
  DRAFT - 001_server_side_pricing.sql
  ================================================================
  NOT APPLIED. Review before running against any database.

  Purpose:
    1. Server-side coupon storage (public.coupons) with read access
       for authenticated users only.
    2. Server-generated, unique order numbers (default on orders.order_number).
    3. Guard against negative order totals.

  Note: product prices come from an external catalog (dummyjson), so a
  trigger cannot verify order_items.price against a trusted source inside
  the database. Price trust must be enforced in a server-side function
  (e.g. an Edge Function) instead. That is intentionally not in this draft.

  Matches existing names in supabase/schema.sql (orders.order_number,
  orders.total, orders.coupon_code, public.handle_updated_at()).
*/

/*
  ================================================================
  1. COUPONS TABLE
  ================================================================
  discount_rate is a fraction between 0 and 1 (0.10 = 10% off),
  matching VITE_DISCOUNT_RATE in .env.example.
*/

CREATE TABLE IF NOT EXISTS public.coupons (
  code          TEXT PRIMARY KEY,
  discount_rate NUMERIC(5,4) NOT NULL CHECK (discount_rate >= 0 AND discount_rate <= 1),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS on_coupons_updated ON public.coupons;
CREATE TRIGGER on_coupons_updated
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Security: coupons are readable only by signed-in users, and only while active.
-- No INSERT/UPDATE/DELETE policy is created, so only the service role
-- (which bypasses RLS) can manage coupons.
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coupons_read_authenticated" ON public.coupons;
CREATE POLICY "coupons_read_authenticated" ON public.coupons
  FOR SELECT TO authenticated
  USING (active = TRUE);

/*
  ================================================================
  2. SERVER-GENERATED ORDER NUMBERS
  ================================================================
  Format: DKN-00000001, DKN-00000002, ...
  The sequence lives in the database, so clients cannot choose or
  collide on order numbers. The existing UNIQUE constraint on
  orders.order_number still guards against duplicates.
*/

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1 INCREMENT BY 1;

-- Column default only applies when the client does not send order_number.
ALTER TABLE public.orders
  ALTER COLUMN order_number
  SET DEFAULT 'DKN-' || LPAD(nextval('public.order_number_seq')::TEXT, 8, '0');

/*
  ================================================================
  3. TOTAL MUST BE NON-NEGATIVE
  ================================================================
  Postgres has no "ADD CONSTRAINT IF NOT EXISTS", so drop first to keep
  this migration re-runnable.
*/

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_total_non_negative;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_total_non_negative CHECK (total >= 0);
