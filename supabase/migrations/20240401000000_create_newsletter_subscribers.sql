create table if not exists public.newsletter_subscribers (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.newsletter_subscribers enable row level security;

-- Create policies
create policy "Enable read access for all users" on public.newsletter_subscribers
    for select using (true);

create policy "Enable insert access for all users" on public.newsletter_subscribers
    for insert with check (true);

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_updated_at
    before update on public.newsletter_subscribers
    for each row
    execute function public.handle_updated_at(); 