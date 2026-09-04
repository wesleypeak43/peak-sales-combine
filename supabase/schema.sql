-- Peak Sales Combine — database schema, security rules, and starter staff.
-- Paste the WHOLE file into Supabase → SQL Editor → Run. Safe to run more than once.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  short text not null,
  title text not null default '',
  roles text[] not null default '{}',
  active boolean not null default true,
  status text not null default 'Invited',
  created_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  role text not null,
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  invite_sent_at timestamptz,
  invite_expires_at timestamptz not null default now() + interval '3 days',
  opened_at timestamptz,
  resend_requested_at timestamptz,
  progress jsonb not null default '{}'::jsonb,
  report jsonb,
  scored_at timestamptz,
  archived boolean not null default false,
  created_by uuid references public.staff(id),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  reviewer_id uuid references public.staff(id),
  ratings jsonb not null default '{}'::jsonb,
  level text not null default '',
  outcome text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  when_txt text not null,
  e1 uuid references public.staff(id),
  e2 uuid references public.staff(id),
  link text not null default '',
  ver text not null default 'v1.2',
  status text not null default 'Invites sent',
  created_by uuid references public.staff(id),
  created_at timestamptz not null default now()
);

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  evaluator_id uuid not null references public.staff(id),
  r1 jsonb not null default '{}'::jsonb,
  r2 jsonb not null default '{}'::jsonb,
  coach text not null default '',
  notes text not null default '',
  cite text not null default '',
  rec text,
  obj_used jsonb not null default '{}'::jsonb,
  coi boolean not null default false,
  submitted_at timestamptz not null default now(),
  unique (candidate_id, evaluator_id)
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  evaluator_id uuid not null references public.staff(id),
  scores jsonb not null default '{}'::jsonb,
  notes text not null default '',
  submitted_at timestamptz not null default now(),
  unique (candidate_id, evaluator_id)
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  decided_by uuid references public.staff(id),
  by_label text not null default '',
  decision text not null,
  rationale text not null default '',
  agree text not null default '—',
  created_at timestamptz not null default now()
);

create table if not exists public.accommodations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  status text not null default 'Open',
  resolution text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The reason text lives apart from the status so evaluators can see "accommodation in place" without the reason.
