import { useState } from "react";
import { useAllProfiles, useAllUserRoles, useUpdateUserType, useUpdateUserRole } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
type UserType = Database["public"]["Enums"]["user_type"];

const AdminUsers = () => {
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles();
  const { data: userRoles, isLoading: rolesLoading } = useAllUserRoles();
  const updateUserType = useUpdateUserType();
  const updateUserRole = useUpdateUserRole();
  const [search, setSearch] = useState("");

  const isLoading = profilesLoading || rolesLoading;

  const filtered = profiles?.filter((p) =>
    (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || "").includes(search)
  ) ?? [];

  const getRoleForUser = (userId: string): AppRole => {
    const role = userRoles?.find((r) => r.user_id === userId);
    return role?.role ?? "user";
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUserTypeChange = (profileId: string, userType: UserType) => {
    updateUserType.mutate(
      { profileId, userType },
      {
        onSuccess: () => toast.success("User type updated"),
        onError: () => toast.error("Failed to update user type"),
      }
    );
  };

  const handleRoleChange = (userId: string, role: AppRole) => {
    updateUserRole.mutate(
      { userId, role },
      {
        onSuccess: () => toast.success("Role updated"),
        onError: () => toast.error("Failed to update role"),
      }
    );
  };

  const roleBadgeClass = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "moderator":
        return "bg-accent/20 text-accent-foreground border-accent/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground text-sm">View and manage registered users, assign roles and types</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((profile) => {
                const currentRole = getRoleForUser(profile.user_id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {profile.full_name || "Unnamed"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {profile.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={profile.user_type}
                        onValueChange={(v) => handleUserTypeChange(profile.id, v as UserType)}
                      >
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="seeker">Seeker</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={currentRole}
                        onValueChange={(v) => handleRoleChange(profile.user_id, v as AppRole)}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                          <Badge variant="outline" className={roleBadgeClass(currentRole)}>
                            {currentRole}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDate(profile.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
