import { useState, useEffect } from 'react';
import { getStudentRequests } from '../services/api'; // Assuming an API function
import './Dashboard.css';

function StudentRequests() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    // Fetch student requests from the backend
    const fetchRequests = async () => {
      try {
        const response = await getStudentRequests();
        setRequests(response.requests || []); // Use response.requests and fallback to empty array
      } catch (error) {
        console.error('Error fetching student requests:', error);
        setRequests([]); // Set to empty array on error
      }
    };

    fetchRequests();
  }, [])

  const handleAccept = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'accepted' } : req
    ))
    // TODO: Send acceptance to backend
  }

  const handleDecline = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'declined' } : req
    ))
    // TODO: Send decline to backend
  }

  const filteredRequests = (requests || []).filter(req => { // Add guard here
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const pendingCount = (requests || []).filter(req => req.status === 'pending').length; // Add guard here

  return (
    <div className="student-requests-section">
      <div className="section-header">
        <h2 className="section-title">Student Requests</h2>
      </div>

      {/* Filter Tabs */}
      <div className="request-tabs">
        <button 
          className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
          {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
        </button>
        <button 
          className={`tab-btn ${filter === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilter('accepted')}
        >
          Accepted
        </button>
        <button 
          className={`tab-btn ${filter === 'declined' ? 'active' : ''}`}
          onClick={() => setFilter('declined')}
        >
          Declined
        </button>
        <button 
          className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>

      {/* Requests List */}
      <div className="requests-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div key={request.id} className={`request-card ${request.status}`}>
              <div className="request-info">
                <div className="request-avatar">
                  {request.firstName && request.lastName ? `${request.firstName[0]}${request.lastName[0]}` : '?'}
                </div>
                <div className="request-details">
                  <h3>{request.firstName} {request.lastName}</h3>
                  <p className="request-email">{request.email}</p>
                  <p className="request-date">Requested on {request.requestDate}</p>
                </div>
              </div>
              
              <div className="request-actions">
                {request.status === 'pending' ? (
                  <>
                    <button onClick={() => handleAccept(request.id)} className="btn-accept">Accept</button>
                    <button onClick={() => handleDecline(request.id)} className="btn-decline">Decline</button>
                  </>
                ) : (
                  <span className={`status-badge ${request.status}`}>{request.status}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No requests found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentRequests;
