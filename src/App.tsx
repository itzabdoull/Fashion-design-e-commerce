import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-ink/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex gap-8 text-xs uppercase tracking-widest font-medium">
            <a href="#collections" className="hover:opacity-50 transition-opacity">Collections</a>
            <a href="#about" className="hover:opacity-50 transition-opacity">About</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
          </div>

          <h1 className="text-2xl lg:text-3xl font-serif tracking-tighter absolute left-1/2 -translate-x-1/2">
            AURELIA COUTURE
          </h1>

          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 hover:opacity-50 transition-opacity"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-brand-bg flex flex-col p-8"
          >
            <button className="self-end p-2" onClick={() => setIsMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-8 mt-12 text-4xl font-serif">
              <a href="#collections" onClick={() => setIsMenuOpen(false)}>Collections</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="relative z-10 text-center text-white px-6">
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="uppercase tracking-[0.3em] text-sm mb-4"
          >
            Spring / Summer 2026
          </motion.p>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-none"
          >
            The Ethereal <br /> Collection
          </motion.h2>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="px-12 py-4 border border-white hover:bg-white hover:text-brand-ink transition-all duration-500 uppercase tracking-widest text-xs"
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Now
          </motion.button>
        </div>
      </header>

      {/* Collections Section */}
      <main id="collections" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif mb-4">Curated Pieces</h2>
            <p className="text-brand-ink/60 max-w-md">
              Discover our latest collection of hand-crafted garments, designed with precision and passion.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs uppercase tracking-widest border transition-all",
                  selectedCategory === cat 
                    ? "bg-brand-ink text-white border-brand-ink" 
                    : "border-brand-ink/20 hover:border-brand-ink"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-white text-brand-ink px-8 py-3 uppercase tracking-widest text-[10px] font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-ink/40 mb-1">{product.category}</p>
                  <h3 className="text-xl font-serif">{product.name}</h3>
                </div>
                <p className="font-medium">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="bg-brand-ink text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" 
              alt="Designer at work" 
              className="w-full h-full object-cover grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif">The Vision</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              Aurelia Couture was born from a desire to blend traditional craftsmanship with modern architectural silhouettes. Every piece is a testament to the beauty of slow fashion, created with ethically sourced materials and an unwavering attention to detail.
            </p>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              We believe that clothing is more than just fabric; it is an extension of one's identity. Our designs are meant to empower, inspire, and endure through generations.
            </p>
            <div className="pt-4">
              <button className="px-10 py-4 border border-white/30 hover:border-white transition-colors uppercase tracking-widest text-xs">
                Read Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-brand-bg py-24 border-t border-brand-ink/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h1 className="text-2xl font-serif tracking-tighter">AURELIA COUTURE</h1>
            <p className="text-sm text-brand-ink/60 leading-relaxed">
              Redefining luxury through conscious design and timeless elegance.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-brand-ink/60">
              <li><a href="#" className="hover:text-brand-ink transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-brand-ink transition-colors">Evening Wear</a></li>
              <li><a href="#" className="hover:text-brand-ink transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-brand-ink transition-colors">Bespoke Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-brand-ink/60">
              <li><a href="#" className="hover:text-brand-ink transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-brand-ink transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-brand-ink transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-ink transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-brand-ink/60 mb-6">Join our circle for exclusive previews and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent border-b border-brand-ink/20 py-2 text-sm focus:border-brand-ink outline-none flex-1"
              />
              <button className="uppercase text-[10px] font-bold tracking-widest hover:opacity-50 transition-opacity">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-brand-ink/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-brand-ink/40">
            © 2026 Aurelia Couture. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-brand-ink/40">
            <a href="#" className="hover:text-brand-ink transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-ink transition-colors">Pinterest</a>
            <a href="#" className="hover:text-brand-ink transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-bg z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-brand-ink/10 flex items-center justify-between">
                <h3 className="text-2xl font-serif">Shopping Bag ({cartCount})</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-brand-ink/40 space-y-4">
                    <ShoppingBag className="w-12 h-12 stroke-1" />
                    <p className="uppercase tracking-widest text-xs">Your bag is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-lg">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-brand-ink/40 hover:text-brand-ink">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-brand-ink/60">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-brand-ink/10 rounded-full px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:opacity-50">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:opacity-50">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-ink/10 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="uppercase tracking-widest text-xs font-bold">Subtotal</span>
                    <span className="text-2xl font-serif">${cartTotal}</span>
                  </div>
                  <button className="w-full bg-brand-ink text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-brand-ink/90 transition-colors">
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
