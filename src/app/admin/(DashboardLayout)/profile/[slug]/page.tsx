'use client'

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import PageContainer from "../../components/container/PageContainer";
import DashboardCard from "../../components/shared/DashboardCard";
import Blog from "../../components/profile/Blog";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "ADMIN" | "EDITOR" | "USER" | "VIEWER";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarBase64: string | null;
}

interface SavePayload {
  name: string;
  email: string;
  role: UserRole;
  avatarBase64: string | null;
  password?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<
  UserRole,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  ADMIN: "error",
  EDITOR: "primary",
  USER: "success",
  VIEWER: "default",
};

const ROLES: UserRole[] = ["ADMIN", "EDITOR", "USER", "VIEWER"];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── ProfileHeader ────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  user: UserProfile;
  saving: boolean;
  isOwn: boolean;
  canEdit: boolean;
  onSave: (patch: SavePayload) => Promise<void>;
}

const ProfileHeader = ({ user, saving, isOwn, canEdit, onSave }: ProfileHeaderProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(user.avatarBase64);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Синхронізація коли user оновився ззовні (після збереження)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setAvatarBase64(user.avatarBase64);
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarBase64(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (password && password !== confirmPassword) {
      setPasswordError("Паролі не співпадають");
      return;
    }
    setPasswordError("");
    onSave({
      name,
      email,
      role,
      avatarBase64,
      ...(password ? { password } : {}),
    });
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <DashboardCard>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "160px 1fr" },
          gap: 4,
        }}
      >
        {/* Avatar */}
        <Stack alignItems="center" spacing={2}>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: avatarBase64 ? "primary.main" : "grey.300",
              borderRadius: "50%",
              p: "4px",
              cursor: canEdit ? "pointer" : "default",
            }}
            onClick={() => canEdit && document.getElementById("avatar-upload")?.click()}
          >
            <Avatar
              src={avatarBase64 ?? undefined}
              sx={{ width: 120, height: 120 }}
            >
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
          </Box>

          {canEdit && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                {avatarBase64 ? "Change photo" : "Add photo"}
              </Button>

              {avatarBase64 && (
                <Button
                  variant="text"
                  size="small"
                  color="error"
                  onClick={() => setAvatarBase64(null)}
                >
                  Видалити фото
                </Button>
              )}

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </>
          )}
        </Stack>

        {/* Fields */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={3} flexWrap="wrap">
            <Typography variant="h4" fontWeight={700} flex={1}>
              {user.name}
            </Typography>
            <Chip label={user.role} color={ROLE_COLORS[user.role]} size="small" />
          </Stack>

          {canEdit ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={email}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled
                  >
                    {ROLES.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* spacer */}
                <Box />

                <TextField
                  fullWidth
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to not change"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                      >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                      </IconButton>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                />
              </Box>

              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving}
                  size="large"
                >
                  {saving
                    ? <CircularProgress size={20} sx={{ color: "#fff" }} />
                    : "Save changes"}
                </Button>
              </Stack>
            </>
          ) : (
            // Чужий профіль — тільки перегляд
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Stack>
          )}
        </Box>
      </Box>
    </DashboardCard>
  );
};

// ─── ProfilePage ──────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const params = useParams();
  const slugParam = params?.slug as string | undefined;

  const [me, setMe] = useState<{ id: string; role: UserRole } | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // ✅ isOwn першим — canEdit залежить від нього
  const isOwn = !slugParam || (me !== null && slugParam === me.id);

  const canEdit =
    isOwn ||
    (me?.role === "ADMIN" && user?.role !== "ADMIN");

  const notify = (message: string, severity: "success" | "error" = "success") =>
    setSnackbar({ open: true, message, severity });

  useEffect(() => {
    const load = async () => {
      try {
        // Завжди тягнемо себе щоб знати свій id
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!meRes.ok) return;
        const meData = await meRes.json();
        setMe({ id: String(meData.id), role: meData.role });

        // Якщо є slug і це не наш id — тягнемо чужий профіль
        const targetId = slugParam && slugParam !== String(meData.id)
          ? slugParam
          : null;

        if (targetId) {
          const userRes = await fetch(`${BASE_URL}/api/users/${targetId}`, {
            credentials: "include",
          });
          if (!userRes.ok) return;
          const userData = await userRes.json();
          setUser({
            id: String(userData.id),
            name: userData.name ?? "",
            email: userData.email ?? "",
            role: (userData.role as UserRole) ?? "USER",
            avatarBase64: userData.avatarUrl ?? null,
          });
        } else {
          // Власний профіль
          setUser({
            id: String(meData.id),
            name: meData.name ?? "",
            email: meData.email ?? "",
            role: (meData.role as UserRole) ?? "USER",
            avatarBase64: meData.avatarUrl ?? null,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [slugParam]);

  const handleSave = async (patch: SavePayload) => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: patch.name,
          email: patch.email,
          avatarBase64: patch.avatarBase64,
          ...(patch.password ? { password: patch.password } : {}),
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      // Роль — окремий endpoint
      if (patch.role !== user.role) {
        const roleRes = await fetch(`${BASE_URL}/api/users/${user.id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ role: patch.role }),
        });
        if (!roleRes.ok) throw new Error(await roleRes.text());
      }

      setUser((prev) =>
        prev
          ? { ...prev, name: patch.name, email: patch.email, role: patch.role, avatarBase64: patch.avatarBase64 }
          : prev
      );

      notify("Профіль збережено");
    } catch (err: any) {
      notify(err?.message ?? "Помилка збереження", "error");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <PageContainer title="Profile" description="User profile page">
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer title="Profile" description="User profile page">
        <Box display="flex" justifyContent="center" mt={8}>
          <Typography color="error">Не вдалося завантажити профіль</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Profile" description="User profile page">
      <Box>
        <ProfileHeader
          user={user}
          saving={saving}
          isOwn={isOwn}
          canEdit={canEdit}
          onSave={handleSave}
        />

        {/* Тут можна розкоментувати Stats / About / Activity / Blog */}
        {/*
        <Box mt={3}>
          <ProfileStats />
        </Box>
        <Box mt={3} display="grid" gridTemplateColumns={{ xs: "1fr", lg: "1fr 2fr" }} gap={3}>
          <ProfileAbout user={user} />
          <ProfileActivity />
        </Box>
                */}
        {/* <Box mt={3}>
          <Blog />
        </Box> */}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ProfilePage;