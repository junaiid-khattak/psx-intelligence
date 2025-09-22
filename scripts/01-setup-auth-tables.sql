-- Enable RLS on auth.users (this is usually enabled by default in Supabase)
-- Create psx.users table for additional user data
CREATE SCHEMA IF NOT EXISTS psx;

-- Create psx.users table
CREATE TABLE IF NOT EXISTS psx.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for user profiles
CREATE TABLE IF NOT EXISTS psx.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  bio TEXT,
  website TEXT,
  location TEXT,
  phone TEXT,
  date_of_birth DATE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE psx.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE psx.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for psx.users
CREATE POLICY "Users can view their own data" ON psx.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON psx.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON psx.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for psx.profiles
CREATE POLICY "Public profiles are viewable by everyone" ON psx.profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON psx.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON psx.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON psx.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to automatically create user record
CREATE OR REPLACE FUNCTION psx.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO psx.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  INSERT INTO psx.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user and profile records
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION psx.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION psx.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_psx_users_updated_at
  BEFORE UPDATE ON psx.users
  FOR EACH ROW EXECUTE FUNCTION psx.update_updated_at_column();

CREATE TRIGGER update_psx_profiles_updated_at
  BEFORE UPDATE ON psx.profiles
  FOR EACH ROW EXECUTE FUNCTION psx.update_updated_at_column();
