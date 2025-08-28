-- Volunteer Applications Table
create table if not exists volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  email text not null,
  phone text,
  preferred_areas text,
  applied_date timestamptz not null default now(),
  resume_url text,
  status text default 'pending',
  verified_by text,
  verified_at timestamptz
);

-- Storage bucket for resumes
insert into storage.buckets (id, name, public)
values ('volunteer-resumes', 'volunteer-resumes', false)
on conflict (id) do nothing;
