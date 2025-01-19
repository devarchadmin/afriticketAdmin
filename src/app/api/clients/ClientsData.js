'use client';

import Cookies from 'js-cookie';

export async function getClients(page = 1) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `https://api.afrikticket.com/api/admin/users?page=${page}&role=user`,
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
      throw new Error('Failed to fetch clients');
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch clients');
    }
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

// Function to format client data for the table
export function formatUserData(users) {
  return users.filter(user => user.role === 'user').map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profile_image: user.profile_image,
    created_at: user.created_at,
    total_spent: 0 // Placeholder for total spent
  }));
}

// Function to get a single client
export async function getClient(id) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `https://api.afrikticket.com/api/admin/users/${id}`,
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
      throw new Error('Failed to fetch client');
    }

    const result = await response.json();
    
    if (result.status === 'success' && result.data.role === 'user') {
      return result.data;
    } else {
      throw new Error('Invalid client data');
    }
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

// Function to update client status
export async function updateClientStatus(id, status) {
  try {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(
      `https://api.afrikticket.com/api/admin/users/${id}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update client status');
    }

    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to update client status');
    }
  } catch (error) {
    console.error('Error updating client status:', error);
    throw error;
  }
}