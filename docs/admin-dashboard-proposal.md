# 🎯 ADMIN DASHBOARD PROPOSAL FOR INNOVIABURST

**Date:** January 7, 2026  
**Project:** InnoviaBurst Admin Dashboard  
**Stack:** Vite + React + TypeScript + Tailwind + shadcn/ui + TanStack Query

---

## A) 🎨 DESIGN SYSTEM SNAPSHOT

### **Colors**
- **Primary (Orange accent)**: `hsl(24 95% 53%)` — CTAs, highlights, active states
- **Secondary (Deep Blue)**: `hsl(210 70% 45%)` — secondary actions
- **Accent (Cyan)**: `hsl(192 85% 50%)` — links, info states
- **Background (Dark)**: `hsl(215 30% 8%)` — page background
- **Card**: `hsl(215 30% 12%)` — elevated surfaces
- **Muted**: `hsl(215 25% 18%)` / `hsl(200 15% 60%)` — borders, disabled states
- **Foreground**: `hsl(200 20% 95%)` — primary text

### **Typography**
- **Font Family**: Inter (system fallback)
- **Scale**: Base 14px/0.875rem
  - Headings: 2xl (1.5rem), xl (1.25rem), lg (1.125rem)
  - Body: sm (0.875rem), xs (0.75rem)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### **Spacing Scale**
- Base: 1.5rem container padding
- Section: 3rem–6rem vertical rhythm
- Card padding: p-6 (1.5rem)
- Gap patterns: gap-4 (1rem), gap-6 (1.5rem), gap-8 (2rem)

### **Border Radius**
- Base: `--radius: 1rem`
- sm: `calc(var(--radius) - 8px)` = 0.5rem
- md: `calc(var(--radius) - 4px)` = 0.75rem
- lg: `var(--radius)` = 1rem
- xl: `calc(var(--radius) + 8px)` = 1.5rem

### **Shadows**
- sm: `0 1px 2px hsl(215 25% 15% / 0.04)`
- md: `0 4px 12px hsl(215 25% 15% / 0.06), 0 1px 3px hsl(215 25% 15% / 0.04)`
- lg: `0 10px 40px hsl(215 25% 15% / 0.08), 0 4px 12px hsl(215 25% 15% / 0.04)`
- orange: `0 4px 20px hsl(24 95% 53% / 0.3)` — for primary CTAs

### **Motion**
- Duration: 200ms default (`duration-200`)
- Easing: ease-in-out
- Hover lifts: `-translate-y-0.5`
- Respect `prefers-reduced-motion`

### **Component Do's & Don'ts**

✅ **DO:**
- Use `Card` for elevated surfaces with shadow-sm
- Use `Button` variants: `default` (orange), `secondary` (blue), `outline`, `ghost`
- Keep interactive targets ≥ 44×44px (`min-h-[44px]`)
- Use semantic HTML + correct heading hierarchy
- Provide i18n keys for all UI text (FR/EN)
- Keep focus rings visible (ring-2 ring-ring)

❌ **DON'T:**
- Mix button styles arbitrarily
- Remove focus outlines without replacement
- Create heavy nested layouts (prefer flat card grids)
- Hardcode text strings (use `t()` from i18n)
- Use custom shadows/colors outside theme tokens

---

## B) 🗺️ PROPOSED ROUTES + SITEMAP

```
/admin                          → AdminLayout wrapper (protected)
  ├─ /admin                     → Dashboard Overview (redirect to /admin/overview)
  ├─ /admin/overview            → Stats cards, recent activity, quick actions
  ├─ /admin/users               → Users table (super_admin only)
  ├─ /admin/partners            → Partners list + profiles
  ├─ /admin/clients             → Clients list + profiles
  ├─ /admin/projects            → Projects Kanban or table
  ├─ /admin/projects/:id        → Project detail + timeline + notes
  ├─ /admin/content             → Content management hub
  │   ├─ /admin/content/resources
  │   ├─ /admin/content/automations
  │   └─ /admin/content/offers
  └─ /admin/settings            → Account settings, notifications
```

### **Role-Based Navigation**
- `super_admin`: all routes
- `admin`: all except /admin/users
- `partner`: /admin/overview, /admin/projects (assigned), /admin/clients (assigned)
- `client`: /admin/overview, /admin/projects (own)

---

## C) 📁 FILE TREE CHANGES

