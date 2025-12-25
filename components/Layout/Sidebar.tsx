"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  AccountBalance,
  Category,
  Description,
  RequestQuote,
  Payment,
  Adjust,
  Assessment,
  Gavel,
  Analytics,
  TrendingUp,
} from "@mui/icons-material";
import { useStore } from "@/store/useStore";
import { getModulesByRole } from "@/utils/permissions";

const drawerWidth = 260;

const getModuleIcon = (module: string) => {
  switch (module) {
    case "Dashboard":
      return <Dashboard />;
    case "Admins":
    case "Bank Employees":
      return <People />;
    case "Regulators":
      return <Gavel />;
    case "Banks":
      return <AccountBalance />;
    case "Accounts":
      return <AccountBalance />;
    case "Loan Categories":
      return <Category />;
    case "Loan Products":
      return <Description />;
    case "Loan Applications":
      return <Description />;
    case "Loan Application Requests":
      return <RequestQuote />;
    case "Loan Disbursements":
      return <Payment />;
    case "Loan Adjustments":
      return <Adjust />;
    case "Reports":
      return <Assessment />;
    case "Analytics":
      return <Analytics />;
    default:
      return <Dashboard />;
  }
};

const getModulePath = (module: string): string => {
  const pathMap: Record<string, string> = {
    Dashboard: "/dashboard",
    Admins: "/admins",
    Regulators: "/regulators",
    Banks: "/banks",
    "Bank Employees": "/bank-employees",
    Accounts: "/accounts",
    "Loan Categories": "/loan-categories",
    "Loan Products": "/loan-products",
    "Loan Applications": "/loan-applications",
    "Loan Application Requests": "/loan-application-requests",
    "Loan Disbursements": "/loan-disbursements",
    "Loan Adjustments": "/loan-adjustments",
    Reports: "/reports",
    Analytics: "/analytics",
  };
  return pathMap[module] || "/dashboard";
};

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!currentUser) return null;

  const modules = getModulesByRole(currentUser.role);

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TrendingUp sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            LMS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {modules.map((module) => {
          const path = getModulePath(module);
          const isActive = pathname === path;

          return (
            <ListItem key={module} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  router.push(path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "inherit",
                  }}
                >
                  {getModuleIcon(module)}
                </ListItemIcon>
                <ListItemText primary={module} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
