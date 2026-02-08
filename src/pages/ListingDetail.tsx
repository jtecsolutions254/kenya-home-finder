import { useParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Star, ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ContactForm from "@/components/ContactForm";
import { mockListings } from "@/lib/mock-data";
import { motion } from "framer-motion";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Use mock data for now — will migrate to DB later
  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-heading text-2xl font-bold mb-4">Listing not found</h2>
        <p className="text-muted-foreground mb-6">
          This property may have been removed or doesn't exist.
        </p>
        <Link to="/browse">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  // Generate additional mock images for the gallery
  const images = [
    listing.image,
    listing.image.replace("w=600", "w=601"),
    listing.image.replace("w=600", "w=602"),
  ];

  return (
    <div className="container py-8">
      {/* Back nav */}
      <Link to="/browse">
        <Button variant="ghost" size="sm" className="gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="md:col-span-2 rounded-xl overflow-hidden h-72 md:h-80">
              <img
                src={images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-3">
              {images.slice(1).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <img
                    src={img}
                    alt={`${listing.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Title & meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {listing.type}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    {listing.rating}
                  </div>
                </div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-1 text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  {listing.location}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-heading text-2xl md:text-3xl font-bold text-primary">
                  KES {listing.price.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground block">/month</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Bed className="w-4 h-4" /> {listing.bedrooms} Bedroom{listing.bedrooms !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="w-4 h-4" /> {listing.bathrooms} Bathroom{listing.bathrooms !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Posted {listing.postedAt}
              </span>
            </div>
          </motion.div>

          <Separator />

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-heading text-xl font-semibold mb-3">About this property</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              This property is located in {listing.location}, offering easy access to local amenities,
              public transportation, and shopping centers. The neighborhood is well-established with a
              mix of residential and commercial areas, making it ideal for both families and professionals.
            </p>
          </motion.div>

          <Separator />

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-heading text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listing.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  {amenity}
                </div>
              ))}
            </div>
          </motion.div>

          <Separator />

          {/* Owner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-heading text-xl font-semibold mb-3">Listed by</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-heading text-lg font-bold text-primary">
                  {listing.owner
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-medium">{listing.owner}</p>
                <p className="text-sm text-muted-foreground">Property Owner</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ContactForm listingId={listing.id} ownerName={listing.owner} />
          </motion.div>

          {/* Quick summary card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border rounded-xl p-6"
          >
            <h3 className="font-heading text-lg font-semibold mb-3">Quick Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{listing.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bedrooms</span>
                <span className="font-medium">{listing.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bathrooms</span>
                <span className="font-medium">{listing.bathrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{listing.county}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rent</span>
                <span className="font-medium text-primary">
                  KES {listing.price.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
