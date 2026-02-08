-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
-- Links to Supabase Auth
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'staff')) default 'staff',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- CUSTOMERS
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text,
  phone text,
  status text check (status in ('active', 'inactive')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS (Kanban Items)
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  client_id uuid references public.customers(id),
  status text check (status in ('new_requests', 'in_progress', 'review', 'completed')) default 'new_requests',
  priority text check (priority in ('normal', 'urgent')) default 'normal',
  due_date timestamp with time zone,
  tags text[], -- Array of strings e.g. ['SEO', 'Design']
  assigned_to uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Simple: Public Read/Write for demo, locking down usually happens later)
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);

create policy "Enable read access for all users" on customers for select using (true);
create policy "Enable insert for authenticated users only" on customers for insert with check (auth.role() = 'authenticated');

create policy "Enable read access for all users" on orders for select using (true);
create policy "Enable insert for authenticated users only" on orders for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on orders for update using (auth.role() = 'authenticated');
