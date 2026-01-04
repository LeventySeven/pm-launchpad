-- Allow service_role to read market_comments_public (used by server-side queries to avoid RLS issues on users join).

grant select on public.market_comments_public to service_role;


