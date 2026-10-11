-- ==============================================================================
-- 4G TRIP: COMPLETE SUPABASE DATABASE SETUP & SEED SCRIPT
-- ==============================================================================
-- Proyek: 4G TRIP (Banda Aceh ⇄ Kuala Lumpur 2026)
-- Pengguna:
--   1. RIYAN ARYA SYAHPUTRA (Admin / Owner / Leader - Password: 123456)
--   2. FATHUN MUNAJAN (Member)
--   3. BINTANG FAJAR (Member)
-- ==============================================================================

-- 1. DROP EXISTING TABLES & FUNCTIONS (Untuk Reset Bersih)
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.group_notes CASCADE;
DROP TABLE IF EXISTS public.packing_items CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;
DROP TABLE IF EXISTS public.itinerary_items CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.contributions CASCADE;
DROP TABLE IF EXISTS public.budget_categories CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.trip_invitations CASCADE;
DROP TABLE IF EXISTS public.trip_members CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.is_trip_member(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_trip_role(UUID, UUID) CASCADE;

-- ==============================================================================
-- 2. CREATE SCHEMAS & TABLES
-- ==============================================================================

-- 2.1 Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Trips Table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT 'Banda Aceh',
  destination TEXT NOT NULL DEFAULT 'Kuala Lumpur',
  departure_date DATE,
  return_date DATE,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('draft', 'planning', 'confirmed', 'ongoing', 'completed')),
  cover_image_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 Trip Members Table
CREATE TABLE public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  target_contribution BIGINT NOT NULL DEFAULT 5000000,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_trip_member UNIQUE(trip_id, user_id)
);

-- 2.4 Trip Invitations Table
CREATE TABLE public.trip_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 Budgets Table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  target_amount BIGINT NOT NULL DEFAULT 15000000 CHECK (target_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'IDR',
  revision_note TEXT,
  created_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 Budget Categories Table
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  allocated_amount BIGINT NOT NULL DEFAULT 0 CHECK (allocated_amount >= 0),
  category_type TEXT NOT NULL DEFAULT 'custom' CHECK (category_type IN ('flights', 'accommodation', 'food', 'transport', 'attractions', 'internet_sim', 'emergency', 'custom')),
  icon_name TEXT DEFAULT 'Tag',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 Contributions Table (Tabungan Bersama)
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount BIGINT NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'qris', 'gopay', 'ovo', 'dana', 'cash', 'other')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number TEXT,
  receipt_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.8 Expenses Table (Pengeluaran Bersama)
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  amount BIGINT NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  responsible_member_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.9 Itinerary Items Table (Rundown Perjalanan 4D3N)
CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL DEFAULT 1 CHECK (day_number > 0),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  scheduled_date DATE,
  start_time TIME,
  end_time TIME,
  estimated_cost BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'confirmed', 'completed', 'skipped')),
  sort_order INT NOT NULL DEFAULT 0,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.10 Destinations Table (Destinasi Wisata)
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('culture', 'nature', 'food', 'shopping', 'entertainment', 'photography')),
  estimated_cost BIGINT NOT NULL DEFAULT 0,
  is_saved BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.11 Packing Items Table (Daftar Bawaan)
CREATE TABLE public.packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('documents', 'clothing', 'gear', 'health', 'finance', 'other')),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.12 Group Notes Table (Catatan Bersama)
CREATE TABLE public.group_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.13 Activity Logs Table (Riwayat Aktivitas)
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes untuk Kecepatan Query
CREATE INDEX idx_trip_members_trip ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user ON public.trip_members(user_id);
CREATE INDEX idx_contributions_trip ON public.contributions(trip_id);
CREATE INDEX idx_expenses_trip ON public.expenses(trip_id);
CREATE INDEX idx_itinerary_trip ON public.itinerary_items(trip_id, day_number);

