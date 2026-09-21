import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Layers } from 'lucide-react';
import type { Project, ProjectGalleryItem } from '@/portfolio.config';

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  initialIndex?: number;
}

export function ProjectGalleryModal({
  isOpen,
  onClose,
  project,
  initialIndex = 0,
}: ProjectGalleryModalProps) {
  const gallery = project.gallery || [];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Sync index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setSelectedCategory('All');
      setImageLoaded(false);
    }
  }, [isOpen, initialIndex]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    gallery.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [gallery]);

  const currentItem: ProjectGalleryItem | undefined = gallery[currentIndex];

  const handleNext = useCallback(() => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  const handlePrev = useCallback(() => {
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || gallery.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="border-border bg-card/95 relative z-10 flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="border-border/60 flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-foreground font-serif text-lg font-medium sm:text-xl">
                  {project.name}
                </h3>
                <p className="text-muted-foreground font-mono text-xs">
                  Screenshot {currentIndex + 1} of {gallery.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentItem?.image && (
                <a
                  href={currentItem.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2 transition-colors"
                  title="Buka gambar resolusi penuh"
                >
                  <Maximize2 size={18} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg p-2 transition-colors"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Category Filter Pills (if more than 1 category) */}
          {categories.length > 2 && (
            <div className="border-border/40 bg-secondary/30 flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2 sm:px-6">
              <span className="text-muted-foreground mr-1 text-xs font-medium">
                Filter:
              </span>
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? gallery.length
                    : gallery.filter((g) => g.category === cat).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat !== 'All') {
                        const firstIdx = gallery.findIndex(
                          (g) => g.category === cat,
                        );
                        if (firstIdx !== -1) {
                          setImageLoaded(false);
                          setCurrentIndex(firstIdx);
                        }
                      }
                    }}
                    className={`rounded-full px-3 py-1 font-mono text-xs whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                        : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Stage: Image & Overlay Controls */}
          <div className="relative flex min-h-[300px] flex-1 items-center justify-center bg-black/60 p-2 sm:min-h-[420px] md:p-4">
            {/* Left Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="hover:bg-card/90 absolute left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur transition-transform hover:scale-110 active:scale-95 sm:h-12 sm:w-12"
              aria-label="Screenshot Sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Button */}
            <button
              type="button"
              onClick={handleNext}
              className="hover:bg-card/90 absolute right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur transition-transform hover:scale-110 active:scale-95 sm:h-12 sm:w-12"
              aria-label="Screenshot Selanjutnya"
            >
              <ChevronRight size={24} />
            </button>

            {/* Active Image */}
            <div className="relative flex max-h-[56vh] w-full items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentItem?.image || currentIndex}
                  src={currentItem?.image}
                  alt={currentItem?.title || 'Screenshot'}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onLoad={() => setImageLoaded(true)}
                  className={`max-h-[54vh] w-auto max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </AnimatePresence>

              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Screenshot Details / Caption */}
          {currentItem && (
            <div className="border-border/60 bg-card/80 border-t px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-foreground text-sm font-semibold sm:text-base">
                    {currentItem.title}
                  </h4>
                  {currentItem.category && (
                    <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 font-mono text-xs">
                      {currentItem.category}
                    </span>
                  )}
                </div>
              </div>
              {currentItem.description && (
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                  {currentItem.description}
                </p>
              )}
            </div>
          )}

          {/* Thumbnail Strip */}
          <div className="border-border/60 bg-secondary/30 border-t p-2 sm:p-3">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {gallery.map((item, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={item.image + idx}
                    type="button"
                    onClick={() => {
                      setImageLoaded(false);
                      setCurrentIndex(idx);
                    }}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition-all sm:h-16 sm:w-24 ${
                      isSelected
                        ? 'border-primary ring-primary/50 shadow-md ring-2'
                        : 'border-border/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="absolute bottom-0.5 right-1 rounded bg-black/70 px-1 font-mono text-[9px] text-white">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
