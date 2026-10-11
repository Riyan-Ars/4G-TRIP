-- 4G TRIP: Row Level Security (RLS) & Role-based Access Control Policies

-- 1. Helper security definer functions (avoids recursive RLS loops)
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

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Trips Policies
CREATE POLICY "Users can view trips they are members of"
  ON public.trips FOR SELECT
  TO authenticated
  USING (public.is_trip_member(id, auth.uid()));

CREATE POLICY "Authenticated users can create new trips"
  ON public.trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Only trip owner or admin can update trip info"
  ON public.trips FOR UPDATE
  TO authenticated
  USING (public.get_trip_role(id, auth.uid()) IN ('owner', 'admin'));

-- 4. Trip Members Policies
CREATE POLICY "Trip members can view member list"
  ON public.trip_members FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Owners and admins can invite/add trip members"
  ON public.trip_members FOR INSERT
  TO authenticated
  WITH CHECK (
    public.get_trip_role(trip_id, auth.uid()) IN ('owner', 'admin')
    OR auth.uid() = user_id -- When accepting an invite or creating trip
  );

CREATE POLICY "Owners can update member roles"
  ON public.trip_members FOR UPDATE
  TO authenticated
  USING (public.get_trip_role(trip_id, auth.uid()) = 'owner');

CREATE POLICY "Owners can remove members or members can leave"
  ON public.trip_members FOR DELETE
  TO authenticated
  USING (
    public.get_trip_role(trip_id, auth.uid()) = 'owner'
    OR user_id = auth.uid()
  );

-- 5. Budgets Policies
CREATE POLICY "Trip members can view budgets"
  ON public.budgets FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Owners and admins can manage budget targets"
  ON public.budgets FOR ALL
  TO authenticated
  USING (public.get_trip_role(trip_id, auth.uid()) IN ('owner', 'admin'));

-- 6. Budget Categories Policies
CREATE POLICY "Trip members can view categories"
  ON public.budget_categories FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Owners and admins can manage categories"
  ON public.budget_categories FOR ALL
  TO authenticated
  USING (public.get_trip_role(trip_id, auth.uid()) IN ('owner', 'admin'));

-- 7. Contributions Policies
CREATE POLICY "Trip members can view contributions"
  ON public.contributions FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Members can submit pending contributions"
  ON public.contributions FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_trip_member(trip_id, auth.uid())
    AND member_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "Only owners and admins can verify/reject contributions"
  ON public.contributions FOR UPDATE
  TO authenticated
  USING (public.get_trip_role(trip_id, auth.uid()) IN ('owner', 'admin'));

-- 8. Expenses Policies
CREATE POLICY "Trip members can view expenses"
  ON public.expenses FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Owners and admins can record and edit expenses"
  ON public.expenses FOR ALL
  TO authenticated
  USING (public.get_trip_role(trip_id, auth.uid()) IN ('owner', 'admin'));

-- 9. Itinerary Items Policies
CREATE POLICY "Trip members can view itinerary"
  ON public.itinerary_items FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Trip members can manage itinerary activities"
  ON public.itinerary_items FOR ALL
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

-- 10. Destinations Policies
CREATE POLICY "Trip members can view destinations"
  ON public.destinations FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Trip members can manage destinations"
  ON public.destinations FOR ALL
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

-- 11. Packing Items Policies
CREATE POLICY "Trip members can view and toggle packing items"
  ON public.packing_items FOR ALL
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

-- 12. Group Notes Policies
CREATE POLICY "Trip members can view notes"
  ON public.group_notes FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Trip members can add notes"
  ON public.group_notes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_member(trip_id, auth.uid()) AND author_id = auth.uid());

CREATE POLICY "Users can update/delete their own notes"
  ON public.group_notes FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own notes or admin can moderate"
  ON public.group_notes FOR DELETE
  TO authenticated
  USING (author_id = auth.uid() OR public.get_trip_role(trip_id, auth.uid()) IN ('owner', 'admin'));

-- 13. Activity Logs Policies
CREATE POLICY "Trip members can view activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (public.is_trip_member(trip_id, auth.uid()));

CREATE POLICY "Trip members can insert activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_trip_member(trip_id, auth.uid()));
