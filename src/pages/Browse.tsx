import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ListingCard from "@/components/ListingCard";
import { counties, propertyTypes } from "@/lib/mock-data";
import { useApprovedListings } from "@/hooks/useListings";

const Browse = () => {
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("all");
  const [type, setType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [showFilters, setShowFilters] = useState(false);

  const { data: listings, isLoading } = useApprovedListings();

  const filtered = useMemo(() => {
    if (!listings) return [];
    return listings.filter((l) => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase());
      const matchesCounty = county === "all" || l.county === county;
      const matchesType = type === "all" || l.type === type;
      const matchesPrice = l.price <= maxPrice;
      return matchesSearch && matchesCounty && matchesType && matchesPrice;
    });
  }, [listings, search, county, type, maxPrice]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Browse Vacant Houses</h1>
        <p className="text-muted-foreground mt-1">Find your perfect home across Kenya</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">County</label>
            <Select value={county} onValueChange={setCounty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Property Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Max Price: KES {maxPrice.toLocaleString()}
            </label>
            <Slider
              value={[maxPrice]}
              onValueChange={([v]) => setMaxPrice(v)}
              max={200000}
              min={5000}
              step={5000}
              className="mt-3"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} houses found</p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No houses match your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCounty("all"); setType("all"); setMaxPrice(150000); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
