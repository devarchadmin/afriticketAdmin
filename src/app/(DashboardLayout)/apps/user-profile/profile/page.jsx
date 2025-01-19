import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';

import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from '@/app/components/apps/userprofile/profile/IntroCard';
import PhotosCard from '@/app/components/apps/userprofile/profile/PhotosCard';
import Post from '@/app/components/apps/userprofile/profile/Post';
import AdminProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import AdminIntroCard from '@/app/components/apps/userprofile/profile/IntroCard';

const UserProfile = () => {
  return (
    <PageContainer title="Profile" description="this is Profile">

      <Grid container spacing={3}>
        <Grid item sm={12}>
          <AdminProfileBanner />
        </Grid>
        <Grid item sm={12}>
          <AdminIntroCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserProfile;
