import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Coffee, Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'Youtube' },
];

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Our Story', href: '#about' },
  { label: 'Locations', href: '#outlets' },
  { label: 'Franchise', href: '#franchise' },
  { label: 'Community', href: '/community' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

export function FooterSection() {
  return (
    <footer className="bg-chai-charcoal relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-chai-orange to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-orange flex items-center justify-center shadow-glow">
                  <Coffee className="w-6 h-6 text-chai-cream" />
                </div>
                <div>
                  <span className="font-display text-2xl text-chai-cream block leading-none">CHAI SUTTA</span>
                  <span className="font-display text-xl text-chai-orange">BAR</span>
                </div>
              </motion.div>
            </Link>
            <p className="text-chai-cream/60 text-sm mt-4 leading-relaxed">
              Where every sip brings people together. Join the chai revolution.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-chai-cream/10 flex items-center justify-center text-chai-cream/60 hover:bg-chai-orange hover:text-chai-cream transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-chai-cream mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-chai-cream/60 hover:text-chai-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-chai-cream mb-4">CONTACT US</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-chai-cream/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Chai Sutta Bar HQ, Vijay Nagar, Indore, MP</span>
              </li>
              <li className="flex items-center gap-3 text-chai-cream/60 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-chai-cream/60 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@chaisuttabar.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg text-chai-cream mb-4">STAY UPDATED</h4>
            <p className="text-chai-cream/60 text-sm mb-4">
              Get exclusive drops and rewards updates.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-chai-cream/10 rounded-lg text-chai-cream placeholder:text-chai-cream/40 border border-chai-cream/10 focus:border-chai-orange/50 focus:outline-none transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-chai-orange flex items-center justify-center"
              >
                <Mail className="w-4 h-4 text-chai-cream" />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-chai-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-chai-cream/40 text-sm">
            © {new Date().getFullYear()} Chai Sutta Bar. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-chai-cream/40 hover:text-chai-cream transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
