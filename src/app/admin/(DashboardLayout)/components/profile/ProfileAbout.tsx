import { Typography, Stack } from "@mui/material";
import DashboardCard from "../shared/DashboardCard";

const ProfileAbout = () => {
  return (
    <DashboardCard title="About">

      <Stack spacing={2}>

        <Typography>
          Passionate web developer focused on scalable applications.
        </Typography>

        <Typography variant="subtitle2">
          📍 Location: Ukraine
        </Typography>

        <Typography variant="subtitle2">
          💻 Stack: Next.js, Prisma, PostgreSQL
        </Typography>

        <Typography variant="subtitle2">
          📅 Joined: 2023
        </Typography>

      </Stack>

    </DashboardCard>
  );
};

export default ProfileAbout;