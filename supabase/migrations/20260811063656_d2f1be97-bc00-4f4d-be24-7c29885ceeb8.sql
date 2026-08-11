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
  handle text,
  avatar_url text,
  body text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'approved',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.post_comments TO anon;
GRANT SELECT, INSERT ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved comments" ON public.post_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can submit a comment" ON public.post_comments FOR INSERT WITH CHECK (status IN ('pending','approved'));
CREATE INDEX post_comments_slug_created_idx ON public.post_comments (post_slug, created_at DESC);
CREATE INDEX post_comments_status_created_idx ON public.post_comments (status, created_at DESC);

CREATE TABLE public.comment_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid NOT NULL REFERENCES public.post_comments(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.comment_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.comment_likes TO authenticated;
GRANT ALL ON public.comment_likes TO service_role;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comment likes" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can add a comment like" ON public.comment_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove a comment like" ON public.comment_likes FOR DELETE USING (true);
CREATE UNIQUE INDEX comment_likes_unique_idx ON public.comment_likes (comment_id, visitor_id);
CREATE INDEX comment_likes_visitor_idx ON public.comment_likes (visitor_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;