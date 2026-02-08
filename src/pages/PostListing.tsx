import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { counties, propertyTypes } from "@/lib/mock-data";
import { toast } from "sonner";
import { Upload, Send } from "lucide-react";

const amenitiesList = ["Parking", "Security", "Pool", "Gym", "Garden", "Backup Water", "CCTV", "Lift"];

const PostListing = () => {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Listing submitted! It will appear after review.");
    navigate("/browse");
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Post a Vacant House</h1>
      <p className="text-muted-foreground mb-8">Fill in the details below to list your property</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Property Title</label>
            <Input placeholder="e.g. Modern 2BR Apartment in Westlands" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">County</label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                <SelectContent>
                  {counties.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Property Type</label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Specific Location</label>
            <Input placeholder="e.g. Westlands, along Waiyaki Way" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Monthly Rent (KES)</label>
              <Input type="number" placeholder="25000" required min={1000} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bedrooms</label>
              <Input type="number" placeholder="2" required min={0} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bathrooms</label>
              <Input type="number" placeholder="1" required min={0} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea placeholder="Describe the property, surrounding area, and any special features..." rows={4} required />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Photos</label>
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload photos</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB each</p>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2">
          <Send className="w-4 h-4" /> Submit Listing
        </Button>
      </form>
    </div>
  );
};

export default PostListing;
