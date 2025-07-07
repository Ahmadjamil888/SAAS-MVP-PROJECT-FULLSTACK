
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  created_at: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news, tips, and insights from the DocuFlow team.
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-green-500/50 transition-colors cursor-pointer"
              >
                <h2 className="text-2xl font-bold mb-4 text-white hover:text-green-400 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {blog.excerpt || blog.content.substring(0, 150) + '...'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>DocuFlow Team</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
