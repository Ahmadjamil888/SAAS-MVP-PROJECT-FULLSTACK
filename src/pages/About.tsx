
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              About DocuFlow
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            DocuFlow is the next-generation document management platform designed to streamline your workflow and boost productivity. Our mission is to make document creation, collaboration, and management effortless for individuals and teams worldwide.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-left"
            >
              <h2 className="text-3xl font-bold mb-6 text-green-400">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                We envision a world where document management is intuitive, collaborative, and accessible to everyone. DocuFlow eliminates the complexity of traditional document workflows, enabling you to focus on what matters most - your content.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-left"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To empower businesses and individuals with cutting-edge document management tools that enhance productivity, foster collaboration, and provide seamless access to information across all devices and platforms.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
