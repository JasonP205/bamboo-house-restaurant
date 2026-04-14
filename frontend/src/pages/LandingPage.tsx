import { 
  cn,
  buttonVariants,
  cardVariants,
  chipVariants,
  separatorVariants
} from "@heroui/react";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Utensils, 
  Clock, 
  MapPin, 
  Instagram, 
  Facebook, 
  Phone,
  Star,
  Languages
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ToggleLang from "@/components/ui/toggleLang";
import ToggleTheme from "@/components/ui/toggleTheme";

export default function App() {
  const { t } = useTranslation(["landing"]);


  const menuItems = [
    {
      name: t('menu.items.springRolls.name'),
      price: "$6.50",
      desc: t('menu.items.springRolls.desc'),
      img: "/img/cha-gio-chien.jpg"
    },
    {
      name: t('menu.items.tilapia.name'),
      price: "$16.95",
      desc: t('menu.items.tilapia.desc'),
      img: "/img/ca-dieu-hong-nuong.jpg"
    },
    {
      name: t('menu.items.beefPeppercorn.name'),
      price: "$10.95",
      desc: t('menu.items.beefPeppercorn.desc'),
      img: "/img/bo-xao-hoa-tieu.jpg"
    },
    {
      name: t('menu.items.papayaSalad.name'),
      price: "$7.95",
      desc: t('menu.items.papayaSalad.desc'),
      img: "/img/goi-bo-tom.jpg"
    }
  ];

  return (
    <div className="min-h-screen font-sans text-foreground bg-background selection:bg-accent selection:text-white">
      {/* Custom Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/img/bamboo-house-icon.png" 
              alt="Bamboo House Logo" 
              className="h-10 w-10 mr-2 object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="font-playfair font-bold text-xl tracking-tight text-accent uppercase">BAMBOO HOUSE</p>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-foreground hover:text-accent transition-colors font-medium">{t('nav.home')}</a>
            <a href="#about" className="text-foreground hover:text-accent transition-colors font-medium">{t('nav.about')}</a>
            <a href="#menu" className="text-foreground hover:text-accent transition-colors font-medium">{t('nav.menu')}</a>
            <a href="#gallery" className="text-foreground hover:text-accent transition-colors font-medium">{t('nav.gallery')}</a>
          </nav>

          <div className="flex items-center gap-4">
            <ToggleLang />
            <ToggleTheme />
            <Link to="/auth/login">
              <button 
                className={cn(buttonVariants({ variant: "primary" }), "bg-accent text-white font-semibold px-6 hover:opacity-90 transition-opacity cursor-pointer")}
              >
                {t('nav.login')}
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/img/hero-section.png" 
              alt="Bamboo House Aerial View" 
              className="w-full h-full object-cover scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-playfair text-5xl md:text-8xl text-white mb-6 leading-tight">
                {t('hero.title1')} <br />
                <span className="italic">{t('hero.title2')}</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-white border-white/40 hover:bg-white/10 px-8 h-14 text-lg cursor-pointer")}
                >
                  <a href="#menu">{t('hero.cta')}</a>
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent mx-auto" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-4 bg-background relative overflow-hidden">
          <div className="diagonal-grid-bg absolute inset-0 opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 text-accent mb-4">
                  <Leaf size={20} />
                  <span className="uppercase tracking-widest font-bold text-sm">{t('about.badge')}</span>
                </div>
                <h2 className="font-playfair text-4xl md:text-5xl mb-8 leading-tight text-accent">
                  {t('about.title')}
                </h2>
                <p className="text-muted text-lg mb-6 leading-relaxed">
                  {t('about.p1')}
                </p>
                <p className="text-muted text-lg mb-8 leading-relaxed">
                  {t('about.p2')}
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-3xl font-playfair text-accent mb-1">100%</p>
                    <p className="text-sm text-muted uppercase tracking-wider">{t('about.stat1')}</p>
                  </div>
                  <div>
                    <p className="text-3xl font-playfair text-accent mb-1">15+</p>
                    <p className="text-sm text-muted uppercase tracking-wider">{t('about.stat2')}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/img/indoor.png" 
                    alt="Bamboo House Interior" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-accent p-8 rounded-2xl shadow-xl hidden md:block max-w-xs">
                  <Utensils className="text-white mb-4" size={32} />
                  <p className="text-white font-playfair text-xl italic">
                    {t('about.quote')}
                  </p>
                  <div className="mt-4 flex gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-warning text-warning" />)}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-24 px-4 bg-surface-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl md:text-5xl mb-4 text-accent">{t('menu.title')}</h2>
              <p className="text-muted max-w-xl mx-auto text-lg">
                {t('menu.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={cn(cardVariants(), "border-none bg-background hover:shadow-xl transition-all group overflow-hidden")}>
                    <div className="p-0 overflow-hidden aspect-square">
                      <img
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        src={item.img}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-playfair text-xl text-accent">{item.name}</h3>
                        <span className="font-bold text-accent">{item.price}</span>
                      </div>
                      <p className="text-muted text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-accent text-accent font-bold px-10 cursor-pointer")}
              >
                {t('menu.cta')}
              </button>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="font-playfair text-4xl md:text-5xl mb-4 text-accent">{t('gallery.title')}</h2>
                <p className="text-muted text-lg">{t('gallery.subtitle')}</p>
              </div>
              <button className={cn(buttonVariants({ variant: "ghost" }), "text-accent font-bold flex items-center gap-2 cursor-pointer")}>
                {t('gallery.follow')} <Instagram size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl">
                <img src="/img/flycam-bamboo-house.png" alt="Gallery 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="overflow-hidden rounded-2xl aspect-square">
                <img src="/img/cheff.png" alt="Gallery 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="overflow-hidden rounded-2xl aspect-square">
                <img src="/img/signature-dishes.png" alt="Gallery 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="col-span-2 overflow-hidden rounded-2xl aspect-[2/1]">
                <img src="/img/ingredients.png" alt="Gallery 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter/CTA */}
        <section className="py-24 px-4 bg-accent text-white overflow-hidden relative">
          <div className="diagonal-grid-bg absolute inset-0 opacity-10 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-4xl md:text-6xl mb-8 leading-tight">
                {t('newsletter.title').split('<br />').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                {t('newsletter.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder={t('newsletter.placeholder')} 
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 outline-none focus:bg-white/20 transition-all placeholder:text-white/40"
                />
                <button className={cn(buttonVariants({ variant: "primary" }), "bg-white text-accent font-bold h-auto py-4 px-8 rounded-xl cursor-pointer")}>
                  {t('newsletter.button')}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-16 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src="/img/bamboo-house-icon.png" alt="Logo" className="h-8 w-8 object-contain" referrerPolicy="no-referrer" />
                <span className="font-playfair font-bold text-xl text-accent uppercase">BAMBOO HOUSE</span>
              </div>
              <p className="text-muted leading-relaxed mb-6">
                {t('footer.desc')}
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-accent hover:opacity-70 transition-opacity"><Instagram size={20} /></a>
                <a href="#" className="text-accent hover:opacity-70 transition-opacity"><Facebook size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-accent mb-6 uppercase tracking-widest text-sm">{t('footer.location')}</h4>
              <ul className="space-y-4 text-muted">
                <li className="flex gap-3">
                  <MapPin size={18} className="text-accent shrink-0" />
                  <span>{t('footer.address')}</span>
                </li>
                <li className="flex gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <span>+84 798 020 513</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-accent mb-6 uppercase tracking-widest text-sm">{t('footer.hours')}</h4>
              <ul className="space-y-4 text-muted">
                <li className="flex gap-3">
                  <Clock size={18} className="text-accent shrink-0" />
                  <div>
                    <p className="font-bold text-accent">{t('footer.lunch')}</p>
                    <p>Tue - Sun: 11:30 - 14:30</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock size={18} className="text-accent shrink-0" />
                  <div>
                    <p className="font-bold text-accent">{t('footer.dinner')}</p>
                    <p>Tue - Sun: 17:30 - 22:00</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-accent mb-6 uppercase tracking-widest text-sm">{t('footer.links')}</h4>
              <ul className="space-y-4 text-muted">
                <li><a href="#" className="text-foreground hover:text-accent transition-colors">{t('footer.reservations')}</a></li>
                <li><a href="#" className="text-foreground hover:text-accent transition-colors">{t('footer.events')}</a></li>
                <li><a href="#" className="text-foreground hover:text-accent transition-colors">{t('footer.careers')}</a></li>
                <li><a href="#" className="text-foreground hover:text-accent transition-colors">{t('footer.sustainability')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <div className={cn(separatorVariants(), "h-px bg-border w-full")} />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
            <p>{t('footer.rights')}</p>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-foreground hover:text-accent transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="text-sm text-foreground hover:text-accent transition-colors">{t('footer.terms')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
