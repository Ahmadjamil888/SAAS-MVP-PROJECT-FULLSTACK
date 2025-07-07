
import { motion } from 'framer-motion';
import { FileText, Users, Shield, Zap, Cloud, Search } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Document Creation',
      description: 'Create professional documents with intelligent templates and real-time collaboration features.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time editing, comments, and version control.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security measures to protect your sensitive documents.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures your documents load instantly, anywhere in the world.'
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Access your documents from any device with automatic cloud synchronization.'
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find any document instantly with our advanced search and filtering capabilities.'
    }
  ];

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
              Powerful Features
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the comprehensive set of features that make DocuFlow the ultimate document management solution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-green-500/50 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-green-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
