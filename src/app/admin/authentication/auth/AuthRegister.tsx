"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
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

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // зберігаємо користувача (тимчасово)
    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    // ставимо cookie
    setCookie("admin_token", "registered", {
      maxAge: 60 * 60 * 24,
    });

    // редірект
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

      <Box>
        <Stack mb={3}>
          <Typography fontWeight={600} component="label" mb="5px">
            Name
          </Typography>
          <CustomTextField
            fullWidth
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />

          <Typography fontWeight={600} component="label" mb="5px" mt="25px">
            Email Address
          </Typography>
          <CustomTextField
            fullWidth
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <Typography fontWeight={600} component="label" mb="5px" mt="25px">
            Password
          </Typography>
          <CustomTextField
            type="password"
            fullWidth
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
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