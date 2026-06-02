"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
} from "@mui/material";
import Link from "next/link";
import CustomTextField from "../../(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface LoginProps {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
  onSubmit?: (data: { email: string; password: string }) => Promise<void>;
}

const AuthLogin: React.FC<LoginProps> = ({
  title,
  subtitle,
  subtext,
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ помилки для полів
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  // глобальна помилка
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setFormError(null);

    try {
      if (onSubmit) {
        await onSubmit({ email, password });
      }
    } catch (err: any) {
      // якщо бекенд повернув JSON з errors
      if (err?.errors) {
        setErrors(err.errors);
      } else if (err?.message) {
        setFormError(err.message);
      } else {
        setFormError("Login failed");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      {/* глобальна помилка */}
      {formError && <Alert severity="error">{formError}</Alert>}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Email
          </Typography>
          <CustomTextField
            fullWidth
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email?.[0]}
          />
        </Box>

        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            type="password"
            fullWidth
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password?.[0]}
          />
        </Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember this Device"
            />
          </FormGroup>

          {/* <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password?
          </Typography> */}
        </Stack>
      </Stack>

      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          Sign In
        </Button>
      </Box>

      {subtitle}
    </form>
  );
};

export default AuthLogin;