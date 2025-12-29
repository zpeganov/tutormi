import { useState, useEffect } from 'react';
import { getCurrentUser, updateTutorProfile, changeTutorPassword } from '../services/api';
import Modal from '../components/Modal';
import './Dashboard.css';

function Settings() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', mi_ID: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMessage, setPwMessage] = useState('');

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        setForm({
          firstName: user.firstName || user.first_name || '',
          lastName: user.lastName || user.last_name || '',
          email: user.email || '',
          mi_ID: user.mi_ID || user.id || '',
        });
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (e) {
        setMessage('Failed to load user info.');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateTutorProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mi_ID: form.mi_ID,
      });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  const openModal = () => {
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMessage('');
    if (!pwForm.currentPassword) {
      setPwMessage('Current password is required.');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage('New passwords do not match.');
      return;
    }
    if (!pwForm.newPassword) {
      setPwMessage('Please enter a new password.');
      return;
    }
    try {
      await changeTutorPassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMessage('Password updated successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMessage('Failed to update password.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main className="dashboard-content">
      <h1>Settings</h1>
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="mi_ID">mi_ID (Tutor ID)</label>
          <input id="mi_ID" name="mi_ID" value={form.mi_ID} onChange={handleChange} disabled />
        </div>
        <button className="btn-primary" type="submit">Save Changes</button>
        <button type="button" className="btn-secondary" style={{ marginLeft: '1rem' }} onClick={openModal}>
          Change Password
        </button>
        {message && <div className="form-message">{message}</div>}
      </form>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <form className="settings-form" onSubmit={handlePwSubmit}>
            <h2>Change Password</h2>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input id="currentPassword" name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input id="newPassword" name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange} required />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn-primary">Update Password</button>
            </div>
            {pwMessage && <div className="form-message">{pwMessage}</div>}
          </form>
        </Modal>
      )}
    </main>
  );
}

export default Settings;
