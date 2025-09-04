-- Add privacy setting for public display of donations
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS show_publicly boolean DEFAULT true;

-- Add comment explaining the privacy column
COMMENT ON COLUMN donations.show_publicly IS 'Whether this donation should be displayed in public recent donors lists (respects is_anonymous setting)';

-- Update existing donations to be publicly visible by default (unless anonymous)
UPDATE donations 
SET show_publicly = NOT is_anonymous 
WHERE show_publicly IS NULL;
