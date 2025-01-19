import axios from 'axios';

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

export const fetchFundraisingFromAPI = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data.fundraisings.map(({ fundraising, stats }) => ({
      Id: fundraising.id,
      title: fundraising.title,
      description: fundraising.description,
      requestedAmount: parseFloat(fundraising.goal),
      minimumAmount: 10, // Default minimum amount
      raisedAmount: parseFloat(fundraising.current),
      category: "General",
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
      deleted: false
    }));
  } catch (error) {
    console.error('Error fetching fundraising:', error);
    throw error;
  }
};