-- Add contact fields to listings table so each listing stores owner's contact info
ALTER TABLE public.listings ADD COLUMN contact_phone text;
ALTER TABLE public.listings ADD COLUMN contact_email text;