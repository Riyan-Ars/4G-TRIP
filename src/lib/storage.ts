// 4G TRIP: High-Fidelity Data Store & Synchronizer
// Supports Supabase PostgreSQL backend with transparent resilient persistent local fallback
import { 
  Trip, TripMember, Budget, BudgetCategory, Contribution, Expense, 
  ItineraryItem, Destination, PackingItem, GroupNote, ActivityLog, UserProfile, UserRole 
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY_PREFIX = '4g_trip_workspace_v2';

// Initial default user profiles
export const DEFAULT_PROFILES: Record<string, UserProfile> = {
  'user-riyan': {
    id: 'user-riyan',
    display_name: 'RIYAN ARYA SYAHPUTRA',
    avatar_url: '/images/riyan.jpg',
    phone: '+6281234567801',
    email: 'riyan@4gtrip.com'
  },
  'user-fathun': {
    id: 'user-fathun',
    display_name: 'FATHUN MUNAJAN',
    avatar_url: '/images/fathun.jpg',
    phone: '+6281234567802',
    email: 'fathun@4gtrip.com'
  },
  'user-bintang': {
    id: 'user-bintang',
    display_name: 'BINTANG FAJAR',
    avatar_url: '/images/bintang.jpg',
    phone: '+6281234567803',
    email: 'bintang@4gtrip.com'
  }
};

export const INITIAL_TRIP: Trip = {
  id: 'trip-malaysia-2026',
  name: 'Malaysia Getaway',
  origin: 'Banda Aceh',
  destination: 'Kuala Lumpur',
  departure_date: null, // As specified in prompt: initial departure date not set
  return_date: null,
  status: 'planning',
  cover_image_url: '/images/malaysia-hero.jpg',
  owner_id: 'user-riyan',
  created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  updated_at: new Date().toISOString()
};

export const INITIAL_MEMBERS: TripMember[] = [
  {
    id: 'mem-1',
    trip_id: INITIAL_TRIP.id,
    user_id: 'user-riyan',
    role: 'owner',
    target_contribution: 5000000,
    joined_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'mem-2',
    trip_id: INITIAL_TRIP.id,
    user_id: 'user-fathun',
    role: 'member',
    target_contribution: 5000000,
    joined_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'mem-3',
    trip_id: INITIAL_TRIP.id,
    user_id: 'user-bintang',
    role: 'member',
    target_contribution: 5000000,
    joined_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    profile: DEFAULT_PROFILES['user-bintang']
  }
];

export const INITIAL_BUDGET: Budget = {
  id: 'bgt-1',
  trip_id: INITIAL_TRIP.id,
  target_amount: 15000000, // Rp 15.000.000 Target Budget
  currency: 'IDR',
  revision_note: 'Initial group budget target for 4D3N trip',
  created_by: 'user-riyan',
  updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
};

export const INITIAL_CATEGORIES: BudgetCategory[] = [
  {
    id: 'cat-flights',
    trip_id: INITIAL_TRIP.id,
    name: 'Flights (BTJ ⇄ KUL)',
    allocated_amount: 4500000,
    category_type: 'flights',
    icon_name: 'Plane',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cat-hotel',
    trip_id: INITIAL_TRIP.id,
    name: 'Accommodation (Bukit Bintang)',
    allocated_amount: 4000000,
    category_type: 'accommodation',
    icon_name: 'Building2',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cat-food',
    trip_id: INITIAL_TRIP.id,
    name: 'Food & Drinks',
    allocated_amount: 2500000,
    category_type: 'food',
    icon_name: 'UtensilsCrossed',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cat-transport',
    trip_id: INITIAL_TRIP.id,
    name: 'Local Transportation (Grab/MRT)',
    allocated_amount: 1500000,
    category_type: 'transport',
    icon_name: 'Car',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cat-attractions',
    trip_id: INITIAL_TRIP.id,
    name: 'Attractions & Sightseeing',
    allocated_amount: 1200000,
    category_type: 'attractions',
    icon_name: 'Ticket',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cat-sim',
    trip_id: INITIAL_TRIP.id,
    name: 'Internet & SIM Roaming',
    allocated_amount: 300000,
    category_type: 'internet_sim',
    icon_name: 'Wifi',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'cat-emergency',
    trip_id: INITIAL_TRIP.id,
    name: 'Emergency Fund',
    allocated_amount: 1000000,
    category_type: 'emergency',
    icon_name: 'ShieldAlert',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'cb-1',
    trip_id: INITIAL_TRIP.id,
    member_id: 'user-riyan',
    amount: 2000000,
    payment_method: 'bank_transfer',
    payment_date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
    reference_number: 'BCA-847291',
    notes: 'Batch 1 group savings contribution',
    status: 'verified',
    verified_by: 'user-riyan',
    verified_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    member_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'cb-2',
    trip_id: INITIAL_TRIP.id,
    member_id: 'user-fathun',
    amount: 1500000,
    payment_method: 'bank_transfer',
    payment_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    reference_number: 'MANDIRI-192834',
    notes: 'Batch 1 flight reservation fund',
    status: 'verified',
    verified_by: 'user-riyan',
    verified_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    member_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'cb-3',
    trip_id: INITIAL_TRIP.id,
    member_id: 'user-bintang',
    amount: 1000000,
    payment_method: 'qris',
    payment_date: new Date().toISOString().split('T')[0],
    reference_number: 'QRIS-774829',
    notes: 'October savings installment',
    status: 'pending',
    created_at: new Date().toISOString(),
    member_profile: DEFAULT_PROFILES['user-bintang']
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    trip_id: INITIAL_TRIP.id,
    category_id: 'cat-hotel',
    amount: 500000,
    description: 'Booking down payment for apartment in Bukit Bintang',
    expense_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    responsible_member_id: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    category: INITIAL_CATEGORIES[1],
    responsible_profile: DEFAULT_PROFILES['user-fathun']
  }
];

export const INITIAL_ITINERARY: ItineraryItem[] = [
  {
    id: 'itin-1',
    trip_id: INITIAL_TRIP.id,
    day_number: 1,
    title: 'Depart from Sultan Iskandar Muda (BTJ)',
    description: 'Direct/transit morning flight Banda Aceh to Kuala Lumpur International Airport',
    location: 'Sultan Iskandar Muda International Airport',
    start_time: '08:30',
    end_time: '11:00',
    estimated_cost: 0,
    status: 'confirmed',
    sort_order: 1,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'itin-2',
    trip_id: INITIAL_TRIP.id,
    day_number: 1,
    title: 'Arrive in Kuala Lumpur & Express Transit',
    description: 'Clear immigration, pick up physical SIM cards, Grab to Bukit Bintang accommodation',
    location: 'KLIA Terminal 2',
    start_time: '11:30',
    end_time: '13:00',
    estimated_cost: 250000,
    status: 'confirmed',
    sort_order: 2,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'itin-3',
    trip_id: INITIAL_TRIP.id,
    day_number: 1,
    title: 'Check in to Nomad Suite & Refresh',
    description: 'Drop luggage, quick rest, unpack essentials',
    location: 'Bukit Bintang Suite',
    start_time: '14:00',
    end_time: '15:30',
    estimated_cost: 0,
    status: 'suggested',
    sort_order: 3,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'itin-4',
    trip_id: INITIAL_TRIP.id,
    day_number: 1,
    title: 'Sunset Walk at KLCC Park',
    description: 'Scenic stroll, Lake Symphony musical fountain show, iconic twilight photo session',
    location: 'KLCC Park, Kuala Lumpur',
    start_time: '16:30',
    end_time: '18:30',
    estimated_cost: 0,
    status: 'suggested',
    sort_order: 4,
    assigned_to: 'user-bintang',
    created_by: 'user-bintang',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-bintang']
  },
  {
    id: 'itin-5',
    trip_id: INITIAL_TRIP.id,
    day_number: 2,
    title: 'Visit Batu Caves Morning Excursion',
    description: 'Climb the 272 vibrant stairs, marvel at golden Lord Murugan statue and temple cave',
    location: 'Gombak, Selangor',
    start_time: '08:30',
    end_time: '11:30',
    estimated_cost: 50000,
    status: 'suggested',
    sort_order: 1,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'itin-6',
    trip_id: INITIAL_TRIP.id,
    day_number: 2,
    title: 'Explore Petronas Twin Towers & Suria KLCC',
    description: 'Skybridge view, boutique shopping and lunch at Suria Food Court',
    location: 'Kuala Lumpur City Centre',
    start_time: '13:00',
    end_time: '16:00',
    estimated_cost: 350000,
    status: 'suggested',
    sort_order: 2,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'itin-7',
    trip_id: INITIAL_TRIP.id,
    day_number: 2,
    title: 'Dinner & Night Market at Jalan Alor',
    description: 'Street food paradise: sizzling satay, spicy chicken wings, dim sum, coconut ice cream',
    location: 'Jalan Alor, Bukit Bintang',
    start_time: '19:00',
    end_time: '22:00',
    estimated_cost: 150000,
    status: 'suggested',
    sort_order: 3,
    assigned_to: 'user-bintang',
    created_by: 'user-bintang',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-bintang']
  },
  {
    id: 'itin-8',
    trip_id: INITIAL_TRIP.id,
    day_number: 3,
    title: 'Heritage Walk at Dataran Merdeka',
    description: 'Sultan Abdul Samad Building, historic flagpole, colonial architecture photo session',
    location: 'Dataran Merdeka, City Centre',
    start_time: '09:00',
    end_time: '11:30',
    estimated_cost: 0,
    status: 'suggested',
    sort_order: 1,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'itin-9',
    trip_id: INITIAL_TRIP.id,
    day_number: 3,
    title: 'Central Market (Pasar Seni) & Souvenirs',
    description: 'Authentic Malaysian handicrafts, batik shirts, Teh Tarik tasting, and local artwork',
    location: 'Jalan Hang Kasturi',
    start_time: '12:00',
    end_time: '14:30',
    estimated_cost: 200000,
    status: 'suggested',
    sort_order: 2,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'itin-10',
    trip_id: INITIAL_TRIP.id,
    day_number: 3,
    title: 'Petaling Street Chinatown Evening',
    description: 'Bustling Chinatown lantern alleyways, street snacks, and cozy rooftop drinks',
    location: 'Petaling Street, Chinatown',
    start_time: '16:00',
    end_time: '20:30',
    estimated_cost: 120000,
    status: 'suggested',
    sort_order: 3,
    assigned_to: 'user-bintang',
    created_by: 'user-bintang',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-bintang']
  },
  {
    id: 'itin-11',
    trip_id: INITIAL_TRIP.id,
    day_number: 4,
    title: 'Traditional Roti Canai & Kopi Breakfast',
    description: 'Farewell breakfast at authentic Bukit Bintang mamak stall',
    location: 'Bukit Bintang Mamak',
    start_time: '08:00',
    end_time: '09:30',
    estimated_cost: 60000,
    status: 'suggested',
    sort_order: 1,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'itin-12',
    trip_id: INITIAL_TRIP.id,
    day_number: 4,
    title: 'Check Out Suite & KL Sentral Airport Express',
    description: 'Luggage loading, hotel check out, smooth KLIA Ekspres transit',
    location: 'KL Sentral / KLIA',
    start_time: '10:30',
    end_time: '13:00',
    estimated_cost: 200000,
    status: 'suggested',
    sort_order: 2,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'itin-13',
    trip_id: INITIAL_TRIP.id,
    day_number: 4,
    title: 'Return Flight to Banda Aceh (KUL ✈ BTJ)',
    description: 'Safe flight home to Aceh with unforgettable shared memories',
    location: 'KLIA Terminal 2',
    start_time: '15:00',
    end_time: '16:30',
    estimated_cost: 0,
    status: 'confirmed',
    sort_order: 3,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  }
];

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest-1',
    trip_id: INITIAL_TRIP.id,
    name: 'Petronas Twin Towers',
    description: 'Iconic 88-story twin skyscrapers with world-famous double-decked skybridge and sparkling night views.',
    image_url: '/images/malaysia-hero.jpg',
    location: 'Kuala Lumpur City Centre',
    category: 'photography',
    estimated_cost: 320000,
    is_saved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dest-2',
    trip_id: INITIAL_TRIP.id,
    name: 'Batu Caves',
    description: 'Ancient limestone caves featuring the magnificent 42.7m golden Lord Murugan statue and 272 rainbow steps.',
    image_url: '/images/batu-caves.jpg',
    location: 'Gombak, Selangor',
    category: 'culture',
    estimated_cost: 50000,
    is_saved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dest-3',
    trip_id: INITIAL_TRIP.id,
    name: 'KLCC Park & Symphony',
    description: '50-acre tropical landscaped park in the heart of KL with Lake Symphony light and musical water shows.',
    image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80',
    location: 'Kuala Lumpur City Centre',
    category: 'nature',
    estimated_cost: 0,
    is_saved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dest-4',
    trip_id: INITIAL_TRIP.id,
    name: 'Jalan Alor Night Food Market',
    description: 'Bustling food street renowned for sizzling satay, chicken wings, dim sum, and vibrant evening atmosphere.',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    location: 'Bukit Bintang, KL',
    category: 'food',
    estimated_cost: 120000,
    is_saved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dest-5',
    trip_id: INITIAL_TRIP.id,
    name: 'Dataran Merdeka (Independence Square)',
    description: 'Historical colonial square framed by the Sultan Abdul Samad Building and lush manicured lawns.',
    image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    location: 'Jalan Raja, City Centre',
    category: 'culture',
    estimated_cost: 0,
    is_saved: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'dest-6',
    trip_id: INITIAL_TRIP.id,
    name: 'Central Market (Pasar Seni)',
    description: 'Art-deco heritage landmark and vibrant center for Malaysian arts, local handicrafts, and unique souvenirs.',
    image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
    location: 'Jalan Hang Kasturi',
    category: 'shopping',
    estimated_cost: 150000,
    is_saved: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_PACKING: PackingItem[] = [
  {
    id: 'pack-1',
    trip_id: INITIAL_TRIP.id,
    title: 'Passport (Min. 6 months validity)',
    category: 'documents',
    is_completed: true,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'pack-2',
    trip_id: INITIAL_TRIP.id,
    title: 'Malaysia Digital Arrival Card (MDAC)',
    category: 'documents',
    is_completed: false,
    assigned_to: 'user-fathun',
    created_by: 'user-riyan',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'pack-3',
    trip_id: INITIAL_TRIP.id,
    title: 'Flight Tickets (Banda Aceh ⇄ KUL)',
    category: 'documents',
    is_completed: true,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'pack-4',
    trip_id: INITIAL_TRIP.id,
    title: 'Hotel / Suite Booking Voucher',
    category: 'documents',
    is_completed: true,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'pack-5',
    trip_id: INITIAL_TRIP.id,
    title: 'Travel Insurance Documents',
    category: 'documents',
    is_completed: false,
    assigned_to: 'user-bintang',
    created_by: 'user-riyan',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-bintang']
  },
  {
    id: 'pack-6',
    trip_id: INITIAL_TRIP.id,
    title: 'SIM Card / Roaming E-SIM configured',
    category: 'gear',
    is_completed: true,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'pack-7',
    trip_id: INITIAL_TRIP.id,
    title: 'Power Bank & Type G Universal Plug Adapter',
    category: 'gear',
    is_completed: false,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'pack-8',
    trip_id: INITIAL_TRIP.id,
    title: 'Comfortable Walking Shoes for Batu Caves',
    category: 'clothing',
    is_completed: true,
    assigned_to: 'user-bintang',
    created_by: 'user-bintang',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-bintang']
  },
  {
    id: 'pack-9',
    trip_id: INITIAL_TRIP.id,
    title: 'Personal Travel First Aid & Motion Pills',
    category: 'health',
    is_completed: true,
    assigned_to: 'user-fathun',
    created_by: 'user-fathun',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'pack-10',
    trip_id: INITIAL_TRIP.id,
    title: 'Overseas Debit Card Enabled + Ringgit Cash',
    category: 'finance',
    is_completed: true,
    assigned_to: 'user-riyan',
    created_by: 'user-riyan',
    created_at: new Date().toISOString(),
    assigned_profile: DEFAULT_PROFILES['user-riyan']
  }
];

export const INITIAL_NOTES: GroupNote[] = [
  {
    id: 'note-1',
    trip_id: INITIAL_TRIP.id,
    author_id: 'user-bintang',
    content: "Loving the vibe of this trip plan. Let's goooow! Remember to bring sunscreen and comfortable sneakers for the Batu Caves climb!",
    is_pinned: true,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    author_profile: DEFAULT_PROFILES['user-bintang']
  },
  {
    id: 'note-2',
    trip_id: INITIAL_TRIP.id,
    author_id: 'user-fathun',
    content: "Pro-tip: We can use BCA debit card directly at Maybank ATMs in KLIA2 for clean cash withdrawal without shady money changer fees.",
    is_pinned: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    author_profile: DEFAULT_PROFILES['user-fathun']
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    trip_id: INITIAL_TRIP.id,
    actor_id: 'user-riyan',
    action: 'Created group trip "Malaysia Getaway"',
    entity_type: 'trip',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    actor_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'act-2',
    trip_id: INITIAL_TRIP.id,
    actor_id: 'user-riyan',
    action: 'Set savings target to Rp15.000.000',
    entity_type: 'budget',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    actor_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'act-3',
    trip_id: INITIAL_TRIP.id,
    actor_id: 'user-riyan',
    action: 'Verified contribution of Rp2.000.000 from RIYAN ARYA SYAHPUTRA',
    entity_type: 'contribution',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    actor_profile: DEFAULT_PROFILES['user-riyan']
  },
  {
    id: 'act-4',
    trip_id: INITIAL_TRIP.id,
    actor_id: 'user-fathun',
    action: 'Verified contribution of Rp1.500.000 from FATHUN MUNAJAN',
    entity_type: 'contribution',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    actor_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'act-5',
    trip_id: INITIAL_TRIP.id,
    actor_id: 'user-fathun',
    action: 'Recorded expense Rp500.000 for Apartment booking deposit',
    entity_type: 'expense',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    actor_profile: DEFAULT_PROFILES['user-fathun']
  },
  {
    id: 'act-6',
    trip_id: INITIAL_TRIP.id,
    actor_id: 'user-bintang',
    action: 'Submitted pending contribution of Rp1.000.000',
    entity_type: 'contribution',
    created_at: new Date().toISOString(),
    actor_profile: DEFAULT_PROFILES['user-bintang']
  }
];

export interface AppState {
  trip: Trip;
  otherTrips: Trip[];
  members: TripMember[];
  budget: Budget;
  budgetHistory: Array<{ date: string; amount: number; note: string; updatedBy: string }>;
  categories: BudgetCategory[];
  contributions: Contribution[];
  expenses: Expense[];
  itinerary: ItineraryItem[];
  destinations: Destination[];
  packing: PackingItem[];
  notes: GroupNote[];
  activityLogs: ActivityLog[];
}

// Local Storage Helper
export function getSavedState(): AppState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}_data`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading saved 4G Trip state:', err);
  }

  // Return default seed state
  const defaultState: AppState = {
    trip: INITIAL_TRIP,
    otherTrips: [
      {
        id: 'trip-penang-food',
        name: 'Penang Food Trip',
        origin: 'Banda Aceh',
        destination: 'George Town, Penang',
        departure_date: null,
        return_date: null,
        status: 'draft',
        cover_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80',
        owner_id: 'user-riyan',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'trip-langkawi-adventure',
        name: 'Langkawi Adventure',
        origin: 'Banda Aceh',
        destination: 'Langkawi Island',
        departure_date: null,
        return_date: null,
        status: 'draft',
        cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        owner_id: 'user-riyan',
        created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    members: INITIAL_MEMBERS,
    budget: INITIAL_BUDGET,
    budgetHistory: [
      {
        date: new Date(Date.now() - 10 * 86400000).toISOString(),
        amount: 15000000,
        note: 'Initial budget target for 4D3N trip',
        updatedBy: 'RIYAN ARYA SYAHPUTRA'
      }
    ],
    categories: INITIAL_CATEGORIES,
    contributions: INITIAL_CONTRIBUTIONS,
    expenses: INITIAL_EXPENSES,
    itinerary: INITIAL_ITINERARY,
    destinations: INITIAL_DESTINATIONS,
    packing: INITIAL_PACKING,
    notes: INITIAL_NOTES,
    activityLogs: INITIAL_ACTIVITY_LOGS
  };

  saveState(defaultState);
  return defaultState;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_data`, JSON.stringify(state));
  } catch (err) {
    console.error('Error persisting 4G Trip state:', err);
  }
}