```
src/
  types/
    admin.types.ts                    # NEW: User, Project, Client, Partner types
  
  hooks/
    useAuth.ts                        # NEW: Auth context + role checking
    usePermissions.ts                 # NEW: RBAC helper
  
  lib/
    auth.ts                           # NEW: Mock auth (or connect to backend)
    permissions.ts                    # NEW: Role permission mapping
  
  components/
    admin/
      layout/
        AdminLayout.tsx               # NEW: Sidebar + topbar
        AdminSidebar.tsx              # NEW: Collapsible sidebar with nav
        AdminTopbar.tsx               # NEW: Breadcrumbs + user menu
      
      guards/
        ProtectedRoute.tsx            # NEW: Auth guard
        RoleGuard.tsx                 # NEW: Role-based guard
      
      users/
        UsersTable.tsx                # NEW: Users list with shadcn Table
        UserRow.tsx                   # NEW: Table row component
        UserFilters.tsx               # NEW: Filter/search bar
        UserDialog.tsx                # NEW: Create/edit user modal
      
      projects/
        ProjectsKanban.tsx            # NEW: Kanban board (or table)
        ProjectCard.tsx               # NEW: Project card for Kanban
        ProjectFilters.tsx            # NEW: Filters + search
        ProjectDialog.tsx             # NEW: Create/edit project modal
        ProjectTimeline.tsx           # NEW: Timeline view for project detail
        ProjectNotes.tsx              # NEW: Notes section
      
      clients/
        ClientsTable.tsx              # NEW: Clients list
        ClientDialog.tsx              # NEW: Create/edit client modal
      
      dashboard/
        StatsCard.tsx                 # NEW: Metric card (count, trend)
        RecentActivity.tsx            # NEW: Activity feed
        QuickActions.tsx              # NEW: CTA grid
  
  pages/
    admin/
      AdminDashboard.tsx              # NEW: Overview page
      AdminUsers.tsx                  # NEW: Users management
      AdminProjects.tsx               # NEW: Projects list/Kanban
      AdminProjectDetail.tsx          # NEW: Project detail view
      AdminClients.tsx                # NEW: Clients management
      AdminPartners.tsx               # NEW: Partners management
      AdminContent.tsx                # NEW: Content management hub
      AdminSettings.tsx               # NEW: Settings page
  
  App.tsx                             # EDIT: Add admin routes
  i18n/en.json                        # EDIT: Add admin i18n keys
  i18n/fr.json                        # EDIT: Add admin i18n keys
```

---

## D) 💻 CODE SNIPPETS — KEY SCAFFOLDING

### **1. TypeScript Types** (`src/types/admin.types.ts`)

```typescript
export type UserRole = "super_admin" | "admin" | "partner" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface PartnerProfile {
  id: string;
  userId: string;
  companyName: string;
  expertise: string[];
  projects: string[]; // project IDs
}

export interface ClientProfile {
  id: string;
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  businessSector?: string;
  address?: string;
}

export type ProjectStatus = "pending" | "accepted" | "refused";
export type ProjectPhase = "discovery" | "dev" | "testing" | "deployed" | "done" | "maintenance";

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  suggestedBy?: string; // partner or admin user ID
  status: ProjectStatus;
  phase?: ProjectPhase;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectNote {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface ProjectTimelineEvent {
  id: string;
  projectId: string;
  type: "status_change" | "phase_change" | "note" | "milestone";
  title: string;
  description?: string;
  timestamp: Date;
}

export type ContentType = "resource" | "automation" | "offer";

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
```

---

### **2. Auth Hook** (`src/hooks/useAuth.ts`)

```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/types/admin.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const MOCK_USER: User = {
  id: "1",
  email: "admin@innoviaburst.com",
  name: "Admin User",
  role: "super_admin",
  isActive: true,
  createdAt: new Date(),
  lastLogin: new Date(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login — replace with real API call
    if (email && password) {
      setUser(MOCK_USER);
      localStorage.setItem("admin_user", JSON.stringify(MOCK_USER));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
  };

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

---

### **3. Protected Route Guard** (`src/components/admin/guards/ProtectedRoute.tsx`)

```typescript
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
```

---

### **4. Admin Layout** (`src/components/admin/layout/AdminLayout.tsx`)

```typescript
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

### **5. Admin Sidebar** (`src/components/admin/layout/AdminSidebar.tsx`)

