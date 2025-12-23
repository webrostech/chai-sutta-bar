import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, MapPin, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { createCommunityPost, uploadCommunityImage } from '@/lib/api';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, outlets } = useApp();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const uploadedUrl = await uploadCommunityImage(user.id, imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const post = await createCommunityPost(
        user.id,
        content.trim(),
        selectedOutlet || undefined,
        imageUrl
      );

      if (post) {
        toast.success('Post shared with the community! ☕');
        setContent('');
        setImageFile(null);
        setImagePreview(null);
        setSelectedOutlet(null);
        onPostCreated();
        onClose();
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-chai-charcoal/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-20 bottom-auto z-50 max-w-lg mx-auto"
          >
            <div className="bg-card rounded-3xl overflow-hidden shadow-card border border-border">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-display text-xl text-foreground">SHARE YOUR MOMENT</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Text area */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's brewing? Share your chai moment..."
                  className="w-full h-32 p-4 rounded-xl bg-muted/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                  maxLength={500}
                />

                {/* Character count */}
                <div className="text-right text-xs text-muted-foreground">
                  {content.length}/500
                </div>

                {/* Image preview */}
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden"
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 rounded-full bg-chai-charcoal/80 text-chai-cream hover:bg-chai-charcoal transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Outlet selection */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Tag an outlet (optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {outlets.slice(0, 4).map((outlet) => (
                      <motion.button
                        key={outlet.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOutlet(
                          selectedOutlet === outlet.id ? null : outlet.id
                        )}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedOutlet === outlet.id
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {outlet.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Image className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                </div>

                <Button
                  variant="orange"
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
