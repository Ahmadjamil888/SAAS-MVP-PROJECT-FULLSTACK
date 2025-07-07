
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, Plus, Edit, Trash2, LogOut, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { subscription, canCreateDocument, isPremium, refetch } = useSubscription();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState({ title: '', content: '' });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchDocuments();
  }, [user, navigate]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      
      // Refetch subscription data to update document count
      await refetch();
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    if (!user) return;
    
    if (!canCreateDocument()) {
      toast.error('Document limit reached! Upgrade to Pro for unlimited documents.');
      return;
    }

    if (!newDoc.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          title: newDoc.title,
          content: newDoc.content,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setDocuments([data, ...documents]);
      setNewDoc({ title: '', content: '' });
      setIsCreateOpen(false);
      toast.success('Document created successfully');
      
      // Refetch subscription data to update document count
      await refetch();
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    }
  };

  const updateDocument = async () => {
    if (!editingDoc) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .update({
          title: editingDoc.title,
          content: editingDoc.content,
          updated_at: new Date().toISOString()
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
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
      
      // Refetch subscription data to update document count
      await refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleUpgradeClick = () => {
    toast.success('Redirecting to Stripe checkout...');
    window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Subscription Status */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                {isPremium() && <Crown className="w-5 h-5 text-yellow-500 mr-2" />}
                Subscription Status
              </span>
              {!isPremium() && (
                <Button onClick={handleUpgradeClick} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Upgrade to Pro
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400">Plan</p>
                <p className="text-white font-semibold">
                  {subscription?.subscription_tier === 'premium' ? 'Pro' : 'Free'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Documents</p>
                <p className="text-white font-semibold">
                  {subscription?.document_count || 0} / {isPremium() ? '∞' : '5'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className={`font-semibold ${isPremium() ? 'text-green-500' : 'text-yellow-500'}`}>
                  {isPremium() ? 'Pro Active' : 'Free Tier'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Documents</h2>
          <Button
            onClick={() => setIsCreateOpen(true)}
            disabled={!canCreateDocument()}
            className="bg-white text-black hover:bg-gray-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        {!canCreateDocument() && !isPremium() && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400">
              You've reached the free tier limit of 5 documents. 
              <Button 
                onClick={handleUpgradeClick}
                variant="link" 
                className="text-yellow-300 hover:text-yellow-100 p-0 ml-1"
              >
                Upgrade to Pro
              </Button> 
              for unlimited documents.
            </p>
          </div>
        )}

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl mb-2">No documents yet</p>
            <p>Create your first document to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <Card key={doc.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white truncate">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {doc.content || 'No content yet...'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Created: {new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingDoc(doc)}
                      className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteDocument(doc.id)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Document Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
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
                placeholder="Start writing your document..."
                value={newDoc.content}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white min-h-[300px]"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createDocument} className="bg-white text-black hover:bg-gray-200">
                  Create Document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Document Dialog */}
        <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl">
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
                className="bg-gray-800 border-gray-700 text-white min-h-[300px]"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setEditingDoc(null)}>
                  Cancel
                </Button>
                <Button onClick={updateDocument} className="bg-white text-black hover:bg-gray-200">
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
