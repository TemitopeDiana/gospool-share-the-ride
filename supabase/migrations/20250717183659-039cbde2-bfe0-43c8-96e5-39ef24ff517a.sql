-- Add church_denomination column to team_members table
ALTER TABLE public.team_members 
ADD COLUMN church_denomination text;

-- Add church_denomination column to board_advisors table
ALTER TABLE public.board_advisors 
ADD COLUMN church_denomination text;