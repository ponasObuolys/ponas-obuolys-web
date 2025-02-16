-- Create comments table
create table public.comments (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    post_slug text references public.posts(slug) on delete cascade not null
);

-- Set up RLS policies
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone."
    on comments for select
    using ( true );

create policy "Users can insert their own comments."
    on comments for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own comments."
    on comments for update
    using ( auth.uid() = user_id );

create policy "Users can delete own comments."
    on comments for delete
    using ( auth.uid() = user_id );

-- Create comments_with_user view for easier querying
create view comments_with_user as
    select 
        c.*,
        p.username,
        p.avatar_url
    from comments c
    left join profiles p on c.user_id = p.id;
