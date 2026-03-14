import { Avatar, Box, Typography, Button, Stack } from "@mui/material";
import DashboardCard from "../shared/DashboardCard";

const ProfileHeader = () => {
  return (
    <DashboardCard>

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        spacing={3}
        alignItems="center"
      >

        <Avatar
          src="/images/profile/user-1.jpg"
          sx={{
            width: 120,
            height: 120
          }}
        />

        <Box flex={1}>
          <Typography variant="h4" fontWeight={700}>
            John Doe
          </Typography>

          <Typography color="textSecondary">
            Fullstack Developer
          </Typography>

          <Typography mt={1}>
            Building modern web apps with Next.js, Prisma and TypeScript
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained">
            Follow
          </Button>

          <Button variant="outlined">
            Message
          </Button>
        </Stack>

      </Stack>

    </DashboardCard>
  );
};

export default ProfileHeader;