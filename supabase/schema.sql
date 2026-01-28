-- Groups Table
create table public.groups (
  id text primary key, -- Contract address or Group ID
  name text not null,
  description text,
  contribution_amount numeric not null, -- Stored as string/numeric for wei
  payout_cycle integer not null, -- In days or seconds
  treasury_balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Members Table
create table public.members (
  id uuid default gen_random_uuid() primary key,
  group_id text references public.groups(id) on delete cascade not null,
  address text not null,
  name text,
  status text default 'active', -- active, inactive
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_contribution timestamp with time zone,
  unique(group_id, address)
);

-- Contributions Table
create table public.contributions (
  id uuid default gen_random_uuid() primary key,
  group_id text references public.groups(id) on delete cascade not null,
  member_address text not null,
  amount numeric not null,
  round integer default 1,
  tx_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'confirmed' -- pending, confirmed
);

-- Payouts Table
create table public.payouts (
  id uuid default gen_random_uuid() primary key,
  group_id text references public.groups(id) on delete cascade not null,
  recipient_address text not null,
  amount numeric not null,
  round integer not null,
  tx_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'completed'
);

-- RLS Policies (Example - Open read, strict write)
alter table public.groups enable row level security;
alter table public.members enable row level security;
alter table public.contributions enable row level security;
alter table public.payouts enable row level security;

create policy "Enable read access for all users" on public.groups for select using (true);
create policy "Enable read access for all users" on public.members for select using (true);
create policy "Enable read access for all users" on public.contributions for select using (true);
create policy "Enable read access for all users" on public.payouts for select using (true);

-- For now, allowing insert/update to simple authenticated users or generic for demo purposes
-- Ideally, these would be controlled by a server-side function or signed messages
create policy "Enable insert for authenticated users" on public.groups for insert with check (true);
create policy "Enable insert for authenticated users" on public.members for insert with check (true);
create policy "Enable insert for authenticated users" on public.contributions for insert with check (true);
create policy "Enable insert for authenticated users" on public.payouts for insert with check (true);