create table if not exists public.accommodation_details (
  accommodation_id uuid primary key references public.accommodations(id) on delete cascade,
  txt text not null default ''
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.staff(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.outcomes (
  id uuid primary key default gen_random_uuid(),
  hire_name text not null,
  period text not null,
  vals jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.staff(id),
  updated_at timestamptz not null default now(),
  unique (hire_name, period)
);

create table if not exists public.audit (
  id bigserial primary key,
  at timestamptz not null default now(),
  who text not null default 'System',
  what text not null
);

-- ---------- who is asking? ----------
create or replace function public.current_staff_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.staff
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and active
  limit 1
$$;

create or replace function public.has_role(r text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.staff
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')) and active and r = any(roles)
  )
$$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select public.current_staff_id() is not null
$$;

create or replace function public.is_pipeline_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_role('manager') or public.has_role('admin') or public.has_role('leadership')
$$;

create or replace function public.can_manage() returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_role('manager') or public.has_role('admin')
$$;

create or replace function public.assigned_to_me(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.sessions s
    where s.candidate_id = cid and (s.e1 = public.current_staff_id() or s.e2 = public.current_staff_id())
  )
$$;

create or replace function public.has_submitted_eval(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.evaluations e where e.candidate_id = cid and e.evaluator_id = public.current_staff_id())
$$;

create or replace function public.has_submitted_interview(cid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.interviews i where i.candidate_id = cid and i.evaluator_id = public.current_staff_id())
$$;

-- ---------- row-level security ----------
alter table public.staff enable row level security;
alter table public.candidates enable row level security;
alter table public.reviews enable row level security;
alter table public.sessions enable row level security;
alter table public.evaluations enable row level security;
alter table public.interviews enable row level security;
alter table public.decisions enable row level security;
alter table public.accommodations enable row level security;
alter table public.accommodation_details enable row level security;
alter table public.settings enable row level security;
alter table public.outcomes enable row level security;
alter table public.audit enable row level security;

drop policy if exists staff_select on public.staff;
drop policy if exists staff_admin_all on public.staff;
create policy staff_select on public.staff for select to authenticated using (public.is_staff());
create policy staff_admin_all on public.staff for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

drop policy if exists cand_select on public.candidates;
drop policy if exists cand_insert on public.candidates;
drop policy if exists cand_update on public.candidates;
drop policy if exists cand_delete on public.candidates;
create policy cand_select on public.candidates for select to authenticated using (public.is_pipeline_staff() or public.assigned_to_me(id));
create policy cand_insert on public.candidates for insert to authenticated with check (public.can_manage());
create policy cand_update on public.candidates for update to authenticated using (public.can_manage()) with check (public.can_manage());
create policy cand_delete on public.candidates for delete to authenticated using (public.has_role('admin'));

drop policy if exists rev_select on public.reviews;
drop policy if exists rev_insert on public.reviews;
create policy rev_select on public.reviews for select to authenticated using (public.is_pipeline_staff() or public.assigned_to_me(candidate_id));
create policy rev_insert on public.reviews for insert to authenticated with check (public.can_manage());

drop policy if exists ses_select on public.sessions;
drop policy if exists ses_write on public.sessions;
create policy ses_select on public.sessions for select to authenticated using (public.is_pipeline_staff() or e1 = public.current_staff_id() or e2 = public.current_staff_id());
create policy ses_write on public.sessions for all to authenticated using (public.can_manage()) with check (public.can_manage());

drop policy if exists ev_select on public.evaluations;
drop policy if exists ev_insert on public.evaluations;
drop policy if exists ev_update on public.evaluations;
create policy ev_select on public.evaluations for select to authenticated using (
  public.is_pipeline_staff() or evaluator_id = public.current_staff_id()
  or (public.assigned_to_me(candidate_id) and public.has_submitted_eval(candidate_id))
);
create policy ev_insert on public.evaluations for insert to authenticated with check (evaluator_id = public.current_staff_id());
create policy ev_update on public.evaluations for update to authenticated using (evaluator_id = public.current_staff_id()) with check (evaluator_id = public.current_staff_id());

drop policy if exists iv_select on public.interviews;
drop policy if exists iv_insert on public.interviews;
drop policy if exists iv_update on public.interviews;
create policy iv_select on public.interviews for select to authenticated using (
  public.is_pipeline_staff() or evaluator_id = public.current_staff_id()
  or (public.assigned_to_me(candidate_id) and public.has_submitted_interview(candidate_id))
);
create policy iv_insert on public.interviews for insert to authenticated with check (evaluator_id = public.current_staff_id());
create policy iv_update on public.interviews for update to authenticated using (evaluator_id = public.current_staff_id()) with check (evaluator_id = public.current_staff_id());

drop policy if exists dec_select on public.decisions;
drop policy if exists dec_insert on public.decisions;
create policy dec_select on public.decisions for select to authenticated using (public.is_pipeline_staff());
create policy dec_insert on public.decisions for insert to authenticated with check (public.can_manage());

drop policy if exists acc_select on public.accommodations;
drop policy if exists acc_write on public.accommodations;
create policy acc_select on public.accommodations for select to authenticated using (public.is_pipeline_staff() or public.assigned_to_me(candidate_id));
create policy acc_write on public.accommodations for all to authenticated using (public.can_manage()) with check (public.can_manage());

drop policy if exists accd_select on public.accommodation_details;
create policy accd_select on public.accommodation_details for select to authenticated using (public.can_manage());

drop policy if exists set_select on public.settings;
drop policy if exists set_write on public.settings;
create policy set_select on public.settings for select to authenticated using (public.is_staff());
create policy set_write on public.settings for all to authenticated using (public.has_role('admin') or public.has_role('leadership')) with check (public.has_role('admin') or public.has_role('leadership'));

drop policy if exists out_select on public.outcomes;
drop policy if exists out_write on public.outcomes;
create policy out_select on public.outcomes for select to authenticated using (public.is_pipeline_staff());
create policy out_write on public.outcomes for all to authenticated using (public.can_manage()) with check (public.can_manage());

drop policy if exists audit_select on public.audit;
drop policy if exists audit_insert on public.audit;
create policy audit_select on public.audit for select to authenticated using (public.has_role('admin') or public.has_role('leadership'));
create policy audit_insert on public.audit for insert to authenticated with check (public.is_staff());

-- ---------- candidate access (by personal link token; no login) ----------
create or replace function public.candidate_open(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  c public.candidates;
  s public.sessions;
  a public.accommodations;
  d public.decisions;
  r public.reviews;
  n_evals int;
begin
  select * into c from public.candidates where token = p_token and not archived;
  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;
  if c.invite_expires_at < now() then
    return jsonb_build_object('status', 'expired',
      'email', left(c.email, 1) || '•••' || substring(c.email from position('@' in c.email)));
  end if;
  if c.opened_at is null then
    update public.candidates set opened_at = now() where id = c.id;
  end if;
  select * into s from public.sessions where candidate_id = c.id order by created_at desc limit 1;
  select * into a from public.accommodations where candidate_id = c.id order by created_at desc limit 1;
  select * into d from public.decisions where candidate_id = c.id order by created_at desc limit 1;
  select * into r from public.reviews where candidate_id = c.id order by created_at desc limit 1;
  select count(*) into n_evals from public.evaluations where candidate_id = c.id;
  return jsonb_build_object(
    'status', 'ok',
    'candidate', jsonb_build_object('id', c.id, 'name', c.name, 'email', c.email, 'role', c.role, 'expires_at', c.invite_expires_at),
    'progress', c.progress,
    'session', case when s.id is null then null else jsonb_build_object('when', s.when_txt, 'link', s.link) end,
    'accommodation', case when a.id is null then null else jsonb_build_object('status', a.status, 'resolution', a.resolution) end,
    'decision', case when d.id is null then null else d.decision end,
    'review', case when r.id is null then null else r.outcome end,
    'evaluations', n_evals
  );
end $$;

create or replace function public.candidate_save(p_token text, p_patch jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  c public.candidates;
  aid uuid;
  reason text;
begin
  select * into c from public.candidates where token = p_token and not archived;
  if not found then
    return jsonb_build_object('status', 'invalid');
  end if;
  update public.candidates set progress = progress || coalesce(p_patch, '{}'::jsonb) where id = c.id;
  if coalesce((p_patch ->> 'accomSent')::boolean, false)
     and not exists (select 1 from public.accommodations where candidate_id = c.id and status = 'Open') then
    reason := coalesce(nullif(trim(coalesce(p_patch ->> 'accomTxt', c.progress ->> 'accomTxt')), ''), '(no detail provided)');
    insert into public.accommodations (candidate_id) values (c.id) returning id into aid;
    insert into public.accommodation_details (accommodation_id, txt) values (aid, reason);
    insert into public.audit (who, what) values ('System', 'Accommodation request received — ' || c.name);
  end if;
  if coalesce((p_patch ->> 'withdrawn')::boolean, false) and not coalesce((c.progress ->> 'withdrawn')::boolean, false) then
    insert into public.audit (who, what) values ('System', 'Candidate withdrew — ' || c.name);
  end if;
  return jsonb_build_object('status', 'ok');
end $$;

grant execute on function public.candidate_open(text) to anon, authenticated;
grant execute on function public.candidate_save(text, jsonb) to anon, authenticated;

-- ---------- bookkeeping triggers ----------
create or replace function public.handle_auth_signin() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.staff set status = 'Active' where lower(email) = lower(new.email) and status <> 'Active';
  return new;
end $$;
drop trigger if exists on_auth_user_signin on auth.users;
create trigger on_auth_user_signin after update of last_sign_in_at on auth.users
  for each row execute function public.handle_auth_signin();

create or replace function public.audit_row() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  who text;
  what text;
  cname text;
begin
  select name into cname from public.candidates where id = new.candidate_id;
  if tg_table_name = 'decisions' then
    who := new.by_label; what := 'Recorded decision: ' || new.decision || ' — ' || coalesce(cname, '');
  elsif tg_table_name = 'sessions' then
    select short into who from public.staff where id = new.created_by;
    what := 'Scheduled combine — ' || coalesce(cname, '') || ' · ' || new.when_txt;
  elsif tg_table_name = 'reviews' then
    select short into who from public.staff where id = new.reviewer_id;
    what := 'Reviewed application — ' || coalesce(cname, '') || ' · ' || new.outcome;
  elsif tg_table_name = 'evaluations' then
    select short into who from public.staff where id = new.evaluator_id;
    what := 'Submitted combine scores — ' || coalesce(cname, '') || ' (independent, pre-reveal)';
  elsif tg_table_name = 'interviews' then
    select short into who from public.staff where id = new.evaluator_id;
    what := 'Submitted interview scores — ' || coalesce(cname, '');
  end if;
  insert into public.audit (who, what) values (coalesce(who, 'Staff'), coalesce(what, tg_table_name));
  return new;
end $$;

drop trigger if exists audit_decisions on public.decisions;
drop trigger if exists audit_sessions on public.sessions;
drop trigger if exists audit_reviews on public.reviews;
drop trigger if exists audit_evaluations on public.evaluations;
drop trigger if exists audit_interviews on public.interviews;
create trigger audit_decisions after insert on public.decisions for each row execute function public.audit_row();
create trigger audit_sessions after insert on public.sessions for each row execute function public.audit_row();
create trigger audit_reviews after insert on public.reviews for each row execute function public.audit_row();
create trigger audit_evaluations after insert on public.evaluations for each row execute function public.audit_row();
create trigger audit_interviews after insert on public.interviews for each row execute function public.audit_row();

-- ---------- live updates between staff browsers ----------
do $$
declare t text;
begin
  foreach t in array array['candidates','reviews','sessions','evaluations','interviews','decisions','accommodations','settings','staff','outcomes','audit']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when others then null;
    end;
  end loop;
end $$;

-- ---------- starter staff (edit names/roles here or later in the app) ----------
insert into public.staff (email, name, short, title, roles) values
  ('wesley@peaksportsmgmt.com',  'Wesley Abercrombie', 'W. Abercrombie', 'Peak Sports MGMT', array['admin','manager','evaluator']),
  ('greyson@peaksportsmgmt.com', 'Greyson Allen',      'G. Allen',       'Peak Sports MGMT', array['manager','evaluator']),
  ('max@peaksportsmgmt.com',     'Max Viladevall',     'M. Viladevall',  'Peak Sports MGMT', array['manager','evaluator'])
on conflict (email) do nothing;
