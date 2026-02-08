import { Listing } from "@/lib/mock-data";
import { MapPin, Bed, Bath, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

const ListingCard = ({ listing, index = 0 }: ListingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group rounded-xl overflow-hidden bg-card border hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {listing.type}
        </Badge>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-body">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          {listing.rating}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-heading text-lg font-semibold leading-tight line-clamp-1 text-card-foreground">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-3.5 h-3.5" />
          {listing.location}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {listing.bedrooms} bed</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {listing.bathrooms} bath</span>
        </div>
        <div className="pt-2 border-t flex items-center justify-between">
          <span className="font-heading text-xl font-bold text-primary">
            KES {listing.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">/month</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
