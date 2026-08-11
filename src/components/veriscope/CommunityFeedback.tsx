import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";
import { Diamond } from "./Diamond";
import { getCommentPage, TOTAL_COMMENTS, type DemoComment } from "@/data/community-comments";
import { MAX_AGE_SECONDS, MIN_AGE_SECONDS, exactLabel, relativeLabel, timeBucket } from "@/lib/relative-time";

const POST_SLUG = "veriscope-session-matrix";
const VISITOR_STORAGE_KEY = "veriscope:visitor-id";
const PAGE_SIZE = 24;

/** Prototype baseline figures for the community preview. */
const BASE_LIKES = 267_000;
const BASE_COMMENTS = 92_000;

type RealComment = {
  id: string;
  author: string;
  handle: string;
  body: string;
  likes: number;
  createdAt: number;
  avatarUrl?: string | undefined;
};

type FeedItem = {
  key: string;
  realId?: string | undefined;
  author: string;
  handle: string;
  body: string;
  likes: number;
  ageSeconds: number;
  avatarUrl?: string | undefined;
};

function getVisitorId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, id);
  }
  return id;
}

/** Compact counter: 92000 → 92k, 99999 → 100k, 1000000 → 1M. */
function compact(value: number) {
  const round = (n: number) => (n >= 100 ? Math.round(n) : Math.round(n * 10) / 10);
  if (value >= 1_000_000) {
    const m = round(value / 1_000_000);
    return `${m}M`;
  }
  if (value >= 1000) {
    const k = round(value / 1000);
    return k >= 1000 ? `${round(k / 1000)}M` : `${k}k`;
  }
  return String(value);
}

type CommentRow = {
  id: string;
  author_name: string;
  handle: string | null;
  avatar_url: string | null;
  body: string;
  likes_count: number | null;
  created_at: string;
};

