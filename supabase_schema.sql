-- Schema for 2history Supabase Integration

-- 1. Create table for Teacher Rooms
CREATE TABLE public.teacher_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    room_code TEXT UNIQUE NOT NULL,
    room_name TEXT NOT NULL,
    creator_id UUID -- Reference to auth.users if auth is used, otherwise can be tracked via localStorage anonymous ID
);

-- 2. Create table for Questions linked to a Teacher Room
CREATE TABLE public.room_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    room_id UUID REFERENCES public.teacher_rooms(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    answer_correct TEXT NOT NULL,
    answer_wrong1 TEXT NOT NULL,
    answer_wrong2 TEXT NOT NULL,
    answer_wrong3 TEXT NOT NULL,
    explanation TEXT
);

-- 3. Create table for Leaderboards (Scores)
CREATE TABLE public.leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    room_id UUID REFERENCES public.teacher_rooms(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    play_time_seconds INTEGER NOT NULL,
    captured_territories INTEGER NOT NULL
);

-- Optional: Enable Row Level Security (RLS) if you want to restrict access
-- For a simple implementation, you can make these tables readable/writable by anyone (Anon).
-- Run these commands to allow anonymous access (only if RLS is enabled):

ALTER TABLE public.teacher_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.teacher_rooms FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.teacher_rooms FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.room_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.room_questions FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.leaderboards FOR INSERT WITH CHECK (true);

-- 4. Create table for Platform-wide Global Statistics
CREATE TABLE public.global_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_games INTEGER DEFAULT 0,
    total_territories INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0
);

-- Initialize with one row
INSERT INTO public.global_stats (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 5. Create table for Player Statistics (anonymous)
CREATE TABLE public.player_stats (
    player_id UUID PRIMARY KEY,
    total_games INTEGER DEFAULT 0,
    total_territories INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.global_stats FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON public.global_stats FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.player_stats FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.player_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.player_stats FOR UPDATE USING (true);

-- 6. Function to atomically increment global and player stats
CREATE OR REPLACE FUNCTION increment_game_stats(
    p_player_id UUID,
    p_games INTEGER,
    p_territories INTEGER,
    p_questions INTEGER,
    p_correct INTEGER,
    p_score INTEGER
) RETURNS void AS $$
BEGIN
    -- Update or insert player stats
    INSERT INTO public.player_stats (player_id, total_games, total_territories, total_questions, correct_answers, total_score)
    VALUES (p_player_id, p_games, p_territories, p_questions, p_correct, p_score)
    ON CONFLICT (player_id) DO UPDATE SET
        total_games = player_stats.total_games + p_games,
        total_territories = player_stats.total_territories + p_territories,
        total_questions = player_stats.total_questions + p_questions,
        correct_answers = player_stats.correct_answers + p_correct,
        total_score = player_stats.total_score + p_score,
        updated_at = NOW();

    -- Update global stats (id = 1)
    UPDATE public.global_stats SET
        total_games = global_stats.total_games + p_games,
        total_territories = global_stats.total_territories + p_territories,
        total_questions = global_stats.total_questions + p_questions,
        correct_answers = global_stats.correct_answers + p_correct;
END;
$$ LANGUAGE plpgsql;