```typescript
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  UserCog,
  Building2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/innoviaburst-logo.png";

const navItems = [
  { icon: LayoutDashboard, labelKey: "admin.nav.overview", href: "/admin/overview", roles: ["super_admin", "admin", "partner", "client"] },
  { icon: Users, labelKey: "admin.nav.users", href: "/admin/users", roles: ["super_admin"] },
  { icon: UserCog, labelKey: "admin.nav.partners", href: "/admin/partners", roles: ["super_admin", "admin"] },
  { icon: Building2, labelKey: "admin.nav.clients", href: "/admin/clients", roles: ["super_admin", "admin", "partner"] },
  { icon: FolderKanban, labelKey: "admin.nav.projects", href: "/admin/projects", roles: ["super_admin", "admin", "partner", "client"] },
  { icon: FileText, labelKey: "admin.nav.content", href: "/admin/content", roles: ["super_admin", "admin"] },
  { icon: Settings, labelKey: "admin.nav.settings", href: "/admin/settings", roles: ["super_admin", "admin", "partner", "client"] },
];

export function AdminSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { hasRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter((item) => hasRole(item.roles));

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        <img src={logo} alt="InnoviaBurst" className={cn("transition-all", collapsed ? "w-8" : "w-10")} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors min-h-[44px]",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive && "bg-primary text-primary-foreground hover:bg-orange-dark"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
}
```

---

### **6. Admin Topbar** (`src/components/admin/layout/AdminTopbar.tsx`)

```typescript
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";

export function AdminTopbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Breadcrumbs or page title could go here */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">{t("admin.title")}</h1>
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 min-h-[44px]">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            {t("admin.menu.profile")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            {t("admin.menu.settings")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("admin.menu.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
```

---

### **7. Example Page: Users Table** (`src/pages/admin/AdminUsers.tsx`)

```typescript
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/admin.types";

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Admin",
    email: "alice@innoviaburst.com",
    role: "super_admin",
    isActive: true,
    createdAt: new Date("2025-01-01"),
    lastLogin: new Date("2026-01-07"),
  },
  {
    id: "2",
    name: "Bob Partner",
    email: "bob@partner.com",
    role: "partner",
    isActive: true,
    createdAt: new Date("2025-02-15"),
    lastLogin: new Date("2026-01-06"),
  },
  // Add more mock users...
];

export default function AdminUsers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin.users.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("admin.users.subtitle")}</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.users.addUser")}
        </Button>
      </div>

      {/* Filters card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("admin.users.filters.title")}</CardTitle>
          <CardDescription>{t("admin.users.filters.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.users.filters.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* Add more filters: role select, status toggle, etc. */}
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.users.table.name")}</TableHead>
              <TableHead>{t("admin.users.table.email")}</TableHead>
              <TableHead>{t("admin.users.table.role")}</TableHead>
              <TableHead>{t("admin.users.table.status")}</TableHead>
              <TableHead>{t("admin.users.table.lastLogin")}</TableHead>
              <TableHead className="text-right">{t("admin.users.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? t("admin.users.status.active") : t("admin.users.status.inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.lastLogin?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    {t("admin.users.actions.edit")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

---

### **8. Example Page: Projects Kanban** (`src/pages/admin/AdminProjects.tsx`)

```typescript
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project, ProjectPhase } from "@/types/admin.types";

