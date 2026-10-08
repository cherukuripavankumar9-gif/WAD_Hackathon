import { useState, useEffect } from "react";
import { User, Mail, Shield, Edit2, Save, X } from "lucide-react";
import { getUser, updateUser } from "../services/api";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await getUser('user-001'); // Default user
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Fallback to localStorage if API fails
      const localUser = localStorage.getItem('tuneflow-user');
      if (localUser) {
        const userData = JSON.parse(localUser);
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await updateUser('user-001', formData);
      setUser(updatedUser);
      
      // Save to localStorage as backup and for immediate UI update
      localStorage.setItem('tuneflow-user', JSON.stringify(updatedUser));
      
      // Dispatch event to update header
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      // Save to localStorage anyway
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('tuneflow-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      
      setIsEditing(false);
      alert('Profile updated (saved locally)');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="profile-page">
        <div className="profile-header-section">
          <div className="profile-avatar-large">
            {formData.avatar}
          </div>
          <div className="profile-header-info">
            {!isEditing ? (
              <>
                <h1>{user?.username}</h1>
                <p className="profile-account-type">{user?.accountType} Account</p>
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <h2>Edit Profile</h2>
                <p>Update your profile information</p>
              </>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-form-card">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label>
                <User size={18} />
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                />
              ) : (
                <div className="form-value">{user?.username}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              ) : (
                <div className="form-value">{user?.email}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Shield size={18} />
                Avatar Letter
              </label>
              {isEditing ? (
                <input
                  type="text"
                  maxLength="1"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value.toUpperCase() })}
                  placeholder="K"
                />
              ) : (
                <div className="form-value">{user?.avatar}</div>
              )}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button 
                  className="save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-stats-card">
            <h3>Account Statistics</h3>
            <div className="stat-item">
              <span className="stat-label">Account Type</span>
              <span className="stat-value">{user?.accountType}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">User ID</span>
              <span className="stat-value">{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
