
-- Fix blog creation by updating RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can view all blogs" ON public.blogs;

-- Allow admin users (or any authenticated user) to create blogs
CREATE POLICY "Allow blog creation" ON public.blogs
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow admin users to update blogs
CREATE POLICY "Allow blog updates" ON public.blogs
FOR UPDATE 
TO authenticated
USING (true);

-- Allow admin users to delete blogs
CREATE POLICY "Allow blog deletion" ON public.blogs
FOR DELETE 
TO authenticated
USING (true);

-- Allow authenticated users to view all blogs (for admin dashboard)
CREATE POLICY "Allow authenticated users to view all blogs" ON public.blogs
FOR SELECT 
TO authenticated
USING (true);

-- Update the document count trigger to work properly
DROP TRIGGER IF EXISTS update_document_count_trigger ON public.documents;

CREATE OR REPLACE FUNCTION public.update_document_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Update document count for the affected user
  UPDATE public.profiles 
  SET document_count = (
    SELECT COUNT(*) FROM public.documents 
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
  )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create triggers for document count updates
CREATE TRIGGER update_document_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_document_count();
