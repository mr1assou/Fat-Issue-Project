'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PostCard, type Post } from './PostCard'
import { PenSquare, TrendingUp, Clock, Users } from 'lucide-react'

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah M.',
      initials: 'SM',
      memberSince: 'Jan 2025',
    },
    content:
      "Just completed my first week following my personalized sleep plan! I've already noticed I'm falling asleep faster and waking up feeling more refreshed. The tip about keeping screens away 1 hour before bed was a game-changer for me.",
    likes: 24,
    comments: 8,
    timeAgo: '2 hours ago',
    tags: ['progress', 'tips', 'screens'],
  },
  {
    id: '2',
    author: {
      name: 'James L.',
      initials: 'JL',
      memberSince: 'Dec 2024',
    },
    content:
      "Question for the community: Has anyone tried weighted blankets? I'm considering getting one based on the eBook recommendation but would love to hear real experiences from fellow members.",
    likes: 15,
    comments: 12,
    timeAgo: '5 hours ago',
    tags: ['question', 'weighted-blanket'],
  },
  {
    id: '3',
    author: {
      name: 'Emily R.',
      initials: 'ER',
      memberSince: 'Nov 2024',
    },
    content:
      "Three months into my sleep journey and I've gone from 5 hours of broken sleep to consistently getting 7-8 hours! The community support here has been incredible. Thank you all for the encouragement and tips along the way.",
    likes: 56,
    comments: 19,
    timeAgo: '1 day ago',
    tags: ['success-story', 'gratitude'],
  },
]

const filters = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'following', label: 'Following', icon: Users },
]

export function CommunityFeed() {
  const [activeFilter, setActiveFilter] = useState('trending')

  return (
    <div className="mx-auto max-w-2xl">
      {/* Create Post */}
      <Card className="mb-6 border-border/50 bg-card">
        <CardContent className="p-4">
          <Button className="w-full justify-start gap-3 text-muted-foreground bg-transparent" variant="outline">
            <PenSquare className="h-4 w-4" />
            Share your sleep journey or ask a question...
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? 'secondary' : 'ghost'}
            size="sm"
            className="gap-2"
            onClick={() => setActiveFilter(filter.id)}
          >
            <filter.icon className="h-4 w-4" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <Button variant="outline">Load More Posts</Button>
      </div>
    </div>
  )
}
