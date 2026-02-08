import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Home, Users } from "lucide-react";

const AdminAnalytics = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Platform statistics overview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const totalListings = stats?.totalListings ?? 0;
  const approvedListings = stats?.approvedListings ?? 0;
  const approvalRate = totalListings > 0 ? Math.round((approvedListings / totalListings) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Platform performance and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Listings breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Home className="w-4 h-4" /> Listings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Approved</span>
                  <span className="font-medium">{stats?.approvedListings ?? 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all"
                    style={{
                      width: totalListings > 0
                        ? `${((stats?.approvedListings ?? 0) / totalListings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pending</span>
                  <span className="font-medium">{stats?.pendingListings ?? 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{
                      width: totalListings > 0
                        ? `${((stats?.pendingListings ?? 0) / totalListings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rejected</span>
                  <span className="font-medium">{stats?.rejectedListings ?? 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full transition-all"
                    style={{
                      width: totalListings > 0
                        ? `${((stats?.rejectedListings ?? 0) / totalListings) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" /> Users Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Property Owners</span>
                <span className="font-heading text-xl font-bold text-primary">
                  {stats?.owners ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">House Seekers</span>
                <span className="font-heading text-xl font-bold text-secondary">
                  {stats?.seekers ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">Total</span>
                <span className="font-heading text-xl font-bold">
                  {stats?.totalUsers ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" /> Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <circle
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  className="stroke-secondary"
                  strokeWidth="3"
                  strokeDasharray={`${approvalRate} ${100 - approvalRate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-2xl font-bold">{approvalRate}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {approvedListings} of {totalListings} listings approved
            </p>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4" /> Platform Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Listings</span>
                <span className="font-medium">{stats?.totalListings ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-medium">{stats?.totalUsers ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Inquiries</span>
                <span className="font-medium">{stats?.totalInquiries ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg Inquiries / Listing</span>
                <span className="font-medium">
                  {totalListings > 0
                    ? ((stats?.totalInquiries ?? 0) / totalListings).toFixed(1)
                    : "0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
