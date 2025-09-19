-- Add external_links field to news table for storing related media platform links
ALTER TABLE news ADD COLUMN external_links JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN news.external_links IS 'Array of external links where the news is featured on other media platforms. Format: [{"platform": "string", "url": "string", "title": "string"}]';