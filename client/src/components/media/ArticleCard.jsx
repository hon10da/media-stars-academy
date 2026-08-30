import { Link } from 'react-router-dom'
import { FaNewspaper } from 'react-icons/fa'
import { AnimatedCard } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const CATEGORY_LABELS = {
  news: 'خبر',
  press: 'صحافة',
  video: 'فيديو',
  article: 'مقال',
}

export default function ArticleCard({ post, delay = 0 }) {
  return (
    <AnimatedCard delay={delay} className="overflow-hidden flex flex-col">
      <div className="h-40 bg-navy/5 flex items-center justify-center">
        {post.coverImageUrl ? (
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <FaNewspaper className="text-navy/20" size={36} />
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <Badge tone="navy" className="self-start">{CATEGORY_LABELS[post.category] || post.category}</Badge>
        <h3 className="font-display font-bold text-navy text-lg leading-snug">{post.title}</h3>
        <p className="text-muted text-sm leading-relaxed flex-1">{post.excerpt}</p>
        <Link
          to={`/media/${post.slug}`}
          className="text-sm font-bold text-[var(--color-gold)] hover:text-navy transition-colors self-start"
        >
          قراءة المزيد ←
        </Link>
      </div>
    </AnimatedCard>
  )
}
