begin;

-- Ensure server-side service role can read the leaderboard view even if PUBLIC privileges are locked down.
grant select on public.leaderboard_public to service_role;

commit;


