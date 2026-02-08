import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) return false;
      return data as boolean;
    },
    enabled: !!user,
  });
};

export const useAllProfiles = () => {
  return useQuery({
    queryKey: ["profiles", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [listingsRes, profilesRes, inquiriesRes] = await Promise.all([
        supabase.from("listings").select("id, status, created_at"),
        supabase.from("profiles").select("id, user_type, created_at"),
        supabase.from("listing_inquiries").select("id, created_at"),
      ]);

      const listings = listingsRes.data || [];
      const profiles = profilesRes.data || [];
      const inquiries = inquiriesRes.data || [];

      return {
        totalListings: listings.length,
        pendingListings: listings.filter((l) => l.status === "pending").length,
        approvedListings: listings.filter((l) => l.status === "approved").length,
        rejectedListings: listings.filter((l) => l.status === "rejected").length,
        totalUsers: profiles.length,
        owners: profiles.filter((p) => p.user_type === "owner").length,
        seekers: profiles.filter((p) => p.user_type === "seeker").length,
        totalInquiries: inquiries.length,
        recentListings: listings.slice(0, 5),
        recentUsers: profiles.slice(0, 5),
      };
    },
  });
};
