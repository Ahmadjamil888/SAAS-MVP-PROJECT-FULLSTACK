
import { motion } from 'framer-motion';
import { Book, Code, Settings, Users } from 'lucide-react';

const Docs = () => {
  const docSections = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of DocuFlow and start creating your first documents.',
      items: ['Quick Start Guide', 'Account Setup', 'First Document', 'Basic Features']
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Comprehensive API documentation for developers and integrations.',
      items: ['Authentication', 'Document API', 'User Management', 'Webhooks']
    },
    {
      icon: Settings,
      title: 'Configuration',
      description: 'Advanced settings and customization options for your workspace.',
      items: ['Workspace Settings', 'Security Options', 'Integrations', 'Custom Templates']
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Guide to managing teams, permissions, and collaborative workflows.',
      items: ['User Roles', 'Permissions', 'Team Workflows', 'Sharing Controls']
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
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about using DocuFlow effectively, from basic usage to advanced integrations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {docSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-blue-500/50 transition-colors"
            >
              <section.icon className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">{section.title}</h3>
              <p className="text-gray-300 mb-6">{section.description}</p>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    • {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
