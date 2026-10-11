"use client";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material";
import Image from "next/image";
import { Box } from "@mui/material";

const Logo = () => {
  return (
    <Box
      component="a"
      href="/"
      sx={{ height: 70, width: 140, overflow: "hidden", display: "block" }}
    >
      <Image src="/mobile/icys.webp" alt="icys logo" height={70} width={140} priority />
    </Box>
  );
};

export default Logo;