function toReal(row: CommentRow): RealComment {
  return {
    id: row.id,
    author: row.author_name,
    handle: row.handle ?? `@${row.author_name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    body: row.body,
    likes: row.likes_count ?? 0,
    createdAt: new Date(row.created_at).getTime(),
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export function CommunityFeedback() {
  const [likeCount, setLikeCount] = useState(BASE_LIKES);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);

  const [demoPosts, setDemoPosts] = useState<DemoComment[]>(() => getCommentPage(0, PAGE_SIZE));
  const [realPosts, setRealPosts] = useState<RealComment[]>([]);
  const [realTotal, setRealTotal] = useState(0);
  const pageRef = useRef(1);
  const [page, setPage] = useState(1);

  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "error">("idle");

  const [now, setNow] = useState(() => Date.now());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  /* live clock — relative timestamps refresh without reloading the page */
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const loadRealComments = useCallback(async () => {
    const since = new Date(Date.now() - MAX_AGE_SECONDS * 1000).toISOString();
    const { data, count } = await supabase
      .from("post_comments")
      .select("id, author_name, handle, avatar_url, body, likes_count, created_at", {
        count: "exact",
      })
      .eq("post_slug", POST_SLUG)
      .eq("status", "approved")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(200);
    setRealPosts((data ?? []).map((row) => toReal(row as CommentRow)));
    setRealTotal(count ?? 0);
  }, []);

  /* backend is the single source of truth for likes and comments */
  useEffect(() => {
    const visitorId = getVisitorId();
    void (async () => {
      const [{ count }, mine, likedRows] = await Promise.all([
        supabase
          .from("post_likes")
          .select("id", { count: "exact", head: true })
          .eq("post_slug", POST_SLUG),
        supabase
          .from("post_likes")
          .select("id")
          .eq("post_slug", POST_SLUG)
          .eq("visitor_id", visitorId)
          .maybeSingle(),
        supabase.from("comment_likes").select("comment_id").eq("visitor_id", visitorId),
      ]);
      setLikeCount(BASE_LIKES + (count ?? 0));
      setLiked(Boolean(mine.data));
      const map: Record<string, boolean> = {};
      for (const row of likedRows.data ?? []) map[row.comment_id] = true;
      setLikedComments(map);
    })();
    void loadRealComments();
  }, [loadRealComments]);

  /* new comments from anyone arrive without a refresh */
  useEffect(() => {
    const channel = supabase
      .channel("community-comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_comments" },
        (payload) => {
          const row = payload.new as CommentRow & { post_slug: string; status: string };
          if (row.post_slug !== POST_SLUG || row.status !== "approved") return;
          setRealPosts((current) =>
            current.some((post) => post.id === row.id) ? current : [toReal(row), ...current],
          );
          setRealTotal((total) => total + 1);
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const hasMore = page * PAGE_SIZE < TOTAL_COMMENTS;

  const loadMore = useCallback(() => {
    const current = pageRef.current;
    const next = getCommentPage(current, PAGE_SIZE);
    if (!next.length) return;
    pageRef.current = current + 1;
    setDemoPosts((all) => {
      const seen = new Set(all.map((post) => post.id));
      const fresh = next.filter((post) => !seen.has(post.id));
      return fresh.length ? [...all, ...fresh] : all;
    });
    setPage(current + 1);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, demoPosts.length, loadMore]);

  /* chronological merge: newest first, nothing older than 24h */
  const items = useMemo<FeedItem[]>(() => {
    const real: FeedItem[] = realPosts
      .map((post) => ({
        key: post.id,
        realId: post.id,
        author: post.author,
        handle: post.handle,
        body: post.body,
        likes: post.likes,
        ageSeconds: Math.max(0, Math.floor((now - post.createdAt) / 1000)),
        avatarUrl: post.avatarUrl,
      }))
      .filter((post) => post.ageSeconds <= MAX_AGE_SECONDS);
    const demo: FeedItem[] = demoPosts.map((post) => ({
      key: post.id,
      author: post.author,
      handle: post.handle,
      body: post.body,
      likes: post.likes,
      ageSeconds: post.ageSeconds,
    }));
    return [...real, ...demo].sort((a, b) => a.ageSeconds - b.ageSeconds);
  }, [realPosts, demoPosts, now]);

  async function toggleLike() {
    if (likePending) return;
    setLikePending(true);
    const visitorId = getVisitorId();
    const next = !liked;
    setLiked(next);
    setLikeCount((count) => (next ? count + 1 : Math.max(BASE_LIKES, count - 1)));
    const { error } = next
      ? await supabase.from("post_likes").insert({ post_slug: POST_SLUG, visitor_id: visitorId })
      : await supabase
          .from("post_likes")
          .delete()
          .eq("post_slug", POST_SLUG)
          .eq("visitor_id", visitorId);
    if (error) {
      setLiked(!next);
      setLikeCount((count) => (next ? Math.max(BASE_LIKES, count - 1) : count + 1));
    }
    setLikePending(false);
  }

  async function toggleCommentLike(item: FeedItem) {
    const isLiked = Boolean(likedComments[item.key]);
    setLikedComments((current) => ({ ...current, [item.key]: !isLiked }));
    setLocalLikes((current) => ({
      ...current,
      [item.key]: (current[item.key] ?? 0) + (isLiked ? -1 : 1),
    }));
    if (!item.realId) return;
    const visitorId = getVisitorId();
    const { error } = isLiked
      ? await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", item.realId)
          .eq("visitor_id", visitorId)
      : await supabase
          .from("comment_likes")
          .insert({ comment_id: item.realId, visitor_id: visitorId });
    if (error) {
      setLikedComments((current) => ({ ...current, [item.key]: isLiked }));
      setLocalLikes((current) => ({
        ...current,
        [item.key]: (current[item.key] ?? 0) + (isLiked ? 1 : -1),
      }));
    }
  }

  function pickFile(event: React.ChangeEvent<HTMLInputElement>, set: (url: string) => void) {
    const file = event.target.files?.[0];
    if (!file) return;
    set(URL.createObjectURL(file));
  }

  async function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitState("sending");

    const authorName = name.trim();
    const text = body.trim();
    const handle = `@${authorName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;

    const { data, error } = await supabase
      .from("post_comments")
      .insert({
        post_slug: POST_SLUG,
        author_name: authorName,
        handle,
        avatar_url: avatarUrl ?? null,
        body: text,
        status: "approved",
      })
      .select("id, author_name, handle, avatar_url, body, likes_count, created_at")
      .single();

    if (error || !data) {
      setSubmitState("error");
      return;
    }

    setRealPosts((current) => [toReal(data as CommentRow), ...current]);
    setRealTotal((total) => total + 1);
    setName("");
    setBody("");
    setAvatarUrl(undefined);
    setSubmitState("idle");
  }

  const commentTotal = BASE_COMMENTS + realTotal;

  let currentBucket = "";

  return (
    <section className="border-t border-border/60 py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Community</p>
            <span className="rounded-full border border-gold/30 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-gold">
              BETA PREVIEW
            </span>
          </div>
          <h2 className="display-md mt-4 text-balance">Feedback from the Veriscope Community</h2>
          <h3 className="mt-6 text-lg font-medium text-foreground sm:text-xl">
            O que acha do Veriscope Session Matrix?
          </h3>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Deixe o seu feedback
          </p>
        </Reveal>

        <Reveal className="panel mt-10 overflow-hidden">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary">
              <Diamond className="h-4 w-4 text-gold" />
            </span>
            <span className="min-w-0 truncate text-sm font-medium text-foreground">
              Session Matrix posts
            </span>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">Ongoing</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 p-3 sm:gap-x-4 sm:p-4">
            <button
              type="button"
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={liked ? "Remove your like" : "Like this post"}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                liked ? "text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HeartIcon filled={liked} />
              <span className="font-mono text-xs">{compact(likeCount)}</span>
            </button>

            <span className="inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <CommentIcon />
              <span className="font-mono text-xs">{compact(commentTotal)}</span>
            </span>
          </div>

          {/* composer */}
          <form onSubmit={submitComment} className="space-y-3 border-t border-border/60 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <label
                className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-border bg-secondary text-[10px] text-muted-foreground"
                title="Upload an avatar"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Your avatar preview" className="h-full w-full object-cover" />
                ) : (
                  "Avatar"
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => pickFile(event, setAvatarUrl)}
                />
              </label>
              <input
                aria-label="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={60}
                className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
                placeholder="Your name"
              />
            </div>

            <textarea
              aria-label="Your comment"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
              rows={3}
              maxLength={1200}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
              placeholder="Share how you're using it"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitState === "sending"}
                className="rounded-md border border-gold/40 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10 disabled:opacity-60"
              >
                {submitState === "sending" ? "Publishing…" : "Publish"}
              </button>
              {submitState === "error" ? (
                <span className="text-xs text-destructive">
                  Something went wrong. Please try again.
                </span>
              ) : null}
            </div>
          </form>

          {/* feed */}
          <div className="max-h-[36rem] overflow-y-auto border-t border-border/60">
            <ul className="divide-y divide-border/60">
              {items.map((item) => {
                const bucket = timeBucket(item.ageSeconds);
                const showBucket = bucket !== currentBucket;
                if (showBucket) currentBucket = bucket;
                const likes = item.likes + (localLikes[item.key] ?? 0);
                return (
                  <li key={item.key} className="p-4 sm:p-5">
                    {showBucket ? (
                      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                        {bucket}
                      </p>
                    ) : null}
                    <div className="flex gap-3">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-mono text-xs text-muted-foreground"
                        >
                          {item.author.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-sm text-foreground">{item.author}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {item.handle}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/70">
                            · {relativeLabel(item.ageSeconds)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                        <button
                          type="button"
                          onClick={() => void toggleCommentLike(item)}
                          aria-pressed={Boolean(likedComments[item.key])}
                          className={`mt-3 inline-flex items-center gap-2 text-xs transition-colors ${
                            likedComments[item.key]
                              ? "text-gold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <HeartIcon filled={Boolean(likedComments[item.key])} />
                          <span className="font-mono">{Math.max(0, likes)}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
              <li ref={sentinelRef as never} aria-hidden="true" />
            </ul>
          </div>

          {hasMore ? (
            <div className="border-t border-border/60 p-4 text-center">
              <button
                type="button"
                onClick={loadMore}
                className="rounded-md border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Load more
              </button>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5c0 5-7 9.5-7 9.5z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />
    </svg>
  );
}
