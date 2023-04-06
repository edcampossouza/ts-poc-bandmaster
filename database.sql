create table musician (
    id serial primary key,
    name text not null,
    email text not null,
    password text not null,
    date_of_birth date not null
);

create table band(
    id serial primary key,
    name text not null unique,
    founder_id integer not null references musician(id),
    date_of_foundation date not null,
    city text not null,
    style text not null
);

create table musician_skill(
    id serial primary key,
    musician_id integer not null references musician(id),
    skill text not null
);

create table musician_band(
    id serial primary key,
    musician_id integer not null references musician(id),
    band_id integer not null references band(id),
    invited_at timestamp not null default now(),
    accepted_at timestamp default null,
    unique(musician_id, band_id)
);