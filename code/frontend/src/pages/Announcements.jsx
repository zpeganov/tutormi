import { useState, useEffect } from 'react';
import AnnouncementCard from '../components/AnnouncementCard';
import { getAnnouncements } from '../services/api';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch announcements from the backend
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        setAnnouncements(response.announcements || []); // Correctly access the 'announcements' property
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const importantAnnouncements = announcements.filter(
    (a) => a.priority === 'high'
  );
  const regularAnnouncements = announcements.filter(
    (a) => a.priority !== 'high'
  );

  // Get user type from localStorage (set during login)
  const user = JSON.parse(localStorage.getItem('tutormi_user'));
  const userType = user ? user.userType : 'student';

  return (
    <main className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Announcements</h1>
        <p className="dashboard-subtitle">
          Stay updated with the latest news from tutors and admins
        </p>
      </div>

      {/* Important Announcements */}
      {importantAnnouncements.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Important Announcements</h2>
              <p className="section-subtitle">
                Stay informed with the latest updates from your tutors.
              </p>
            </div>
            {userType === 'tutor' && (
              <div className="new-announcement">
                {/* Button or link to create a new announcement */}
              </div>
            )}
          </div>
          <div className="announcements-list">
            {importantAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </section>
      )}

      {/* All Announcements */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Updates</h2>
        </div>
        <div className="announcements-list">
          {regularAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Announcements;
