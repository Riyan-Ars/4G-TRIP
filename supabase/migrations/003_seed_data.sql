-- 4G TRIP: Demonstration & Seed Data
-- Trip: Malaysia Getaway (Banda Aceh -> Kuala Lumpur)
-- Target Budget: Rp15.000.000, Total Verified: Rp3.500.000, Expenses: Rp500.000

-- Note: In production Supabase, UUIDs would tie to actual auth.users.
-- This script provides standard SQL seed template for initial deployment.

DO $$
DECLARE
  v_owner_id UUID := gen_random_uuid();
  v_admin_id UUID := gen_random_uuid();
  v_member_id UUID := gen_random_uuid();
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
    (v_owner_id, 'Alfikri Djati', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '+6281234567801'),
    (v_admin_id, 'Adrian Pratama', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '+6281234567802'),
    (v_member_id, 'Reina Ariel', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', '+6281234567803');

  -- 2. Trip
  INSERT INTO public.trips (id, name, origin, destination, departure_date, return_date, status, cover_image_url, owner_id) VALUES
    (v_trip_id, 'Malaysia Getaway', 'Banda Aceh', 'Kuala Lumpur', NULL, NULL, 'planning', '/images/malaysia-hero.jpg', v_owner_id);

  -- 3. Trip Members
  INSERT INTO public.trip_members (trip_id, user_id, role, target_contribution) VALUES
    (v_trip_id, v_owner_id, 'owner', 5000000),
    (v_trip_id, v_admin_id, 'admin', 5000000),
    (v_trip_id, v_member_id, 'member', 5000000);

  -- 4. Budget
  INSERT INTO public.budgets (trip_id, target_amount, currency, revision_note, created_by) VALUES
    (v_trip_id, 15000000, 'IDR', 'Initial approved savings target for 4D3N trip', v_owner_id);

  -- 5. Budget Categories
  INSERT INTO public.budget_categories (id, trip_id, name, allocated_amount, category_type, icon_name) VALUES
    (v_cat_flight, v_trip_id, 'Flights (BTJ ⇄ KUL)', 4500000, 'flights', 'Plane'),
    (v_cat_hotel, v_trip_id, 'Accommodation (Bukit Bintang)', 4000000, 'accommodation', 'Building2'),
    (v_cat_food, v_trip_id, 'Food & Drinks', 2500000, 'food', 'Utensils'),
    (v_cat_transit, v_trip_id, 'Local Transportation (Grab/MRT)', 1500000, 'transport', 'Car'),
    (v_cat_attractions, v_trip_id, 'Attractions & Sightseeing', 1200000, 'attractions', 'Ticket'),
    (v_cat_sim, v_trip_id, 'Internet & SIM Roaming', 300000, 'internet_sim', 'Wifi'),
    (v_cat_emergency, v_trip_id, 'Emergency Contingency Fund', 1000000, 'emergency', 'ShieldAlert');

  -- 6. Contributions (Rp3.500.000 verified, Rp1.000.000 pending)
  INSERT INTO public.contributions (trip_id, member_id, amount, payment_method, payment_date, reference_number, notes, status, verified_by, verified_at) VALUES
    (v_trip_id, v_owner_id, 2000000, 'bank_transfer', CURRENT_DATE - INTERVAL '10 days', 'BCA-847291', 'Batch 1 group savings contribution', 'verified', v_owner_id, timezone('utc'::text, now() - INTERVAL '10 days')),
    (v_trip_id, v_admin_id, 1500000, 'bank_transfer', CURRENT_DATE - INTERVAL '5 days', 'MANDIRI-192834', 'Batch 1 flight reservation fund', 'verified', v_owner_id, timezone('utc'::text, now() - INTERVAL '4 days')),
    (v_trip_id, v_member_id, 1000000, 'qris', CURRENT_DATE, 'QRIS-774829', 'October savings installment', 'pending', NULL, NULL);

  -- 7. Expenses (Rp500.000 recorded)
  INSERT INTO public.expenses (trip_id, category_id, amount, description, expense_date, responsible_member_id, created_by) VALUES
    (v_trip_id, v_cat_hotel, 500000, 'Booking down payment for apartment in Bukit Bintang', CURRENT_DATE - INTERVAL '3 days', v_admin_id, v_admin_id);

  -- 8. Itinerary Items (4D3N)
  INSERT INTO public.itinerary_items (trip_id, day_number, title, description, location, start_time, end_time, estimated_cost, status, sort_order, created_by) VALUES
    (v_trip_id, 1, 'Depart from Sultan Iskandar Muda (BTJ)', 'Morning flight Banda Aceh to Kuala Lumpur International Airport', 'Sultan Iskandar Muda Airport (BTJ)', '08:30:00', '11:00:00', 0, 'confirmed', 1, v_owner_id),
    (v_trip_id, 1, 'Arrive in Kuala Lumpur & Grab to City', 'Clear immigration, pick up physical SIM cards, Grab to hotel', 'KLIA Terminal 2', '11:00:00', '12:30:00', 250000, 'confirmed', 2, v_admin_id),
    (v_trip_id, 1, 'Check in to accommodation', 'Drop luggage, refresh, unpack essentials', 'Bukit Bintang Suite', '14:00:00', '15:30:00', 0, 'suggested', 3, v_owner_id),
    (v_trip_id, 1, 'Sunset Walk at KLCC Park', 'Scenic stroll, Lake Symphony fountain show, photo session', 'KLCC Park, Kuala Lumpur', '16:30:00', '18:30:00', 0, 'suggested', 4, v_member_id),
    (v_trip_id, 2, 'Visit Batu Caves', 'Climb the 272 vibrant stairs, marvel at Lord Murugan statue', 'Gombak, Selangor', '08:30:00', '11:30:00', 50000, 'suggested', 1, v_owner_id),
    (v_trip_id, 2, 'Explore Petronas Twin Towers & Suria KLCC', 'Skybridge view, boutique shopping and lunch at Suria Food Court', 'Kuala Lumpur City Centre', '13:00:00', '16:00:00', 350000, 'suggested', 2, v_admin_id),
    (v_trip_id, 2, 'Dinner & Night Market at Jalan Alor', 'Famous street food paradise: chicken wings, dim sum, coconut ice cream', 'Jalan Alor, Bukit Bintang', '19:00:00', '22:00:00', 150000, 'suggested', 3, v_member_id),
    (v_trip_id, 3, 'Historical Walk at Dataran Merdeka', 'Sultan Abdul Samad Building, National Textile Museum photography', 'Dataran Merdeka', '09:00:00', '11:30:00', 0, 'suggested', 1, v_owner_id),
    (v_trip_id, 3, 'Central Market (Pasar Seni) & Kasturi Walk', 'Authentic Malaysian souvenirs, handicrafts, batik and teh tarik', 'Jalan Hang Kasturi', '12:00:00', '14:30:00', 200000, 'suggested', 2, v_admin_id),
    (v_trip_id, 3, 'Petaling Street (Chinatown) Exploration', 'Vibrant neon street night market, hidden speakeasies and coffee', 'Chinatown, KL', '16:00:00', '20:30:00', 120000, 'suggested', 3, v_member_id),
    (v_trip_id, 4, 'Traditional Roti Canai & Kopi Breakfast', 'Local kopitiam morning farewell breakfast', 'Bukit Bintang Kopitiam', '08:00:00', '09:30:00', 60000, 'suggested', 1, v_owner_id),
    (v_trip_id, 4, 'Check Out & Airport Transfer', 'Pack bags, check out hotel, express transit to KLIA', 'KL Sentral / KLIA', '10:30:00', '13:00:00', 200000, 'suggested', 2, v_admin_id),
    (v_trip_id, 4, 'Return Flight to Banda Aceh', 'Safe flight back home to Aceh with unforgettable memories', 'KLIA -> BTJ', '15:00:00', '16:30:00', 0, 'confirmed', 3, v_owner_id);

  -- 9. Destinations
  INSERT INTO public.destinations (trip_id, name, description, image_url, location, category, estimated_cost, is_saved) VALUES
    (v_trip_id, 'Petronas Twin Towers', 'Iconic 88-story twin skyscrapers with world-famous double-decked skybridge and sparkling night views.', '/images/malaysia-hero.jpg', 'Kuala Lumpur City Centre', 'photography', 320000, true),
    (v_trip_id, 'Batu Caves', 'Ancient limestone caves featuring the magnificent 42.7m golden Lord Murugan statue and 272 rainbow steps.', '/images/batu-caves.jpg', 'Gombak, Selangor', 'culture', 50000, true),
    (v_trip_id, 'KLCC Park', '50-acre tropical landscaped park in the heart of KL with Lake Symphony light and musical water shows.', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80', 'Kuala Lumpur City Centre', 'nature', 0, true),
    (v_trip_id, 'Jalan Alor Night Food Market', 'Bustling food street renowned for sizzling satay, chili crab, char kway teow, and vibrant evening atmosphere.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80', 'Bukit Bintang, KL', 'food', 120000, true),
    (v_trip_id, 'Dataran Merdeka (Independence Square)', 'Historical colonial square framed by the Sultan Abdul Samad Building and lush manicured lawns.', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80', 'Jalan Raja, City Centre', 'culture', 0, true),
    (v_trip_id, 'Central Market (Pasar Seni)', 'Art-deco heritage landmark and vibrant center for Malaysian arts, local handicrafts, and unique souvenirs.', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80', 'Jalan Hang Kasturi', 'shopping', 150000, true);

  -- 10. Packing Items
  INSERT INTO public.packing_items (trip_id, title, category, is_completed, assigned_to, created_by) VALUES
    (v_trip_id, 'Passport (Valid min. 6 months)', 'documents', true, v_owner_id, v_owner_id),
    (v_trip_id, 'Malaysia Digital Arrival Card (MDAC)', 'documents', false, v_admin_id, v_owner_id),
    (v_trip_id, 'Return Flight Tickets & Boarding Passes', 'documents', true, v_owner_id, v_owner_id),
    (v_trip_id, 'Hotel / Accommodation Reservation Voucher', 'documents', true, v_admin_id, v_admin_id),
    (v_trip_id, 'Travel Insurance Coverage', 'documents', false, v_member_id, v_owner_id),
    (v_trip_id, 'SIM Card / International E-SIM Roaming', 'gear', true, v_admin_id, v_admin_id),
    (v_trip_id, 'Power Bank & Type G Universal Plug Adapter', 'gear', false, v_owner_id, v_owner_id),
    (v_trip_id, 'Lightweight Breathable Outfits & Modest Cave Wear', 'clothing', false, v_member_id, v_member_id),
    (v_trip_id, 'Personal Medications & Travel First Aid', 'health', true, v_admin_id, v_admin_id),
    (v_trip_id, 'Debit Cards (BCA/Mandiri activated for overseas) & Ringgit Cash', 'finance', true, v_owner_id, v_owner_id);

  -- 11. Group Notes
  INSERT INTO public.group_notes (trip_id, author_id, content, is_pinned) VALUES
    (v_trip_id, v_member_id, 'Loving the vibe of this trip plan. Let''s goooow! Don''t forget comfortable sneakers for Batu Caves stairs!', true),
    (v_trip_id, v_admin_id, 'Reminder: We should exchange currency in Banda Aceh before departure or use BCA debit directly at Maybank KLIA ATMs for zero surcharge rates.', false);

  -- 12. Activity Logs
  INSERT INTO public.activity_logs (trip_id, actor_id, action, entity_type, metadata) VALUES
    (v_trip_id, v_owner_id, 'created_trip', 'trip', '{"trip_name": "Malaysia Getaway"}'::jsonb),
    (v_trip_id, v_owner_id, 'set_budget', 'budget', '{"target_amount": 15000000}'::jsonb),
    (v_trip_id, v_owner_id, 'verified_contribution', 'contribution', '{"amount": 2000000, "member": "Alfikri Djati"}'::jsonb),
    (v_trip_id, v_admin_id, 'verified_contribution', 'contribution', '{"amount": 1500000, "member": "Adrian Pratama"}'::jsonb),
    (v_trip_id, v_member_id, 'submitted_contribution', 'contribution', '{"amount": 1000000, "member": "Reina Ariel", "status": "pending"}'::jsonb),
    (v_trip_id, v_admin_id, 'recorded_expense', 'expense', '{"amount": 500000, "description": "Apartment deposit"}'::jsonb);

END $$;
