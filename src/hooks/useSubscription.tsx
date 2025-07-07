
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscription_tier: string;
  subscription_start: string | null;
  subscription_end: string | null;
  document_count: number;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_start, subscription_end, document_count')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreateDocument = () => {
    if (!subscription) return false;
    
    // Check if subscription has expired
    if (subscription.subscription_end && new Date(subscription.subscription_end) < new Date()) {
      return false;
    }

    // Pro users have unlimited documents
    if (subscription.subscription_tier === 'premium') {
      return true;
    }

    // Free users are limited to 5 documents
    return subscription.document_count < 5;
  };

  const isSubscriptionExpired = () => {
    if (!subscription?.subscription_end) return false;
    return new Date(subscription.subscription_end) < new Date();
  };

  const isPremium = () => {
    return subscription?.subscription_tier === 'premium' && !isSubscriptionExpired();
  };

  return {
    subscription,
    loading,
    canCreateDocument,
    isSubscriptionExpired,
    isPremium,
    refetch: fetchSubscription
  };
};
