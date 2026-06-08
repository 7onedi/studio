'use client'

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
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
import { IconEye, IconEyeOff, IconEdit } from "@tabler/icons-react";
import PageContainer from "../../components/container/PageContainer";
import DashboardCard from "../../components/shared/DashboardCard";
import Blog from "../../components/profile/Blog";
import router from "next/dist/shared/lib/router/router";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = "ADMIN" | "EDITOR" | "USER" | "OWNER";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarId: number | null;      // замість avatarBase64
  avatarUrl: string | null;
}

interface SavePayload {
  name: string;
  email: string;
  role: UserRole;
  avatarId: number | null;      // замість avatarBase64
  avatarUrl: string | null;     // для відображення
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
  OWNER: "secondary",
};

const ROLES: UserRole[] = ["ADMIN", "EDITOR", "USER"];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── ProfileHeader ────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  user: UserProfile;
  saving: boolean;
  isOwn: boolean;
  canEdit: boolean;
  editing: boolean;
  isCreate?: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  onSave: (patch: SavePayload) => Promise<void>;
}

const ProfileHeader = ({ user, saving, isOwn, canEdit, editing, isCreate, onEditStart, onEditEnd, onSave }: ProfileHeaderProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [avatarId, setAvatarId] = useState<number | null>(user.avatarId);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Синхронізація коли user оновився ззовні (після збереження)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setAvatarUrl(user.avatarUrl);
    setAvatarId(user.avatarId);
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/media", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());

      const uploaded = await res.json(); // { id, url }
      setAvatarId(uploaded.id);
      setAvatarUrl(uploaded.url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = () => {
    if (isCreate && !password) {
      setPasswordError('Password is required');
      return;
    }
    if (password && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (password && password !== confirmPassword) {
      setPasswordError("Паролі не співпадають");
      return;
    }
    setPasswordError("");
    onSave({ name, email, role, avatarId, avatarUrl, ...(password ? { password } : {}) });
    setPassword("");
    setConfirmPassword("");
    onEditEnd();
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
              borderColor: avatarUrl ? "primary.main" : "grey.300",
              borderRadius: "50%",
              p: "4px",
              cursor: canEdit ? "pointer" : "default",
              position: "relative",
            }}
            onClick={() => canEdit && !avatarUploading && document.getElementById("avatar-upload")?.click()}
          >
            <Avatar src={avatarUrl ?? undefined} sx={{ width: 120, height: 120 }}>
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            {avatarUploading && (
              <Box sx={{
                position: "absolute", inset: 0, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.7)",
              }}>
                <CircularProgress size={32} />
              </Box>
            )}
          </Box>

          {(isCreate || canEdit) && editing && (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                {avatarUrl ? "Change photo" : "Add photo"}
              </Button>

              {avatarUrl && (
                <Button
                  variant="text"
                  size="small"
                  color="error"
                  onClick={() => setAvatarUrl(null)}
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

          {canEdit && !editing && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<IconEdit size={16} />}
              onClick={() => onEditStart()}
              sx={{ mb: 2 }}
            >
              Edit
            </Button>
          )}

          {editing ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  label="Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              { isCreate && (
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}

              {(!isOwn || isCreate) && (
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    {ROLES.filter(r => r !== 'OWNER').map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

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
            <Stack spacing={1}>
              <Typography variant="body2">{user.email}</Typography>
              <Typography variant="body2" color="text.secondary">{user.role}</Typography>
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
  const router = useRouter();
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
  const searchParams = useSearchParams();
  const [editing, setEditing] = useState(searchParams.get('edit') === '1');

  // ✅ isOwn першим — canEdit залежить від нього
  const isOwn = !slugParam || (me !== null && slugParam === me.id);

  const isCreate = slugParam === 'create';

  const canEdit =
    isOwn ||
    me?.role === "OWNER" ||
    (me?.role === "ADMIN" && user?.role !== "ADMIN" && user?.role !== "OWNER");

  const availableRoles = isOwn
    ? ROLES.filter(r => r !== "OWNER")  // своєму собі не можна стати OWNER
    : me?.role === "OWNER"
      ? ROLES  // OWNER бачить всі ролі
      : ROLES.filter(r => r !== "OWNER" && r !== "ADMIN"); // ADMIN не може призначити OWNER/ADMIN

  const notify = (message: string, severity: "success" | "error" = "success") =>
    setSnackbar({ open: true, message, severity });

useEffect(() => {
  const load = async () => {
    try {
      if (isCreate) {
        setUser({
          id: '',
          name: '',
          email: '',
          role: 'USER',
          avatarId: null,
          avatarUrl: null,
        });
        setEditing(true);
        setPageLoading(false);
        return;
      }

      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      if (!meRes.ok) return;
      const meData = await meRes.json();
      setMe({ id: String(meData.id), role: meData.role });

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
          avatarId: userData.avatarId ?? null,
          avatarUrl: userData.avatar?.url ?? null,
        });
      } else {
        setUser({
          id: String(meData.id),
          name: meData.name ?? "",
          email: meData.email ?? "",
          role: (meData.role as UserRole) ?? "USER",
          avatarId: meData.avatarId ?? null,
          avatarUrl: meData.avatar?.url ?? null,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };
  load();
}, [slugParam, isCreate]);

const handleSave = async (patch: SavePayload) => {
  if (!user) return;
  setSaving(true);
  try {
    if (isCreate) {
      if (!patch.password) {
        notify('Password is required', 'error');
        setSaving(false);
        return;
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: patch.name, email: patch.email, password: patch.password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();

      // Роль
      if (patch.role !== 'USER') {
        await fetch(`/api/users/${created.user.id}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ role: patch.role }),
        });
      }

      // Аватар
      if (patch.avatarId) {
        await fetch(`/api/users/${created.user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ avatarId: patch.avatarId }),
        });
      }

      notify('User created successfully');
      setTimeout(() => router.push(`/admin/profile/${created.user.id}`), 1000);
      return;
    }
    
    const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: patch.name,
        avatarId: patch.avatarId,
        ...(!isOwn ? { role: patch.role } : {}),
        ...(patch.password ? { password: patch.password } : {}),
      }),
    });
    if (!res.ok) throw new Error(await res.text());

    // ✅ Перечитуємо актуальний профіль з сервера
    const refreshRes = await fetch(`${BASE_URL}/api/users/${user.id}`, {
      credentials: "include",
    });
    if (refreshRes.ok) {
      const refreshed = await refreshRes.json();
      setUser({
        id: String(refreshed.id),
        name: refreshed.name ?? "",
        email: refreshed.email ?? "",
        role: refreshed.role ?? "USER",
        avatarId: refreshed.avatarId ?? null,
        avatarUrl: refreshed.avatar?.url ?? null,  // ✅ береться з сервера
      });
    }

    notify("Профіль збережено");
    if (patch.role !== user.role) {
      notify(`Role changed to ${patch.role}`);
    } else {
      notify("Профіль збережено");
    }
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
          editing={editing}
          isCreate={isCreate}
          onEditStart={() => setEditing(true)}
          onEditEnd={() => setEditing(false)}
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

export default function ProfilePageWrapper() {
  return (
    <Suspense>
      <ProfilePage />
    </Suspense>
  );
}