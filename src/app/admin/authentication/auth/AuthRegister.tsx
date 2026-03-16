"use client";

import React, { useState } from "react";
import { Box, Alert, Typography, Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

import CustomTextField from "../../(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface registerType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ errors state
  const [errors, setErrors] =
    useState<
      Record<string, string[]>
    >({});

  const [formError, setFormError] =
    useState<string | null>(
      null
    );

  const handleRegister = async () => {
    setErrors({});
    setFormError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const result = await res.json();
    if (!res.ok) {

        // ✅ Zod errors
        if (result.errors) {
          setErrors(
            result.errors
          );
        }

        // ✅ generic error
        if (result.message) {
          setFormError(
            result.message
          );
        }

        return;
      }

      router.push("/admin");
    };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      {/* global error */}
      {formError && (
        <Alert severity="error">
          {formError}
        </Alert>
      )}

      <Box>
        <Stack mb={3}>
          <Typography fontWeight={600} component="label" mb="5px">
            Name
          </Typography>
          <CustomTextField
            fullWidth
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            error={
              !!errors.name
            }

            helperText={
              errors.name?.[0]
            }
          />

          <Typography fontWeight={600} component="label" mb="5px" mt="25px">
            Email Address
          </Typography>
          <CustomTextField
            fullWidth
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            error={
              !!errors.email
            }
            helperText={
              errors.email?.[0]
            }
          />

          <Typography fontWeight={600} component="label" mb="5px" mt="25px">
            Password
          </Typography>
          <CustomTextField
            type="password"
            fullWidth
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            error={
              !!errors.password
            }
            helperText={
              errors.password?.[0]
            }
          />
        </Stack>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleRegister}
        >
          Sign Up
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;