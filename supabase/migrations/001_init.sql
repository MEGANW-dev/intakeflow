-- ORGS (tenants) -----

create table orgs (
    id          uuid primary key default gen_randoom_uuid,
    slug        text unique not null,
    name        text not null, 
    industry    text,
    settings    json not null default '{}'::jsonb, 
    created_at  timestamptz not null default now()
);

-- MEMBERSHIPS (user -> org) --

create table memberships  (
    user_id     uuid references auth.users(id) on delete cascade,
    org_id      uuid references orgs(id) on delete cascade, 
    role        text not null default 'owner' check (role in ('owner', 'admin', 'viewer')),
    primary key (user_id, org_id)
);

-- LEADS--
create table leads (
    id          uuid primary key default gen_random_uuid(),
    org_id      uuid not null references orgs(id) on delete cascade,


--raw submission-- 

full_name       text not null,
email           text not null, 
phone           text,   
company         text,
service_wanted  text,
budget_stated   text,
timeline_stated text,
description     text not null, 
source          text default 'web_form',
raw_payload     jsonb not null default '{}'::jsonb, 

-- AI verdict -- 
fit_score       int check (fit_score between 1 and 10),
tier            text check (tier in ('qualified', 'nurture', 'disqualified')),
service_type    text,
urgency         text check (urgency in ('immediate', 'weeks', 'months', 'exploring')),
budget_band     text check (budget_band in('under_1k', '1k-5k', '5k-25k', '25k_plus', 'unknown')),
ai_summary      text,
ai_reasoning    text,
ai_flags        text[]default '{}',
ai_model        text, 

--pipeline-- 
status          text not null default 'received'
                check (status in ('received', 'classified', 'contacted'
                                 'booked', 'won', 'lost', 'error')),

processed_at    timestamptz,
created_at      timestamptz not null default now(),
updated_at      timestamptz not null default now()

);

create index leads_org_created on leads (org_id, created_at desc);
create index leads_org_score   on leads (org_id, fit_score desc nulls last);
create index leads_org_status  on leads (org_id, status);

--ARTIFACTS (proposals, checklists, emails)--

create table artifacts (
id              uuid primary key default gen_random_uuid(),
org_id          uuid not null references orgs(id) on delete cascade,
lead_id         uuid not null references leads(id) on delete cascade, 
kind            text not null check (kind in ('proposal', 'checklist', 'email_lead', 'email_owner')),
content_md      text not null, 
meta            jsonb not null default '{}'::jsonb, 
created_at      timestamptz not null default now()
);

--WORKFLOW RUNS (ROI evidence + debugger)--
create table workflow_runs (
id              uuid primary key default gen_random_uuid(),
org_id          uuid not null references orgs(id) on delete cascade,
lead_id         uuid references leads(id) on delete cascade,
step            text not null,
status          text not null check(status in ('success', 'failure', 'skipped')),
duration_ms     int,
tokens_in       int,
tokens_out      int,
cost_usd        numeric(10,6),
error           text,
attempt         int not null default 1,
created_at      timestamptz not null default now()
);

create index workflow_runs_org_created on workflow_runs (org_id, created_at desc);

--AUDIT TRAIL--
create table lead_events (
id              uuid primary key default gen_random_uuid(),
org_id          uuid not null references orgs(id) on delete cascade,
lead_id         uuid not null references leads(id) on delete cascade, 
actor           text not null,
event           text not null,
detail          jsonb not null default '{}'::jsonb,
created_at      timestamptz not null default now(),
);

 --RLS ENABLE ON EVERYTHING, POLICIES DEFFERD TO DAY 11--
-- Enabled with zero policies = default deny for the publishable key.
-- The secret key bypasses RLS, which is how the server action writes.
alter table orgs          enable row level security;
alter table memberships   enable row level security;
alter table leads         enable row level security;
alter table artifacts     enable row level security;
alter table workflow_runs enable row level security;
alter table lead_events   enable row level security;


