import { Grid, Typography } from "@mui/material";
import DashboardCard from "../shared/DashboardCard";

const stats = [
  { label: "Posts", value: 124 },
  { label: "Followers", value: 8.2 },
  { label: "Following", value: 530 },
  { label: "Projects", value: 32 }
];

const ProfileStats = () => {
  return (
    <Grid container spacing={3}>
      {stats.map((item, index) => (
        <Grid
          key={index}
          size={{
            xs: 6,
            md: 3
          }}
        >
          <DashboardCard>

            <Typography variant="h4" fontWeight={700}>
              {item.value}
            </Typography>

            <Typography color="textSecondary">
              {item.label}
            </Typography>

          </DashboardCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileStats;