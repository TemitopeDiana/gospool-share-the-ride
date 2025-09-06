-- Update existing donations to be non-anonymous by default
-- Only admin can control anonymity from now on

UPDATE donations 
SET is_anonymous = false
WHERE is_anonymous = true;

-- Add a comment to clarify the new behavior
COMMENT ON COLUMN donations.is_anonymous IS 'Whether the donor name should be displayed as Anonymous (controlled by admin only)';
COMMENT ON COLUMN donations.show_publicly IS 'Whether this donation should be displayed in public recent donors lists (user choice during donation)';
