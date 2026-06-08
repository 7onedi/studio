import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "140px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/" className="flex items-center gap-2 justify-center text-center">
      <Image src="/mobile/icys.webp" alt="icys logo" height={70} width={140} priority />
    </LinkStyled>
  );
};

export default Logo;
  