import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import * as dialog from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FeedImageDialogProps {
  imageUrls: string[];
}

export function FeedImageDialog({ imageUrls }: FeedImageDialogProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  if (imageUrls.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev !== null && prev < imageUrls.length - 1 ? prev + 1 : prev,
    );
  };

  return (
    <>
      <div
        className={cn(
          'grid gap-2',
          imageUrls.length === 1
            ? 'grid-cols-1'
            : imageUrls.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3',
        )}
      >
        {imageUrls.map((url, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'group relative aspect-square cursor-pointer overflow-hidden rounded-md border border-border/60 bg-muted/50 transition-all hover:border-border/80 dark:bg-muted/20',
              imageUrls.length === 3 && index === 0
                ? 'sm:col-span-2 sm:row-span-2'
                : '',
            )}
          >
            <img
              src={url}
              alt={`Session image ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
          </button>
        ))}
      </div>

      <dialog.Dialog
        open={currentIndex !== null}
        onOpenChange={(open) => {
          if (!open) setCurrentIndex(null);
        }}
      >
        <dialog.DialogContent
          className="max-w-[95vw] overflow-hidden border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[90vw] lg:max-w-5xl"
          showCloseButton={false}
        >
          <dialog.DialogTitle className="sr-only">
            Session Image {(currentIndex ?? 0) + 1}
          </dialog.DialogTitle>
          <dialog.DialogClose
            render={
              <Button
                variant="secondary"
                size="icon"
                className="z-50 absolute top-2 right-2 rounded-lg bg-black/50 text-white hover:bg-black/70 border-none"
              />
            }
          >
            <X className="size-6" />
          </dialog.DialogClose>
          <div className="relative flex min-h-[50vh] items-center justify-center p-2 sm:p-4">
            {currentIndex !== null && (
              <>
                <img
                  src={imageUrls[currentIndex]}
                  alt={`Session image ${currentIndex + 1}`}
                  className="h-auto max-h-[85vh] w-auto object-contain shadow-lg"
                />

                {imageUrls.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 opacity-70 hover:opacity-100 disabled:opacity-60"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="size-6" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 opacity-70 hover:opacity-100 disabled:opacity-60"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={handleNext}
                      disabled={currentIndex === imageUrls.length - 1}
                    >
                      <ChevronRight className="size-6" />
                    </Button>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                      {currentIndex + 1} / {imageUrls.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </dialog.DialogContent>
      </dialog.Dialog>
    </>
  );
}
