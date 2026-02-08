import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { counties, propertyTypes } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile, updateProfilePhone } from "@/hooks/useProfile";
import { useCreateListing, uploadListingImages } from "@/hooks/useListings";
import { toast } from "sonner";
import { Upload, Send, X, Loader2, ImageIcon, ShieldAlert } from "lucide-react";

const amenitiesList = ["Parking", "Security", "Pool", "Gym", "Garden", "Backup Water", "CCTV", "Lift"];

const PostListing = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const createListing = useCreateListing();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [county, setCounty] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill contact details from profile/auth
  useEffect(() => {
    if (profile?.phone) setContactPhone(profile.phone);
    if (user?.email) setContactEmail(user.email);
  }, [profile, user]);

  const isOwner = profile?.user_type === "owner";
  const loading = authLoading || profileLoading;

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB limit`);
        return false;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        toast.error(`${f.name} is not a supported format`);
        return false;
      }
      return true;
    });

    if (files.length + valid.length > 8) {
      toast.error("Maximum 8 photos allowed");
      return;
    }

    setFiles((prev) => [...prev, ...valid]);
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to post a listing");
      navigate("/auth");
      return;
    }

    if (!isOwner) {
      toast.error("Only house owners can post listings");
      return;
    }

    if (!county || !type) {
      toast.error("Please select county and property type");
      return;
    }

    if (!contactPhone) {
      toast.error("Please provide a contact phone number");
      return;
    }

    setSubmitting(true);
    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (files.length > 0) {
        imageUrls = await uploadListingImages(user.id, files);
      }

      // Also update profile phone if changed
      if (contactPhone && contactPhone !== profile?.phone) {
        await updateProfilePhone(user.id, contactPhone);
      }

      await createListing.mutateAsync({
        owner_id: user.id,
        title,
        description,
        location,
        county,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        type,
        amenities: selectedAmenities,
        images: imageUrls,
        contact_phone: contactPhone,
        contact_email: contactEmail || undefined,
      });

      toast.success("Listing submitted! It will appear after admin review.");
      navigate("/browse");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <ShieldAlert className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">Sign in Required</h2>
        <p className="text-muted-foreground mb-6">You need to sign in to post a listing.</p>
        <Button onClick={() => navigate("/auth")}>Sign In</Button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <ShieldAlert className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">House Owners Only</h2>
        <p className="text-muted-foreground mb-6">
          Only accounts registered as "House Owner" can post listings.
          If you're a house owner, please create an account with the owner role.
        </p>
        <Button variant="outline" onClick={() => navigate("/browse")}>Browse Listings</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Post a Vacant House</h1>
      <p className="text-muted-foreground mb-8">Fill in the details below to list your property</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Property Title</label>
            <Input
              placeholder="e.g. Modern 2BR Apartment in Westlands"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">County</label>
              <Select value={county} onValueChange={setCounty} required>
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
              <Select value={type} onValueChange={setType} required>
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
            <Input
              placeholder="e.g. Westlands, along Waiyaki Way"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Monthly Rent (KES)</label>
              <Input
                type="number"
                placeholder="25000"
                required
                min={1000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bedrooms</label>
              <Input
                type="number"
                placeholder="2"
                required
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Bathrooms</label>
              <Input
                type="number"
                placeholder="1"
                required
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
          </div>

          {/* Owner Contact Details */}
          <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold">Your Contact Details</h3>
            <p className="text-xs text-muted-foreground">
              House seekers will use these to reach you directly via call, WhatsApp, or email.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
                <Input
                  type="tel"
                  placeholder="+254 712 345 678"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea
              placeholder="Describe the property, surrounding area, and any special features..."
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
            <label className="text-sm font-medium mb-1.5 block">Photos (max 8)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-square border">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {previews.length === 0 ? (
                <>
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload photos</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 5MB each</p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm text-muted-foreground">Add more photos ({previews.length}/8)</p>
                </>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {submitting ? "Submitting..." : "Submit Listing"}
        </Button>
      </form>
    </div>
  );
};

export default PostListing;
