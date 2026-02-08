import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, Home, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ListingCard from "@/components/ListingCard";
import { mockListings, counties } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const featured = mockListings.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-background leading-tight mb-4">
              Find Your Perfect <span className="text-accent">Home</span> in Kenya
            </h1>
            <p className="text-background/80 text-lg md:text-xl mb-8 font-body">
              Browse thousands of vacant houses across Kenya. Post your property or find your dream home today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 bg-background/95 backdrop-blur-sm p-3 rounded-xl shadow-xl">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by location..."
                  className="pl-9 border-0 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/browse">
                <Button className="gap-2 w-full sm:w-auto">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "2,500+", label: "Active Listings" },
            { value: "47", label: "Counties Covered" },
            { value: "15K+", label: "Happy Tenants" },
            { value: "4.8★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">Featured Listings</h2>
              <p className="text-muted-foreground mt-1">Hand-picked homes just for you</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Search", desc: "Browse vacant houses by location, price, and amenities across Kenya." },
              { icon: Home, title: "Visit & Choose", desc: "Schedule visits, compare options, and pick the perfect home for you." },
              { icon: Shield, title: "Move In Safely", desc: "Verified listings and secure processes ensure a smooth move-in." },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular locations */}
      <section className="py-16">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-8">Popular Locations</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {counties.map((county) => (
              <Link key={county} to="/browse">
                <Button variant="outline" className="gap-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5" /> {county}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
            Have a Vacant House?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            List it for free and reach thousands of potential tenants across Kenya.
          </p>
          <Link to="/post">
            <Button variant="secondary" size="lg" className="gap-2">
              <Users className="w-4 h-4" /> Post Your House
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