const phases: ProjectPhase[] = ["discovery", "dev", "testing", "deployed", "done", "maintenance"];

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Automation",
    description: "Automate order processing",
    clientId: "c1",
    status: "accepted",
    phase: "dev",
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2026-01-05"),
  },
  {
    id: "2",
    title: "CRM Integration",
    description: "Connect HubSpot with internal tools",
    clientId: "c2",
    status: "accepted",
    phase: "testing",
    createdAt: new Date("2025-11-15"),
    updatedAt: new Date("2026-01-03"),
  },
  // More mock projects...
];

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects] = useState(mockProjects);

  const projectsByPhase = phases.reduce((acc, phase) => {
    acc[phase] = projects.filter((p) => p.phase === phase);
    return acc;
  }, {} as Record<ProjectPhase, Project[]>);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin.projects.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("admin.projects.subtitle")}</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.projects.addProject")}
        </Button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {phases.map((phase) => (
          <div key={phase} className="min-w-[280px]">
            <Card className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {t(`admin.projects.phase.${phase}`)}
                </CardTitle>
                <CardDescription className="text-xs">
                  {projectsByPhase[phase].length} {t("admin.projects.projectCount")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectsByPhase[phase].map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium line-clamp-1">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.status === "accepted" ? "default" : "secondary"} className="text-xs">
                          {t(`admin.projects.status.${project.status}`)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **9. App.tsx Updates** (add admin routes)

```typescript
// Add to imports
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
// ... other admin pages

// Import guards
import { ProtectedRoute } from "@/components/admin/guards/ProtectedRoute";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

// Add to Routes
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="/admin/overview" replace />} />
  <Route path="overview" element={<AdminDashboard />} />
  <Route
    path="users"
    element={
      <ProtectedRoute requiredRole="super_admin">
        <AdminUsers />
      </ProtectedRoute>
    }
  />
  <Route path="projects" element={<AdminProjects />} />
  {/* Add more admin routes */}
</Route>
```

---

### **10. i18n Keys** (partial `src/i18n/en.json`)

```json
{
  "admin": {
    "title": "Admin Dashboard",
    "nav": {
      "overview": "Overview",
      "users": "Users",
      "partners": "Partners",
      "clients": "Clients",
      "projects": "Projects",
      "content": "Content",
      "settings": "Settings"
    },
    "menu": {
      "profile": "Profile",
      "settings": "Settings",
      "logout": "Logout"
    },
    "users": {
      "title": "User Management",
      "subtitle": "Manage system users and permissions",
      "addUser": "Add User",
      "filters": {
        "title": "Filters",
        "description": "Search and filter users",
        "search": "Search by name or email..."
      },
      "table": {
        "name": "Name",
        "email": "Email",
        "role": "Role",
        "status": "Status",
        "lastLogin": "Last Login",
        "actions": "Actions"
      },
      "status": {
        "active": "Active",
        "inactive": "Inactive"
      },
      "actions": {
        "edit": "Edit"
      }
    },
    "projects": {
      "title": "Projects",
      "subtitle": "Manage client projects and pipelines",
      "addProject": "New Project",
      "projectCount": "projects",
      "phase": {
        "discovery": "Discovery",
        "dev": "Development",
        "testing": "Testing",
        "deployed": "Deployed",
        "done": "Done",
        "maintenance": "Maintenance"
      },
      "status": {
        "pending": "Pending",
        "accepted": "Accepted",
        "refused": "Refused"
      }
    }
  }
}
```

Add equivalent keys to `src/i18n/fr.json`.

---

## E) ⚠️ RISKS / ASSUMPTIONS

### **Assumptions**
1. **Auth is mocked**: Current implementation uses localStorage. Replace with real backend API.
2. **No database**: Mock data is used. Connect to real API/DB.
3. **TanStack Query**: Already in `package.json`, ready for data fetching.
4. **Dark mode only**: Design snapshot assumes dark theme (can extend light mode tokens).
5. **Permissions logic**: Simplified RBAC. Expand as needed for complex workflows.

### **Risks**
1. **Route conflicts**: Ensure `/admin/*` routes don't clash with existing public routes.
2. **i18n completeness**: Must add ALL admin keys to both `en.json` and `fr.json`.
3. **Mobile responsiveness**: Sidebar needs responsive treatment (drawer on mobile).
4. **Performance**: Kanban with many projects may need virtualization (react-window or similar).
5. **Security**: Auth guard is minimal. Add JWT validation, refresh tokens, CSRF protection.

### **Next Steps**
1. Scaffold files according to file tree
2. Add i18n keys for FR/EN
3. Test routing + guards
4. Connect to backend API (replace mock data)
5. Add mobile-responsive sidebar (drawer)
6. Implement real auth (JWT or similar)
7. Add tests for guards + permissions

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Create `src/types/admin.types.ts`
- [ ] Create `src/hooks/useAuth.ts` + `AuthProvider`
- [ ] Create `src/components/admin/guards/ProtectedRoute.tsx`
- [ ] Create `src/components/admin/layout/AdminLayout.tsx`
- [ ] Create `src/components/admin/layout/AdminSidebar.tsx`
- [ ] Create `src/components/admin/layout/AdminTopbar.tsx`
- [ ] Create `src/pages/admin/AdminUsers.tsx`
- [ ] Create `src/pages/admin/AdminProjects.tsx`
- [ ] Create `src/pages/admin/AdminDashboard.tsx`
- [ ] Update `src/App.tsx` with admin routes
- [ ] Add i18n keys to `src/i18n/en.json`
- [ ] Add i18n keys to `src/i18n/fr.json`
- [ ] Test auth flow (login → protected route → logout)
- [ ] Test role guards (super_admin vs. partner)
- [ ] Mobile responsive sidebar (convert to drawer < md)
- [ ] Connect to real API (remove mock data)

---

## 🎉 CONCLUSION

This Admin Dashboard proposal strictly follows the existing InnoviaBurst design system:
- **Dark theme** with orange/cyan/blue palette
- **shadcn/ui components** (Card, Button, Table, Badge, etc.)
- **Tailwind utility patterns** matching the existing codebase
- **i18n-first** approach with FR/EN support
- **Accessibility** standards (≥44px targets, focus rings, semantic HTML)
- **RBAC** with role-based navigation and protected routes

The architecture is **scalable**, **type-safe**, and **conversion-focused**, maintaining the premium feel of the InnoviaBurst brand.

**Ready to implement!** 🚀
