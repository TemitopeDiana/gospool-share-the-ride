-- Add paused status and pause-related fields to projects table
-- First, let's see what status values are currently being used
-- ALTER TYPE would be used if status was an enum, but since it's text, we just need to ensure 'paused' is supported

-- Add pause-related columns to projects table
ALTER TABLE projects 
ADD COLUMN paused_at TIMESTAMPTZ NULL,
ADD COLUMN paused_by UUID NULL,
ADD COLUMN pause_reason TEXT NULL,
ADD COLUMN resumed_at TIMESTAMPTZ NULL,
ADD COLUMN resumed_by UUID NULL;

-- Add foreign key references for pause/resume tracking
ALTER TABLE projects
ADD CONSTRAINT projects_paused_by_fkey 
FOREIGN KEY (paused_by) REFERENCES auth.users(id),
ADD CONSTRAINT projects_resumed_by_fkey 
FOREIGN KEY (resumed_by) REFERENCES auth.users(id);

-- Create an index for efficient querying of paused projects
CREATE INDEX idx_projects_status_paused ON projects(status) WHERE status = 'paused';
CREATE INDEX idx_projects_paused_at ON projects(paused_at) WHERE paused_at IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN projects.paused_at IS 'Timestamp when the project was paused';
COMMENT ON COLUMN projects.paused_by IS 'User ID of who paused the project';
COMMENT ON COLUMN projects.pause_reason IS 'Reason provided for pausing the project';
COMMENT ON COLUMN projects.resumed_at IS 'Timestamp when the project was resumed';
COMMENT ON COLUMN projects.resumed_by IS 'User ID of who resumed the project';

-- Create a project status history table for audit trail
CREATE TABLE project_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add index for efficient history queries
CREATE INDEX idx_project_status_history_project_id ON project_status_history(project_id);
CREATE INDEX idx_project_status_history_changed_at ON project_status_history(changed_at);

-- Add RLS policies for project_status_history
ALTER TABLE project_status_history ENABLE ROW LEVEL SECURITY;

-- Policy for viewing status history (admins only)
CREATE POLICY "Admin can view project status history" ON project_status_history
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
  )
);

-- Policy for inserting status history (admins only)
CREATE POLICY "Admin can insert project status history" ON project_status_history
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
  )
);

-- Function to automatically create status history entries
CREATE OR REPLACE FUNCTION create_project_status_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create history entry if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO project_status_history (
            project_id, 
            old_status, 
            new_status, 
            changed_by, 
            reason,
            metadata
        ) VALUES (
            NEW.id, 
            OLD.status, 
            NEW.status, 
            auth.uid(),
            CASE 
                WHEN NEW.status = 'paused' THEN NEW.pause_reason
                WHEN OLD.status = 'paused' AND NEW.status = 'active' THEN 'Project resumed'
                ELSE NULL
            END,
            jsonb_build_object(
                'paused_at', NEW.paused_at,
                'resumed_at', NEW.resumed_at,
                'previous_paused_at', OLD.paused_at,
                'previous_resumed_at', OLD.resumed_at
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic status history tracking
CREATE TRIGGER trigger_project_status_history
    AFTER UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION create_project_status_history();