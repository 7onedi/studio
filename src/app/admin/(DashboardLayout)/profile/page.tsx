'use client'

import { Grid, Box } from "@mui/material";
import PageContainer from "../components/container/PageContainer";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfileActivity from "../components/profile/ProfileActivity";
import Blog from "../components/profile/Blog";

const ProfilePage = () => {
  return (
    <PageContainer title="Profile" description="User profile page">
      <Box>

        <Grid container spacing={3}>

          {/* header */}
          <Grid size={12}>
            <ProfileHeader />
          </Grid>

          {/* stats */}
          <Grid size={12}>
            <ProfileStats />
          </Grid>

          {/* about */}
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}
          >
            <ProfileAbout />
          </Grid>

          {/* activity */}
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}
          >
            <ProfileActivity />
          </Grid>

          {/* posts / products */}
          <Grid size={12}>
            <Blog />
          </Grid>

        </Grid>

      </Box>
    </PageContainer>
  );
};

export default ProfilePage;