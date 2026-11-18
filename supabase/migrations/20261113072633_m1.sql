create table profiles(
    id uuid primary key references auth.users on delete cascade,
    income numeric(12,2) not null,
    email text not null,
    locale text,
    display_name text
);
create table events(
    id int primary key generated always as identity,
    host_id uuid references profiles on delete cascade,
    budget numeric(12,2) not null,
    expense numeric(12,2) not null,
    end_date date,
    title text not null
);
create table transactions(
    id int primary key generated always as identity,
    host_id uuid references profiles on delete cascade,
    event_id int references events,
    title text not null,
    expense numeric(12,2) not null,
    locale text,
    category text
);
create table participants(
    id int primary key generated always as identity,
    host_id uuid references profiles on delete cascade,
    display_name text,
    participant_id uuid references profiles,
    transaction_id int references transactions,
    owed numeric(12,2) not null,
    paid numeric(12,2) not null
);
create table friends(
    requester_id uuid references profiles on delete cascade,
    receiver_id uuid references profiles on delete cascade,
    accepted boolean not null default false,
    unique (requester_id,receiver_id),
    check (requester_id!=receiver_id)
);
alter table profiles enable row level security;
alter table events enable row level security;
alter table transactions enable row level security;
alter table participants enable row level security;
alter table friends enable row level security;
create policy "users can read own row" on profiles for select to authenticated using (id=(select auth.uid()));
create policy "users can edit own row" on profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy "hosts and participants can read events" on events for select to authenticated using (host_id=(select auth.uid()));
create policy "hosts can create own events" on events for insert to authenticated with check (host_id=(select auth.uid()));
create policy "hosts can edit own events" on events for update to authenticated using (host_id=(select auth.uid())) with check (host_id=(select auth.uid()));
create policy "hosts and participants can read participants" on participants for select to authenticated using (host_id=(select auth.uid()) or participant_id=(select auth.uid()));
create policy "hosts can add participants" on participants for insert to authenticated with check (host_id=(select auth.uid()));
create policy "hosts can edit participants" on participants for update to authenticated using (host_id=(select auth.uid())) with check (host_id=(select auth.uid()));
create policy "friend request recipients and accepted requesters can read friends" on friends for select to authenticated using(receiver_id=(select auth.uid()) or (requester_id=(select auth.uid()) and accepted=true));
create policy "friend requesters can add friends" on friends for insert to authenticated with check(requester_id=(select auth.uid()));
create policy "friend request recipients can edit friends" on friends for update to authenticated using(receiver_id=(select auth.uid())) with check(receiver_id=(select auth.uid()));
