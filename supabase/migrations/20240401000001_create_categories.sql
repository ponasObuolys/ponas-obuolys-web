-- Create categories table
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    slug text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create post_categories junction table
create table if not exists public.post_categories (
    post_id uuid references public.posts(id) on delete cascade,
    category_id uuid references public.categories(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (post_id, category_id)
);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.post_categories enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.categories
    for select using (true);

create policy "Enable read access for all users" on public.post_categories
    for select using (true);

-- Create some default categories
insert into public.categories (name, slug, description) values
    ('Naujienos', 'naujienos', 'Bendros naujienos ir pranešimai'),
    ('Receptai', 'receptai', 'Receptai ir kulinariniai patarimai'),
    ('Patarimai', 'patarimai', 'Naudingi patarimai ir gudrybės'),
    ('Technologijos', 'technologijos', 'Technologijų naujienos ir apžvalgos')
on conflict do nothing;

-- Create trigger for categories updated_at
create trigger set_categories_updated_at
    before update on public.categories
    for each row
    execute function public.handle_updated_at(); 