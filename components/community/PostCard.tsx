import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

export interface Post {
  id: string
  author: {
    name: string
    initials: string
    memberSince: string
  }
  content: string
  likes: number
  comments: number
  timeAgo: string
  tags: string[]
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="border-border/50 bg-card transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {post.author.initials}
            </div>
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                Member since {post.author.memberSince} • {post.timeAgo}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-foreground">{post.content}</p>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {post.comments}
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto gap-2 text-muted-foreground">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
