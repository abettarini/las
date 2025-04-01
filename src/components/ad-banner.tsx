import { Button } from '@/components/ui/button';
import { Image } from "@/components/ui/image";
import { Link } from 'react-router-dom';
export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  imageUrl: string;
  id: string;
  className?: string
  description?: string;
  ctaText: string;
  link: string;
}
export default function AdBanner(banner: BannerProps) {
    return (
        <div className="rounded-lg bg-card text-card-foreground shadow-sm text-center bg-white">
        <h3 className="text-lg font-semibold mb-0">{banner.title}</h3>
        <div className="p-2 flex flex-col items-center text-center">
        <div className="bg-primary/10 p-0 mb-4">
        <Image
            src={banner.imageUrl}
            alt={banner.title}
            width={328}
            height={132}
            loading="lazy"
        />
        </div>
        <p className="text-sm text-muted-foreground mb-0">{banner.description}</p>
        <Link to={banner.link} aria-label={banner.title}>
          <Button variant="outline" className="w-full">
            {banner.ctaText}
          </Button>
        </Link>
      </div>
    </div>
    )
}