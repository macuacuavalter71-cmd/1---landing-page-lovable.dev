CREATE TABLE public.post_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_slug, visitor_id)
);

GRANT SELECT, INSERT, DELETE ON public.post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can add a like" ON public.post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove a like" ON public.post_likes FOR DELETE USING (true);

CREATE TABLE public.post_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug text NOT NULL,
  author_name text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.post_comments TO anon;
GRANT SELECT, INSERT ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved comments" ON public.post_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can submit a pending comment" ON public.post_comments FOR INSERT WITH CHECK (status = 'pending');

CREATE INDEX post_comments_slug_created_idx ON public.post_comments (post_slug, created_at DESC);