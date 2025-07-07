
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { toast } from 'sonner';

const Pricing = () => {
  const handleStripePayment = () => {
    toast.success('Redirecting to Stripe checkout...');
    window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank');
  };

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
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Simple, transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that's right for you. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free Trial</h3>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Up to 5 documents',
                'Basic templates',
                'Standard support',
                'Cloud storage',
                'Mobile access'
              ].map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-white hover:bg-gray-800"
            >
              Get Started Free
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative p-8 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-sm"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4" />
                Most Popular
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <p className="text-gray-400 mb-6">For professionals and teams</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Unlimited documents',
                'Premium templates',
                'Priority support',
                'Advanced collaboration',
                'API access',
                'Custom integrations',
                'Analytics dashboard'
              ].map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              onClick={handleStripePayment}
            >
              Upgrade to Pro
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
