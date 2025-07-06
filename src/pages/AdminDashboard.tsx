
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, DollarSign, Edit, Trash2, LogOut, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminSession {
  id: string;
  email: string;
  full_name: string;
  loginTime: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: string;
  document_count: number;
  created_at: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isCreateBlogOpen, setIsCreateBlogOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin session
    const session = localStorage.getItem('adminSession');
    if (!session) {
      navigate('/admin');
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      // Check if session is still valid (24 hours)
      if (Date.now() - parsedSession.loginTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('adminSession');
        navigate('/admin');
        return;
      }
      setAdminSession(parsedSession);
      fetchData();
    } catch (error) {
      console.error('Invalid session:', error);
      localStorage.removeItem('adminSession');
      navigate('/admin');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchBlogs()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
    }
  };

  const createBlog = async () => {
    if (!newBlog.title.trim() || !newBlog.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert([{
          title: newBlog.title,
          content: newBlog.content,
          excerpt: newBlog.excerpt || newBlog.content.substring(0, 150) + '...',
          published: newBlog.published
        }])
        .select()
        .single();

      if (error) throw error;

      setBlogs([data, ...blogs]);
      setNewBlog({ title: '', content: '', excerpt: '', published: false });
      setIsCreateBlogOpen(false);
      toast.success('Blog created successfully');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog');
    }
  };

  const updateBlog = async () => {
    if (!editingBlog?.title.trim() || !editingBlog?.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('blogs')
        .update({
          title: editingBlog.title,
          content: editingBlog.content,
          excerpt: editingBlog.excerpt || editingBlog.content.substring(0, 150) + '...',
          published: editingBlog.published
        })
        .eq('id', editingBlog.id)
        .select()
        .single();

      if (error) throw error;

      setBlogs(blogs.map(blog => blog.id === editingBlog.id ? data : blog));
      setEditingBlog(null);
      toast.success('Blog updated successfully');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const totalUsers = users.length;
  const premiumUsers = users.filter(user => user.subscription_tier === 'premium').length;
  const totalRevenue = premiumUsers * 9; // $9 per premium user

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-400 text-sm">{adminSession?.email}</p>
          </div>

          <nav className="space-y-2">
            <div className="text-gray-300 font-medium mb-4">Navigation</div>
          </nav>

          <div className="absolute bottom-6">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalUsers}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Premium Users</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{premiumUsers}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${totalRevenue}</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="bg-gray-900 border-b border-gray-700">
                <TabsTrigger value="users" className="text-gray-300 data-[state=active]:text-white">
                  Users
                </TabsTrigger>
                <TabsTrigger value="blogs" className="text-gray-300 data-[state=active]:text-white">
                  Blogs
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left p-3 text-gray-300">Email</th>
                            <th className="text-left p-3 text-gray-300">Name</th>
                            <th className="text-left p-3 text-gray-300">Plan</th>
                            <th className="text-left p-3 text-gray-300">Documents</th>
                            <th className="text-left p-3 text-gray-300">Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <td className="p-3 text-white">{user.email}</td>
                              <td className="p-3 text-gray-300">{user.full_name || 'N/A'}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  user.subscription_tier === 'premium' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-300'
                                }`}>
                                  {user.subscription_tier === 'premium' ? 'Pro' : 'Free'}
                                </span>
                              </td>
                              <td className="p-3 text-gray-300">{user.document_count}</td>
                              <td className="p-3 text-gray-300">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Blog Management</CardTitle>
                    <Button
                      onClick={() => setIsCreateBlogOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Blog
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {blogs.map((blog) => (
                        <div key={blog.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-white">{blog.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                blog.published 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-yellow-600 text-white'
                              }`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingBlog(blog)}
                                className="text-gray-400 hover:text-white"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteBlog(blog.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{blog.excerpt}</p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(blog.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Create Blog Dialog */}
      <Dialog open={isCreateBlogOpen} onOpenChange={setIsCreateBlogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Blog title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Input
              placeholder="Excerpt (optional)"
              value={newBlog.excerpt}
              onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Blog content"
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white min-h-[300px]"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={newBlog.published}
                onChange={(e) => setNewBlog({ ...newBlog, published: e.target.checked })}
                className="rounded bg-gray-800 border-gray-700"
              />
              <label htmlFor="published" className="text-sm text-gray-300">
                Publish immediately
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsCreateBlogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createBlog} className="bg-blue-600 hover:bg-blue-700">
                Create Blog
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={!!editingBlog} onOpenChange={() => setEditingBlog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Blog title"
              value={editingBlog?.title || ''}
              onChange={(e) => setEditingBlog(editingBlog ? { ...editingBlog, title: e.target.value } : null)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Input
              placeholder="Excerpt (optional)"
              value={editingBlog?.excerpt || ''}
              onChange={(e) => setEditingBlog(editingBlog ? { ...editingBlog, excerpt: e.target.value } : null)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Blog content"
              value={editingBlog?.content || ''}
              onChange={(e) => setEditingBlog(editingBlog ? { ...editingBlog, content: e.target.value } : null)}
              className="bg-gray-800 border-gray-700 text-white min-h-[300px]"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editPublished"
                checked={editingBlog?.published || false}
                onChange={(e) => setEditingBlog(editingBlog ? { ...editingBlog, published: e.target.checked } : null)}
                className="rounded bg-gray-800 border-gray-700"
              />
              <label htmlFor="editPublished" className="text-sm text-gray-300">
                Published
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setEditingBlog(null)}>
                Cancel
              </Button>
              <Button onClick={updateBlog} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
