-- Add role column to users table
ALTER TABLE psx.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Create admin policies
CREATE POLICY "Admins can view all users" ON psx.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM psx.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update user roles" ON psx.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM psx.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS psx.admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin activity log
ALTER TABLE psx.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin activity log policies
CREATE POLICY "Admins can view activity log" ON psx.admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM psx.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert activity log" ON psx.admin_activity_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM psx.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create system metrics table for admin dashboard
CREATE TABLE IF NOT EXISTS psx.system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL, -- 'counter', 'gauge', 'histogram'
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on system metrics
ALTER TABLE psx.system_metrics ENABLE ROW LEVEL SECURITY;

-- System metrics policies
CREATE POLICY "Admins can view system metrics" ON psx.system_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM psx.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to log admin activity
CREATE OR REPLACE FUNCTION psx.log_admin_activity(
  p_action TEXT,
  p_target_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO psx.admin_activity_log (admin_id, action, target_user_id, details)
  VALUES (auth.uid(), p_action, p_target_user_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a default admin user (you'll need to update this with a real user ID)
-- This is just a placeholder - in production, you'd manually set the first admin
-- UPDATE psx.users SET role = 'admin' WHERE email = 'admin@psxintelligence.com';
