
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  subscription_tier: string;
  subscription_end: string;
  document_count: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchProfile();
    fetchDocuments();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_end, document_count')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    if (!newDoc.title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    // Check document limit for free users
    if (profile?.subscription_tier === 'free' && documents.length >= 5) {
      toast.error('Free plan limited to 5 documents. Please upgrade to create more.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            user_id: user?.id,
            title: newDoc.title,
            content: newDoc.content,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      setDocuments([data, ...documents]);
      setNewDoc({ title: '', content: '' });
      setIsCreateOpen(false);
      toast.success('Document created successfully');
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  const updateDocument = async () => {
    if (!editingDoc?.title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .update({
          title: editingDoc.title,
          content: editingDoc.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingDoc.id)
        .select()
        .single();

      if (error) throw error;

      setDocuments(documents.map(doc => doc.id === editingDoc.id ? data : doc));
      setEditingDoc(null);
      toast.success('Document updated successfully');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DocuFlow</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                profile?.subscription_tier === 'premium' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {profile?.subscription_tier === 'premium' ? 'Pro' : 'Free'} Plan
              </span>
            </div>
          </div>

          <nav className="space-y-4">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              disabled={profile?.subscription_tier === 'free' && documents.length >= 5}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>

            {profile?.subscription_tier === 'free' && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  {documents.length}/5 documents used
                </p>
                <Button
                  onClick={() => window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="sm"
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}
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
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">My Documents</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No documents yet</h3>
                <p className="text-gray-400 mb-6">Create your first document to get started</p>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {doc.content || 'No content'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingDoc(doc)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteDocument(doc.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Document Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Document title"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Document content"
              value={newDoc.content}
              onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createDocument} className="bg-blue-600 hover:bg-blue-700">
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Document title"
              value={editingDoc?.title || ''}
              onChange={(e) => setEditingDoc(editingDoc ? { ...editingDoc, title: e.target.value } : null)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Document content"
              value={editingDoc?.content || ''}
              onChange={(e) => setEditingDoc(editingDoc ? { ...editingDoc, content: e.target.value } : null)}
              className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setEditingDoc(null)}>
                Cancel
              </Button>
              <Button onClick={updateDocument} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
