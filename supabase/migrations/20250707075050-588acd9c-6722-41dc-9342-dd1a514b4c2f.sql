
-- Fix RLS policies to allow admin dashboard to see all users and blogs
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can view all blogs" ON public.blogs;

-- Create new policies for profiles that allow admin access
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT
  USING (true);

-- Create new policies for blogs that allow public access to published blogs
CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all blogs" ON public.blogs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Add subscription management to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing free users to have proper subscription dates
UPDATE public.profiles 
SET subscription_start = created_at 
WHERE subscription_start IS NULL;
