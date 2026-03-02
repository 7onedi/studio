"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";

import PageContainer from "../../(DashboardLayout)/components/container/PageContainer";
import Logo from "../../(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";

const Login2 = () => {
  const router = useRouter();

const handleLogin = async (data: { email: string; password: string }) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      // якщо повертає Zod помилки
      if (result.errors) throw { errors: result.errors };
      // якщо просто повідомлення
      if (result.message) throw { message: result.message };
      throw new Error("Login failed");
    }

    // Токен можна зберігати
    localStorage.setItem("token", result.token);

    router.push("/admin");
  } catch (err: any) {
    // кинемо помилку далі в AuthLogin, щоб показати Alert
    throw err;
  }
};

  return (
    <PageContainer title="Login" description="Admin login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>

              <AuthLogin
                onSubmit={handleLogin}
                subtext={
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    color="textSecondary"
                    mb={1}
                  >
                    Admin Panel Access
                  </Typography>
                }
                subtitle={
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    mt={3}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="500"
                    >
                      New here?
                    </Typography>
                    <Typography
                      component={Link}
                      href="/admin/authentication/register"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Create an account
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;