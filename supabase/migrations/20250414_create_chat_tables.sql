
-- Create table for chat sessions
CREATE TABLE public.chat_sessions (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_contact TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unread_count INTEGER NOT NULL DEFAULT 0,
  source TEXT DEFAULT 'website',
  telegram_chat_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_type TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB
);

-- Add RLS policies
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (you may want to restrict this)
CREATE POLICY "Allow all operations on chat_sessions" ON public.chat_sessions FOR ALL TO PUBLIC USING (true);
CREATE POLICY "Allow all operations on chat_messages" ON public.chat_messages FOR ALL TO PUBLIC USING (true);

-- Add Realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
