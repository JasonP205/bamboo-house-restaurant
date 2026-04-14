import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { motion, AnimatePresence } from "motion/react";

type DrawerContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer components must be inside BottomDrawer");
  return ctx;
};

// Root
const BottomDrawer = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen}}>
      {children}
    </DrawerContext.Provider>
  );
};

// Trigger
const Trigger = ({ children }: { children: ReactNode }) => {
  const { setOpen } = useDrawer();

  if (isValidElement(children)) {
    return cloneElement(children as any, {
      onClick: () => setOpen(true),
    });
  }

  return <div onClick={() => setOpen(true)}>{children}</div>;
};

// Content
const Content = ({ children, blur }: { children: ReactNode; blur?: boolean }) => {
  const { open, setOpen } = useDrawer();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            className={`fixed inset-0 z-50 bg-black/40 ${blur ? "backdrop-blur-sm" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl p-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) setOpen(false);
            }}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

BottomDrawer.Trigger = Trigger;
BottomDrawer.Content = Content;

export default BottomDrawer;