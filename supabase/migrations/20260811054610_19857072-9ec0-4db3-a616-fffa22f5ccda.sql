CREATE INDEX IF NOT EXISTS post_comments_status_created_idx ON public.post_comments (status, created_at DESC);
CREATE INDEX IF NOT EXISTS post_comments_slug_created_idx ON public.post_comments (post_slug, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS comment_likes_unique_idx ON public.comment_likes (comment_id, visitor_id);
CREATE UNIQUE INDEX IF NOT EXISTS post_likes_unique_idx ON public.post_likes (post_slug, visitor_id);
CREATE INDEX IF NOT EXISTS comment_likes_visitor_idx ON public.comment_likes (visitor_id);
ALTER TABLE public.post_comments ALTER COLUMN status SET DEFAULT 'approved';