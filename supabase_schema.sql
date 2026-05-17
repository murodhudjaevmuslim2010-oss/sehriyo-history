-- Schema for 2history Supabase Integration (Full Cloud Logic)

-- 1. Create table for User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    class TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for User Statistics (aggregated totals)
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    total_games INTEGER DEFAULT 0,
    territories_captured INTEGER DEFAULT 0,
    correct_answers_percent FLOAT DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    -- Per-mode stats
    single_games INTEGER DEFAULT 0,
    single_score INTEGER DEFAULT 0,
    single_territories INTEGER DEFAULT 0,
    political_games INTEGER DEFAULT 0,
    political_score INTEGER DEFAULT 0,
    political_territories INTEGER DEFAULT 0,
    online_games INTEGER DEFAULT 0,
    online_score INTEGER DEFAULT 0,
    online_territories INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for Game Results (per-game records, used for leaderboards)
CREATE TABLE IF NOT EXISTS public.game_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    player_name TEXT NOT NULL,
    game_mode TEXT NOT NULL CHECK (game_mode IN ('single', 'political', 'online')),
    score INTEGER NOT NULL DEFAULT 0,
    territories_captured INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0
);

-- 4. Create table for Teacher Rooms
CREATE TABLE IF NOT EXISTS public.teacher_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    room_code TEXT UNIQUE NOT NULL,
    room_name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL
);

-- 5. Create table for Room Leaderboards (Player scores in rooms)
CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    room_id UUID REFERENCES public.teacher_rooms(id) ON DELETE CASCADE NOT NULL,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    play_time_seconds INTEGER NOT NULL,
    captured_territories INTEGER NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

-- 6. ACCESS POLICIES

-- Profiles: Users can manage ONLY their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Stats: Users can manage ONLY their own stats
CREATE POLICY "Users can view own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Game Results: Anyone can read (for leaderboards), only owner can insert their own
CREATE POLICY "Anyone can read game results" ON public.game_results FOR SELECT USING (true);
CREATE POLICY "Users can insert own results" ON public.game_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teacher Rooms: Anyone can view, only owners can manage
CREATE POLICY "Enable read access for all rooms" ON public.teacher_rooms FOR SELECT USING (true);
CREATE POLICY "Enable individual room management" ON public.teacher_rooms FOR ALL USING (auth.uid() = owner_id);

-- Leaderboards: Anyone can read and add (insert) scores
CREATE POLICY "Enable read access for all leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Enable score insertion for all" ON public.leaderboards FOR INSERT WITH CHECK (true);

-- 7. GLOBAL STATS (Optional, aggregated from user_stats)
CREATE TABLE IF NOT EXISTS public.global_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_games INTEGER DEFAULT 0,
    total_territories INTEGER DEFAULT 0,
    correct_answers_avg FLOAT DEFAULT 0
);
INSERT INTO public.global_stats (id) VALUES (1) ON CONFLICT DO NOTHING;
ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all" ON public.global_stats FOR SELECT USING (true);
