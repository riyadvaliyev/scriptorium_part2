// src/components/Dashboard/ProfileSection.tsx
import React, { useEffect, useState } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
}

const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile.');

        const data: UserProfile = await response.json();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!profile) {
    return (
      <div className="p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="text-gray-600">Profile information is unavailable. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded flex items-center gap-6">
      <img
        src={profile.avatar || '/avatars/avatar1.png'}
        alt="User Avatar"
        className="w-24 h-24 rounded-full border border-gray-300 shadow-sm"
      />
      <div>
        <h2 className="text-2xl font-bold mb-2">Profile</h2>
        <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneNumber}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => (window.location.href = '/editProfile')}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;


