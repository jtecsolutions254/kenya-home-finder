import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PostListing from "./pages/PostListing";
import ListingDetail from "./pages/ListingDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminListings from "./pages/admin/AdminListings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

const queryClient = new QueryClient();

/* ✅ Public layout with Navbar & Footer */
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <HashRouter>
        <AuthProvider>
          <Routes>

            {/* Admin routes — NO Navbar/Footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="listings" element={<AdminListings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/post" element={<PostListing />} />
              <Route path="/auth" element={<Auth />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
