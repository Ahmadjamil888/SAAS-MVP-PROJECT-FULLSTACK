
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/AuthModal';
import ThreeBackground from '@/components/ThreeBackground';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth scrolling animations
      gsap.utils.toArray('.animate-on-scroll').forEach((element: any) => {
        gsap.fromTo(element, 
          { 
            y: 100, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Parallax effect for sections
      gsap.utils.toArray('.parallax').forEach((element: any) => {
        gsap.to(element, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden">
      <ThreeBackground />
      <Navigation onAuthClick={handleAuthClick} />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <BlogSection />
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Index;
