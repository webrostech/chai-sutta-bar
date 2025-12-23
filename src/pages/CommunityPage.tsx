import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, MessageCircle, Heart, Image as ImageIcon } from 'lucide-react';
import { CreatePostModal } from '@/components/community/CreatePostModal';

export default function CommunityPage() {
  const { communityPosts, refreshData, isAuthenticated } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTimeAgo = (dateStr: string): string => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-4xl text-foreground">
            TODAY AT CSB
          </h1>
          <p className="text-muted-foreground mt-2">
            Stories, vibes, and moments from the chai community
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.02 }} className="card-chai text-center">
            <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="font-display text-2xl text-foreground">2.4K</p>
            <p className="text-xs text-muted-foreground">Active Today</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="card-chai text-center">
            <MessageCircle className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="font-display text-2xl text-foreground">{communityPosts.length}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </motion.div>
        </motion.div>

        {/* Post Button */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Button
              variant="chai"
              size="lg"
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Share Your Moment
            </Button>
          </motion.div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {communityPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="card-chai"
            >
              <div className="flex items-start gap-3">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-chai-cream font-display text-lg flex-shrink-0"
                >
                  {(post.profiles as any)?.name?.charAt(0) || 'U'}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {(post.profiles as any)?.name || 'User'}
                    </span>
                    {post.outlets && (
                      <>
                        <span className="text-muted-foreground text-sm">·</span>
                        <span className="text-muted-foreground text-sm">
                          {(post.outlets as any)?.name}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(post.created_at)}</p>
                  <p className="mt-2 text-foreground">{post.content}</p>
                  
                  {/* Post image */}
                  {post.image_url && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 rounded-xl overflow-hidden"
                    >
                      <img 
                        src={post.image_url} 
                        alt="Post" 
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{post.likes}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={refreshData}
      />
    </div>
  );
}
