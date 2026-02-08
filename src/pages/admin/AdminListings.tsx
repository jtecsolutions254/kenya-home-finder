import { useState } from "react";
import { useAllListings, useUpdateListingStatus, useDeleteListing } from "@/hooks/useListings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  pending: "bg-accent/20 text-accent-foreground border-accent",
  approved: "bg-secondary/20 text-secondary border-secondary",
  rejected: "bg-destructive/20 text-destructive border-destructive",
};

const AdminListings = () => {
  const { data: listings, isLoading } = useAllListings();
  const updateStatus = useUpdateListingStatus();
  const deleteListing = useDeleteListing();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = listings?.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) ?? [];

  const handleApprove = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "approved" });
      toast.success("Listing approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: "rejected" });
      toast.success("Listing rejected");
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteListing.mutateAsync(id);
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Manage Listings</h1>
        <p className="text-muted-foreground text-sm">Review, approve, and manage property listings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No listings found</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {listing.location}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    KES {listing.price.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[listing.status]}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {listing.status !== "approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(listing.id)}
                          disabled={updateStatus.isPending}
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                        </Button>
                      )}
                      {listing.status !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(listing.id)}
                          disabled={updateStatus.isPending}
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{listing.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(listing.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminListings;
