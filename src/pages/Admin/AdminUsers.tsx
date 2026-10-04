import { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  CheckCircle
} from 'lucide-react';
import { useAdmin, type AdminUser, type UserRole, type UserStatus } from '../../context/AdminContext';
import './AdminUsers.css';

export default function AdminUsers() {
  const { users, updateUserStatus, updateUserRole } = useAdmin();

  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    if (activeRoleFilter !== 'all' && u.role !== activeRoleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleStatus = (user: AdminUser) => {
    const nextStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUserStatus(user.id, nextStatus, nextStatus === 'suspended' ? 'Administrative suspension by Compliance Director' : 'Account reactivated');
    setStatusMessage(`User ${user.name} is now ${nextStatus.toUpperCase()}`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole(userId, newRole);
    setStatusMessage(`Assigned ${newRole.toUpperCase()} permissions.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="admin-users-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-breadcrumb">OPERATIONS CONSOLE &gt; PARTICIPANT GOVERNANCE</span>
          <h1 className="admin-page-title">User &amp; Provider Directory</h1>
          <p className="admin-page-subtitle">
            Manage institutional access privileges, oversee high-net-worth client accounts, broker certifications, and enforce administrative security controls.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="admin-notification-toast">
          <CheckCircle size={16} /> {statusMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-controls-card">
        <div className="admin-status-tabs">
          <button 
            className={`tab-btn ${activeRoleFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveRoleFilter('all')}
          >
            All Participants ({users.length})
          </button>
          <button 
            className={`tab-btn ${activeRoleFilter === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveRoleFilter('agent')}
          >
            Licensed Agents ({users.filter(u => u.role === 'agent').length})
          </button>
          <button 
            className={`tab-btn ${activeRoleFilter === 'landlord' ? 'active' : ''}`}
            onClick={() => setActiveRoleFilter('landlord')}
          >
            Private Landlords ({users.filter(u => u.role === 'landlord').length})
          </button>
          <button 
            className={`tab-btn ${activeRoleFilter === 'consumer' ? 'active' : ''}`}
            onClick={() => setActiveRoleFilter('consumer')}
          >
            Consumers ({users.filter(u => u.role === 'consumer').length})
          </button>
          <button 
            className={`tab-btn ${activeRoleFilter === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveRoleFilter('admin')}
          >
            Compliance Staff ({users.filter(u => u.role === 'admin').length})
          </button>
        </div>

        <div className="admin-filter-bar">
          <div className="search-field-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, email, or city location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="admin-input-search"
            />
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="admin-panel">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Platform Role</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Listings / Volume</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center" style={{ padding: 'var(--space-10) 0' }}>
                    <p className="text-secondary">No platform users matched your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className={`user-avatar-tag role-avatar-${user.role}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="user-name-title">{user.name}</div>
                          <div className="text-meta">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <select 
                        value={user.role} 
                        onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="user-role-select"
                        disabled={user.id === 'usr_admin_001'} // Protect root compliance director
                      >
                        <option value="consumer">Consumer</option>
                        <option value="agent">Broker Agent</option>
                        <option value="landlord">Landlord</option>
                        <option value="admin">Compliance Director</option>
                      </select>
                    </td>

                    <td>
                      <span className="user-location">{user.location}</span>
                    </td>

                    <td>
                      <div className="joined-cell">
                        <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                        <span className="text-meta">Active {user.lastActive}</span>
                      </div>
                    </td>

                    <td>
                      <div className="volume-cell">
                        <span className="volume-listings">{user.listingsCount || 0} Listings</span>
                        <span className="volume-total font-serif">€{(user.totalVolume || 0).toLocaleString()}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`user-status-pill status-${user.status}`}>
                        {user.status === 'active' ? 'Active' :
                         user.status === 'suspended' ? 'Suspended' : 'Flagged'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {user.id !== 'usr_admin_001' && (
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-error' : 'btn-primary'}`}
                          title={user.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          {user.status === 'active' ? (
                            <><UserX size={14} /> Suspend</>
                          ) : (
                            <><UserCheck size={14} /> Reinstate</>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
