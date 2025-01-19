'use client';

import Cookies from 'js-cookie';

const API_BASE_URL = 'https://api.afrikticket.com/api';

export async function getOrganizations(page = 1) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/organizations?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch organizations');
    }
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

// Function to format organization data for the table
export function formatOrganizationData(organizations) {
  return organizations.map((item) => {
    const org = item.organization;
    const stats = item.stats;
    
    return {
      id: org.id,
      name: org.name,
      email: org.email,
      phone: org.phone,
      description: org.description,
      status: org.user.status,
      events_count: stats.total_events,
      fundraisings_count: stats.total_fundraisings,
      registration_date: stats.registration_date,
      user: org.user,
    };
  });
}

// Function to get a single organization
export async function getOrganization(id) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/organizations/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch organization');
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch organization');
    }
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
}

// Function to update organization status
export async function updateOrganizationStatus(id, newStatus, rejectionReason = null) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Debug log the input parameters
    console.log('Input parameters:', { id, newStatus, rejectionReason });

    // Validate status
    if (!['approved', 'rejected'].includes(newStatus)) {
      throw new Error('Invalid status. Must be either "approved" or "rejected"');
    }

    const requestBody = {
      status: newStatus
    };
    
    // Only add reason if status is rejected
    if (newStatus === 'rejected') {
      if (!rejectionReason?.trim()) {
        throw new Error('Reason is required when rejecting an organization');
      }
      requestBody.reason = rejectionReason.trim();
    }

    // Debug log the request details
    console.log('Making request to:', `${API_BASE_URL}/admin/organizations/${id}/status`);
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `${API_BASE_URL}/admin/organizations/${id}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseData = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', responseData);

    if (!response.ok) {
      // Get more detailed error message
      const errorMessage = responseData?.message || responseData?.error || 'Failed to update organization status';
      console.error('Error details:', responseData);
      throw new Error(errorMessage);
    }

    if (responseData.status !== 'success') {
      throw new Error('Failed to update organization status');
    }

    return responseData;
  } catch (error) {
    console.error('Error updating organization status:', error);
    throw error;
  }
}