-- ==============================================================================
-- 3. RLS HELPER FUNCTIONS & POLICIES
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_trip_member(check_trip_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_id = check_trip_id AND user_id = check_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_trip_role(check_trip_id UUID, check_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.trip_members
  WHERE trip_id = check_trip_id AND user_id = check_user_id
  LIMIT 1;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Polisi Akses (Read untuk semua pengguna terotentikasi dan anon untuk kemudahan PWA)
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles editable by owner" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Trips viewable by members" ON public.trips FOR ALL USING (true);
CREATE POLICY "Trip members viewable" ON public.trip_members FOR ALL USING (true);
CREATE POLICY "Budgets viewable" ON public.budgets FOR ALL USING (true);
CREATE POLICY "Categories viewable" ON public.budget_categories FOR ALL USING (true);
CREATE POLICY "Contributions viewable" ON public.contributions FOR ALL USING (true);
CREATE POLICY "Expenses viewable" ON public.expenses FOR ALL USING (true);
CREATE POLICY "Itinerary viewable" ON public.itinerary_items FOR ALL USING (true);
CREATE POLICY "Destinations viewable" ON public.destinations FOR ALL USING (true);
CREATE POLICY "Packing items viewable" ON public.packing_items FOR ALL USING (true);
CREATE POLICY "Notes viewable" ON public.group_notes FOR ALL USING (true);
CREATE POLICY "Activity logs viewable" ON public.activity_logs FOR ALL USING (true);

-- ==============================================================================
-- 4. INSERT SEED DATA (RIYAN ARYA SYAHPUTRA, FATHUN MUNAJAN, BINTANG FAJAR)
-- ==============================================================================

DO $$
DECLARE
  v_riyan_id UUID := gen_random_uuid();
  v_fathun_id UUID := gen_random_uuid();
  v_bintang_id UUID := gen_random_uuid();
  v_trip_id UUID := gen_random_uuid();
  v_cat_flight UUID := gen_random_uuid();
  v_cat_hotel UUID := gen_random_uuid();
  v_cat_food UUID := gen_random_uuid();
  v_cat_transit UUID := gen_random_uuid();
  v_cat_attractions UUID := gen_random_uuid();
  v_cat_sim UUID := gen_random_uuid();
  v_cat_emergency UUID := gen_random_uuid();
BEGIN
  -- 1. Profiles
  INSERT INTO public.profiles (id, display_name, avatar_url, phone) VALUES
    (v_riyan_id, 'RIYAN ARYA SYAHPUTRA', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', '+6281234567801'),
    (v_fathun_id, 'FATHUN MUNAJAN', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', '+6281234567802'),
    (v_bintang_id, 'BINTANG FAJAR', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '+6281234567803');

  -- 2. Trip (Malaysia Getaway)
  INSERT INTO public.trips (id, name, origin, destination, departure_date, return_date, status, cover_image_url, owner_id) VALUES
    (v_trip_id, 'Malaysia Getaway', 'Banda Aceh', 'Kuala Lumpur', NULL, NULL, 'planning', '/images/malaysia-hero.jpg', v_riyan_id);

  -- 3. Trip Members (1 Owner/Admin + 2 Members)
  INSERT INTO public.trip_members (trip_id, user_id, role, target_contribution) VALUES
    (v_trip_id, v_riyan_id, 'owner', 5000000),
    (v_trip_id, v_fathun_id, 'member', 5000000),
    (v_trip_id, v_bintang_id, 'member', 5000000);

  -- 4. Budget (Rp 15.000.000 Target)
  INSERT INTO public.budgets (trip_id, target_amount, currency, revision_note, created_by) VALUES
    (v_trip_id, 15000000, 'IDR', 'Target tabungan bersama 4D3N Banda Aceh ke Kuala Lumpur', v_riyan_id);

  -- 5. Budget Categories
  INSERT INTO public.budget_categories (id, trip_id, name, allocated_amount, category_type, icon_name) VALUES
    (v_cat_flight, v_trip_id, 'Tiket Pesawat (BTJ ⇄ KUL)', 4500000, 'flights', 'Plane'),
    (v_cat_hotel, v_trip_id, 'Penginapan (Bukit Bintang)', 4000000, 'accommodation', 'Building2'),
    (v_cat_food, v_trip_id, 'Makanan & Kuliner', 2500000, 'food', 'Utensils'),
    (v_cat_transit, v_trip_id, 'Transportasi Lokal (Grab/MRT)', 1500000, 'transport', 'Car'),
    (v_cat_attractions, v_trip_id, 'Tiket Wisata & Atraksi', 1200000, 'attractions', 'Ticket'),
    (v_cat_sim, v_trip_id, 'SIM Card Roaming & Internet', 300000, 'internet_sim', 'Wifi'),
    (v_cat_emergency, v_trip_id, 'Dana Darurat (Emergency)', 1000000, 'emergency', 'ShieldAlert');

  -- 6. Contributions (Tabungan Awal)
  INSERT INTO public.contributions (trip_id, member_id, amount, payment_method, payment_date, reference_number, notes, status, verified_by, verified_at) VALUES
    (v_trip_id, v_riyan_id, 2000000, 'bank_transfer', CURRENT_DATE - INTERVAL '10 days', 'BCA-847291', 'Tabungan tahap 1 RIYAN ARYA SYAHPUTRA', 'verified', v_riyan_id, timezone('utc'::text, now() - INTERVAL '10 days')),
    (v_trip_id, v_fathun_id, 1500000, 'bank_transfer', CURRENT_DATE - INTERVAL '5 days', 'MANDIRI-192834', 'Tabungan tahap 1 FATHUN MUNAJAN', 'verified', v_riyan_id, timezone('utc'::text, now() - INTERVAL '4 days')),
    (v_trip_id, v_bintang_id, 1000000, 'qris', CURRENT_DATE, 'QRIS-774829', 'Tabungan tahap 1 BINTANG FAJAR', 'pending', NULL, NULL);

  -- 7. Expenses (Pengeluaran yang sudah dibayar)
  INSERT INTO public.expenses (trip_id, category_id, amount, description, expense_date, responsible_member_id, created_by) VALUES
    (v_trip_id, v_cat_hotel, 500000, 'DP Booking Apartemen Bukit Bintang', CURRENT_DATE - INTERVAL '3 days', v_fathun_id, v_fathun_id);

  -- 8. Itinerary Items (4D3N)
  INSERT INTO public.itinerary_items (trip_id, day_number, title, description, location, start_time, end_time, estimated_cost, status, sort_order, created_by) VALUES
    (v_trip_id, 1, 'Berangkat dari Sultan Iskandar Muda (BTJ)', 'Penerbangan pagi Banda Aceh ke Kuala Lumpur (KLIA)', 'Bandara SIM (BTJ)', '08:30:00', '11:00:00', 0, 'confirmed', 1, v_riyan_id),
    (v_trip_id, 1, 'Tiba di KLIA & Grab ke Kota', 'Imigrasi, beli eSIM/SIM fisik, naik Grab ke Bukit Bintang', 'KLIA Terminal 2', '11:00:00', '12:30:00', 250000, 'confirmed', 2, v_fathun_id),
    (v_trip_id, 1, 'Check-in Penginapan & Istirahat', 'Taruh koper, refresh pakaian', 'Bukit Bintang Suite', '14:00:00', '15:30:00', 0, 'suggested', 3, v_riyan_id),
    (v_trip_id, 1, 'Sunset di KLCC Park & Air Mancur', 'Jalan santai, nonton Lake Symphony musical show, foto Menara Kembar', 'KLCC Park', '16:30:00', '18:30:00', 0, 'suggested', 4, v_bintang_id),
    (v_trip_id, 2, 'Kunjungan ke Batu Caves', 'Naik 272 tangga warna-warni, foto Patung Dewa Murugan', 'Batu Caves, Selangor', '08:30:00', '11:30:00', 50000, 'suggested', 1, v_riyan_id),
    (v_trip_id, 2, 'Eksplorasi Petronas Twin Towers & Suria KLCC', 'Skybridge view, makan siang food court Suria KLCC', 'Kuala Lumpur City Centre', '13:00:00', '16:00:00', 350000, 'suggested', 2, v_fathun_id),
    (v_trip_id, 2, 'Kuliner Malam di Jalan Alor', 'Street food: sayap ayam panggang, seafood, durian musang king', 'Jalan Alor, Bukit Bintang', '19:00:00', '22:00:00', 150000, 'suggested', 3, v_bintang_id),
    (v_trip_id, 3, 'Wisata Bersejarah di Dataran Merdeka', 'Bangunan Sultan Abdul Samad, River of Life, foto ikonik', 'Dataran Merdeka', '09:00:00', '11:30:00', 0, 'suggested', 1, v_riyan_id),
    (v_trip_id, 3, 'Belanja Oleh-Oleh di Central Market (Pasar Seni)', 'Batik, gantungan kunci, teh tarik, coklat Malaysia', 'Pasar Seni KL', '12:00:00', '14:30:00', 200000, 'suggested', 2, v_fathun_id),
    (v_trip_id, 3, 'Eksplorasi Chinatown (Petaling Street)', 'Pasar malam neon, kuliner kopi legendaris', 'Chinatown, KL', '16:00:00', '20:30:00', 120000, 'suggested', 3, v_bintang_id),
    (v_trip_id, 4, 'Sarapan Kopi & Roti Canai', 'Kopitiam pagi khas Melayu sebelum check-out', 'Bukit Bintang Kopitiam', '08:00:00', '09:30:00', 60000, 'suggested', 1, v_riyan_id),
    (v_trip_id, 4, 'Check-Out & Menuju Bandara KLIA', 'Bawa koper, transfer ke KLIA', 'KL Sentral / KLIA', '10:30:00', '13:00:00', 200000, 'suggested', 2, v_fathun_id),
    (v_trip_id, 4, 'Penerbangan Pulang ke Banda Aceh', 'Kembali ke Aceh membawa kenangan seru', 'KLIA -> BTJ', '15:00:00', '16:30:00', 0, 'confirmed', 3, v_riyan_id);

  -- 9. Destinations
  INSERT INTO public.destinations (trip_id, name, description, image_url, location, category, estimated_cost, is_saved) VALUES
    (v_trip_id, 'Petronas Twin Towers', 'Menara kembar ikonik 88 lantai dengan jembatan layang spektakuler.', '/images/malaysia-hero.jpg', 'Kuala Lumpur City Centre', 'photography', 320000, true),
    (v_trip_id, 'Batu Caves', 'Gua batu kapur kuno dengan patung emas Dewa Murugan 42.7m & 272 tangga pelangi.', '/images/batu-caves.jpg', 'Gombak, Selangor', 'culture', 50000, true),
    (v_trip_id, 'KLCC Park', 'Taman tropis 50 hektar dengan pertunjukan air mancur musikal Lake Symphony.', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80', 'Kuala Lumpur City Centre', 'nature', 0, true),
    (v_trip_id, 'Jalan Alor Night Market', 'Pusat wisata kuliner malam legendaris Kuala Lumpur.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 'Bukit Bintang, KL', 'food', 120000, true);

  -- 10. Packing Items
  INSERT INTO public.packing_items (trip_id, title, category, is_completed, assigned_to, created_by) VALUES
    (v_trip_id, 'Paspor (Masa berlaku minimal 6 bulan)', 'documents', true, v_riyan_id, v_riyan_id),
    (v_trip_id, 'Malaysia Digital Arrival Card (MDAC)', 'documents', false, v_fathun_id, v_riyan_id),
    (v_trip_id, 'Tiket Pesawat PP & Boarding Pass', 'documents', true, v_riyan_id, v_riyan_id),
    (v_trip_id, 'Voucher Booking Hotel / Apartemen', 'documents', true, v_fathun_id, v_fathun_id),
    (v_trip_id, 'Asuransi Perjalanan', 'documents', false, v_bintang_id, v_riyan_id),
    (v_trip_id, 'SIM Card / eSIM Roaming', 'gear', true, v_fathun_id, v_fathun_id),
    (v_trip_id, 'Power Bank & Colokan Adaptor Tipe G (Kaki 3)', 'gear', false, v_riyan_id, v_riyan_id);

  -- 11. Group Notes
  INSERT INTO public.group_notes (trip_id, author_id, content, is_pinned) VALUES
    (v_trip_id, v_bintang_id, 'Keren banget rencana jalannya. Jangan lupa bawa sepatu kets yang nyaman buat tangga Batu Caves!', true),
    (v_trip_id, v_fathun_id, 'Tips: Tukar sedikit Ringgit di Banda Aceh atau tarik tunai via kartu ATM di Maybank KLIA2.', false);

  -- 12. Activity Logs
  INSERT INTO public.activity_logs (trip_id, actor_id, action, entity_type, metadata) VALUES
    (v_trip_id, v_riyan_id, 'created_trip', 'trip', '{"trip_name": "Malaysia Getaway"}'::jsonb),
    (v_trip_id, v_riyan_id, 'set_budget', 'budget', '{"target_amount": 15000000}'::jsonb),
    (v_trip_id, v_riyan_id, 'verified_contribution', 'contribution', '{"amount": 2000000, "member": "RIYAN ARYA SYAHPUTRA"}'::jsonb),
    (v_trip_id, v_riyan_id, 'verified_contribution', 'contribution', '{"amount": 1500000, "member": "FATHUN MUNAJAN"}'::jsonb),
    (v_trip_id, v_bintang_id, 'submitted_contribution', 'contribution', '{"amount": 1000000, "member": "BINTANG FAJAR", "status": "pending"}'::jsonb),
    (v_trip_id, v_fathun_id, 'recorded_expense', 'expense', '{"amount": 500000, "description": "DP Apartemen"}'::jsonb);

END $$;
