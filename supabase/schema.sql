/*
  ================================================================
  1. GLOBAL UTILITIES & EXTENSIONS
  ================================================================
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Generic function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
  ================================================================
  2. PROFILES TABLE
  ================================================================
  Description: Extends auth.users with additional user information.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name  TEXT NOT NULL DEFAULT '',
  last_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security: Users can only manage their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_own" ON public.profiles;
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

/*
  ================================================================
  3. ADDRESSES TABLE
  ================================================================
  Description: Stores user shipping and billing addresses.
*/

CREATE TABLE IF NOT EXISTS public.addresses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name     TEXT NOT NULL,
  company_name   TEXT,
  street_address TEXT NOT NULL,
  apartment      TEXT,
  city           TEXT NOT NULL,
  phone          TEXT NOT NULL,
  email          TEXT NOT NULL,
  is_default     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_addresses_updated ON public.addresses;
CREATE TRIGGER on_addresses_updated
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Index for faster user address lookups
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- Enforce only one default address per user
CREATE UNIQUE INDEX IF NOT EXISTS one_default_address_per_user
  ON public.addresses(user_id)
  WHERE is_default = TRUE;

-- Security: Users can only manage their own addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "addresses_own" ON public.addresses;
CREATE POLICY "addresses_own" ON public.addresses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

/*
  ================================================================
  4. CART ITEMS TABLE
  ================================================================
  Description: Manages items in users' shopping carts.
*/

CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  INT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_cart_items_updated ON public.cart_items;
CREATE TRIGGER on_cart_items_updated
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Index for cart retrieval
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- Security: Users can only manage their own cart
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cart_own" ON public.cart_items;
CREATE POLICY "cart_own" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

/*
  ================================================================
  5. WISHLIST ITEMS TABLE
  ================================================================
  Description: Stores products saved by users for later.
*/

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  INT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Index for wishlist retrieval
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON public.wishlist_items(user_id);

-- Security: Users can only manage their own wishlist
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "wishlist_own" ON public.wishlist_items;
CREATE POLICY "wishlist_own" ON public.wishlist_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

/*
  ================================================================
  6. ORDERS TABLE
  ================================================================
  Description: Main table for customer orders.
*/

CREATE TABLE IF NOT EXISTS public.orders (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_id     UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  order_number   TEXT NOT NULL UNIQUE,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod','bank')),
  subtotal       NUMERIC(10,2) NOT NULL,
  discount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total          NUMERIC(10,2) NOT NULL,
  coupon_code    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Index for order history
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Security: Users can only view and manage their own orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_own" ON public.orders;
CREATE POLICY "orders_own" ON public.orders
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

/*
  ================================================================
  7. ORDER ITEMS TABLE
  ================================================================
  Description: Line items for each order (snapshots of product details).
*/

CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  INT NOT NULL,
  title       TEXT NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  quantity    INT NOT NULL CHECK (quantity > 0),
  image       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for order item lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Security: Users can only access items of their own orders
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Must own the parent order
DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
CREATE POLICY "order_items_select_own" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Policy for INSERT: Must own the parent order
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
