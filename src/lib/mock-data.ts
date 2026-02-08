export interface Listing {
  id: string;
  title: string;
  location: string;
  county: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  image: string;
  amenities: string[];
  description: string;
  owner: string;
  postedAt: string;
  rating: number;
}

export const counties = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret",
  "Kiambu", "Machakos", "Kajiado", "Nyeri", "Thika",
];

export const propertyTypes = [
  "Apartment", "Bungalow", "Maisonette", "Bedsitter", "Studio",
  "Villa", "Townhouse",
];

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Modern 2BR Apartment in Westlands",
    location: "Westlands, Nairobi",
    county: "Nairobi",
    price: 35000,
    bedrooms: 2,
    bathrooms: 2,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    amenities: ["Parking", "Security", "Gym", "Pool"],
    description: "A spacious modern apartment with stunning city views.",
    owner: "James Mwangi",
    postedAt: "2 days ago",
    rating: 4.5,
  },
  {
    id: "2",
    title: "Cozy Bedsitter in Kilimani",
    location: "Kilimani, Nairobi",
    county: "Nairobi",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    type: "Bedsitter",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    amenities: ["Security", "Water"],
    description: "Perfect starter home in a prime location.",
    owner: "Sarah Wanjiku",
    postedAt: "5 days ago",
    rating: 4.0,
  },
  {
    id: "3",
    title: "Spacious 3BR Maisonette in Syokimau",
    location: "Syokimau, Machakos",
    county: "Machakos",
    price: 45000,
    bedrooms: 3,
    bathrooms: 3,
    type: "Maisonette",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    amenities: ["Parking", "Garden", "Security", "Backup Water"],
    description: "Family-friendly home with a beautiful garden.",
    owner: "Peter Ochieng",
    postedAt: "1 week ago",
    rating: 4.8,
  },
  {
    id: "4",
    title: "Studio Apartment in Nyali",
    location: "Nyali, Mombasa",
    county: "Mombasa",
    price: 20000,
    bedrooms: 1,
    bathrooms: 1,
    type: "Studio",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    amenities: ["Ocean View", "Pool", "Security"],
    description: "Beach-side living at its finest.",
    owner: "Amina Hassan",
    postedAt: "3 days ago",
    rating: 4.3,
  },
  {
    id: "5",
    title: "4BR Villa in Karen",
    location: "Karen, Nairobi",
    county: "Nairobi",
    price: 120000,
    bedrooms: 4,
    bathrooms: 4,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
    amenities: ["Parking", "Garden", "Pool", "Staff Quarters", "Security"],
    description: "Luxurious villa in the heart of Karen with lush gardens.",
    owner: "David Kimani",
    postedAt: "1 day ago",
    rating: 4.9,
  },
  {
    id: "6",
    title: "2BR Apartment in Milimani",
    location: "Milimani, Kisumu",
    county: "Kisumu",
    price: 25000,
    bedrooms: 2,
    bathrooms: 1,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    amenities: ["Parking", "Security", "Backup Water"],
    description: "Well-maintained apartment near the lake.",
    owner: "Grace Akinyi",
    postedAt: "4 days ago",
    rating: 4.2,
  },
];
