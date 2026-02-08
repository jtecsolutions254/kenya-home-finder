import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ListingStatus = Database["public"]["Enums"]["listing_status"];

export interface DbListing {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  location: string;
  county: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  amenities: string[];
  images: string[];
  status: ListingStatus;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export const useApprovedListings = () => {
  return useQuery({
    queryKey: ["listings", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbListing[];
    },
  });
};

export const useListingById = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as DbListing | null;
    },
    enabled: !!id,
  });
};

export const useAllListings = () => {
  return useQuery({
    queryKey: ["listings", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbListing[];
    },
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing: {
      owner_id: string;
      title: string;
      description: string;
      location: string;
      county: string;
      price: number;
      bedrooms: number;
      bathrooms: number;
      type: string;
      amenities: string[];
      images: string[];
    }) => {
      const { data, error } = await supabase
        .from("listings")
        .insert(listing)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useUpdateListingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ListingStatus }) => {
      const { error } = await supabase
        .from("listings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useCreateInquiry = () => {
  return useMutation({
    mutationFn: async (inquiry: {
      listing_id: string;
      sender_name: string;
      sender_email: string;
      sender_phone?: string;
      message: string;
      sender_id?: string;
    }) => {
      const { error } = await supabase
        .from("listing_inquiries")
        .insert(inquiry);
      if (error) throw error;
    },
  });
};

export const uploadListingImages = async (
  userId: string,
  files: File[]
): Promise<string[]> => {
  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("listing-images")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(path);
    urls.push(urlData.publicUrl);
  }
  return urls;
};
