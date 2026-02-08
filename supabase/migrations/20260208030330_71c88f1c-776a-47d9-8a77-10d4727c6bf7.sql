
-- Create listing status enum
CREATE TYPE public.listing_status AS ENUM ('pending', 'approved', 'rejected');

-- Create listings table
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  county TEXT NOT NULL,
  price INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  type TEXT NOT NULL DEFAULT 'Apartment',
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status listing_status NOT NULL DEFAULT 'pending',
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view approved listings
CREATE POLICY "Anyone can view approved listings"
ON public.listings
FOR SELECT
USING (status = 'approved');

-- Owners can view their own listings regardless of status
CREATE POLICY "Owners can view own listings"
ON public.listings
FOR SELECT
USING (auth.uid() = owner_id);

-- Authenticated users can create listings
CREATE POLICY "Authenticated users can create listings"
ON public.listings
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own listings
CREATE POLICY "Owners can update own listings"
ON public.listings
FOR UPDATE
USING (auth.uid() = owner_id);

-- Owners can delete their own listings
CREATE POLICY "Owners can delete own listings"
ON public.listings
FOR DELETE
USING (auth.uid() = owner_id);

-- Admins can do everything with listings
CREATE POLICY "Admins can manage all listings"
ON public.listings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create contacts/inquiries table
CREATE TABLE public.listing_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listing_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can create an inquiry
CREATE POLICY "Anyone can create inquiries"
ON public.listing_inquiries
FOR INSERT
WITH CHECK (true);

-- Listing owners can view inquiries on their listings
CREATE POLICY "Owners can view inquiries on their listings"
ON public.listing_inquiries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = listing_inquiries.listing_id
    AND listings.owner_id = auth.uid()
  )
);

-- Admins can view all inquiries
CREATE POLICY "Admins can manage all inquiries"
ON public.listing_inquiries
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add listing_status enum to constants
