import { motion } from "framer-motion";
import { cn, buttonVariants } from "@heroui/react";
import { Leaf, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t, i18n } = useTranslation(["landing"]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="diagonal-grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Leaf size={80} className="text-accent opacity-20" />
              <span className="absolute inset-0 flex items-center justify-center font-playfair text-6xl font-bold text-accent">
                404
              </span>
            </div>
          </div>
          
          <h1 className="font-playfair text-4xl md:text-6xl mb-6 text-accent">
            {i18n.language === 'vi' ? 'Lối đi bị che khuất' : 'Path Obscured'}
          </h1>
          
          <p className="text-muted text-lg md:text-xl mb-10 leading-relaxed">
            {i18n.language === 'vi' 
              ? 'Có vẻ như bạn đã lạc vào một góc khuất của khu vườn. Trang bạn đang tìm kiếm không tồn tại hoặc đã được di dời.' 
              : 'It seems you\'ve wandered into a hidden corner of the sanctuary. The page you are looking for doesn\'t exist or has been moved.'}
          </p>
          
          <Link to="/">
            <button className={cn(buttonVariants({ variant: "primary" }), "bg-accent text-white font-bold px-8 py-4 h-auto rounded-xl flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity cursor-pointer")}>
              <Home size={20} />
              {t('nav.home')}
            </button>
          </Link>
        </motion.div>
      </div>
      
      <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none">
        <Leaf size={300} className="text-accent rotate-45" />
      </div>
      <div className="absolute -top-20 -left-20 opacity-10 pointer-events-none">
        <Leaf size={300} className="text-accent -rotate-45" />
      </div>
    </div>
  );
}
