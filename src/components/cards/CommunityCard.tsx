import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { CommunityPost } from '@/lib/store';

interface CommunityCardProps {
  post: CommunityPost;
}

export function CommunityCard({ post }: CommunityCardProps) {
  const timeAgo = getTimeAgo(post.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-chai"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-chai-cream font-display text-lg flex-shrink-0">
          {post.userName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{post.userName}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{post.outletName}</span>
          </div>
          
          {/* Time */}
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
          
          {/* Content */}
          <p className="mt-2 text-foreground">{post.content}</p>

          {/* Image if exists */}
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt="Post" 
              className="mt-3 rounded-xl w-full object-cover max-h-48"
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Reply</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
