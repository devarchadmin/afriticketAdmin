import axiosServices from '@/utils/axios';

const API_URL = 'https://api.afrikticket.com/api/fundraising';

const medicalImages = ["/images/funds/medical/danilyuk.jpg", "/images/funds/medical/miroshnichenko.jpg", "/images/funds/medical/production.jpg"];
const educationImages = ["/images/funds/education/lagosfoodbank.jpg", "/images/funds/education/kureng-workx.jpg", "/images/funds/education/fatima-yusuf.jpg"];
const disasterImages = ["/images/funds/disaster/babijaphoto.jpg", "/images/funds/disaster/riadh-sahli.jpg", "/images/funds/disaster/youssef-elbelghiti.jpg"];
const animalImages = ["/images/funds/animals/nicolette-villavicencio.jpg", "/images/funds/animals/molnartamasphotography.jpg", "/images/funds/animals/mikhail-nilov.jpg"];
const communityImages = ["/images/funds/community/iterpeal.jpg", "/images/funds/community/denis-ngai.jpg", "/images/funds/community/lagosfoodbank.jpg"];

const organizations = {
  1: { name: "Fondation Médicale Espoir", logo: "/images/organizations/medical-hope.jpg" },
  2: { name: "Fondation Éducation pour Tous", logo: "/images/organizations/edu-all.jpg" },
  3: { name: "Réseau de Secours Mondial", logo: "/images/organizations/global-relief.jpg" },
  4: { name: "Société Pattes & Soins", logo: "/images/organizations/paws-care.jpg" },
  5: { name: "Fondation Communautaire Unie", logo: "/images/organizations/united-community.jpg" }
};

const getEventStatus = (deadline) => {
  const currentDate = new Date();
  return deadline < currentDate ? 'completed' : 'active';
};

// Helper function to fetch user activity data
const fetchUserActivity = async (userId) => {
  try {
    const response = await axiosServices.get(`https://api.afrikticket.com/api/admin/users/${userId}/activity`);
    const data = response.data.data;
    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        role: data.user.role
      },
      summary: data.summary,
      activity: data.activity
    };
  } catch (error) {
    console.error(`Error fetching user activity for ID ${userId}:`, error);
    return null;
  }
};

// Function to fetch donations with user activity data for a specific fundraising
export const fetchUserDonationsForFund = async (fundraisingId) => {
  try {
    const response = await axiosServices.get(API_URL);
    const fundraising = response.data.data.fundraisings.find(
      item => item.fundraising.id === fundraisingId
    );

    if (!fundraising || !fundraising.fundraising.donations) {
      return [];
    }

    const donations = await Promise.all(
      fundraising.fundraising.donations.map(async (donation) => {
        const userActivity = await fetchUserActivity(donation.user_id);
        
        if (!userActivity) {
          // Return minimal donation info if user activity fetch fails
          return {
            id: donation.id,
            user_id: donation.user_id,
            donorName: 'Anonymous',
            email: '',
            amount: parseFloat(donation.amount),
            created_at: donation.created_at,
            status: donation.payment_status,
            payment_method: donation.payment_method
          };
        }

        return {
          id: donation.id,
          user_id: donation.user_id,
          donorName: userActivity.user.name,
          email: userActivity.user.email,
          amount: parseFloat(donation.amount),
          created_at: donation.created_at,
          status: donation.payment_status,
          payment_method: donation.payment_method,
          donor_info: {
            total_donations: userActivity.summary.total_donations,
            total_donated: userActivity.summary.total_donated,
            average_donation: userActivity.summary.average_donation,
            registration_date: userActivity.summary.registration_date,
            last_activity: userActivity.summary.last_activity,
            user_status: userActivity.user.status,
            role: userActivity.user.role
          }
        };
      })
    );

    console.log('Donations:', donations);

    return donations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const fetchFundraisingFromAPI = async () => {
  try {
    const response = await axiosServices.get(API_URL);
    const fundraisings = await Promise.all(response.data.data.fundraisings.map(async ({ fundraising, stats }) => {
      const donationsWithUserInfo = await Promise.all(
        fundraising.donations.map(async (donation) => {
          const userActivity = await fetchUserActivity(donation.user_id);
          
          if (!userActivity) {
            return {
              id: donation.id,
              user_id: donation.user_id,
              donorName: 'Anonymous',
              email: '',
              amount: parseFloat(donation.amount),
              created_at: donation.created_at,
              status: donation.payment_status,
            };
          }

          return {
            id: donation.id,
            user_id: donation.user_id,
            donorName: userActivity.user.name,
            email: userActivity.user.email,
            amount: parseFloat(donation.amount),
            created_at: donation.created_at,
            status: donation.payment_status,
            donor_info: {
              total_donations: userActivity.summary.total_donations,
              total_donated: userActivity.summary.total_donated,
              average_donation: userActivity.summary.average_donation,
              registration_date: userActivity.summary.registration_date,
              last_activity: userActivity.summary.last_activity,
              user_status: userActivity.user.status
            }
          };
        })
      );

      return {
        Id: fundraising.id,
        title: fundraising.title,
        description: fundraising.description,
        requestedAmount: parseFloat(fundraising.goal),
        minimumAmount: 10,
        raisedAmount: parseFloat(fundraising.current),
        category: fundraising.category,
        deadline: new Date(fundraising.created_at),
        organizationId: fundraising.organization_id,
        organization: {
          name: fundraising.organization.name,
          logo: '/images/organizations/default.jpg'
        },
        status: fundraising.status,
        beneficiary: fundraising.organization.name,
        images: fundraising.images.map(img => img.image_path),
        donors: stats.total_donors,
        deleted: false,
        donations: donationsWithUserInfo
      };
    }));

    return fundraisings;
  } catch (error) {
    console.error('Error fetching fundraising:', error);
    throw error;
  }
};
