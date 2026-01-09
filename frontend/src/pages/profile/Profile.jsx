import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      name: user?.name || ''
    }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  const onSubmitProfile = async (data) => {
    setIsLoading(true);
    await updateProfile(data);
    setIsLoading(false);
  };

  const onSubmitPassword = async (data) => {
    setIsLoading(true);
    const result = await changePassword(data);
    if (result.success) {
      resetPassword();
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and password</p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'profile' 
            ? 'border-b-2 border-primary-500 text-primary-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'password' 
            ? 'border-b-2 border-primary-500 text-primary-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="card p-6">
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  {...registerProfile('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
                {profileErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-50 cursor-not-allowed"
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={user?.role === 'admin' ? 'Administrator' : 'User'}
                disabled
                className="input-field bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card p-6">
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  {...registerPassword('currentPassword', { 
                    required: 'Current password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  {...registerPassword('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  {...registerPassword('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value, formValues) => 
                      value === formValues.newPassword || 'Passwords do not match'
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;