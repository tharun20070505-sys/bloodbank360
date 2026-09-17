import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return { label: 'Pending Evaluation', className: 'badge-warning' };
      case 'SEARCHING':
        return { label: 'Searching Facilities', className: 'badge-info' };
      case 'BLOOD_BANK_FOUND':
        return { label: 'Blood Bank Stock Found', className: 'badge-success' };
      case 'DONOR_SEARCHING':
        return { label: 'Stage 2: Donor Search Active', className: 'badge-danger' };
      case 'DONOR_RESPONDED':
        return { label: 'Donor Responded (Accepted)', className: 'badge-success' };
      case 'ACCEPTED':
        return { label: 'Accepted & En Route', className: 'badge-success' };
      case 'CONTACTED':
        return { label: 'Contact Shared', className: 'badge-info' };
      case 'COMPLETED':
        return { label: 'Fulfilled & Completed', className: 'badge-neutral' };
      case 'CANCELLED':
        return { label: 'Cancelled', className: 'badge-neutral' };
      case 'EXPIRED':
        return { label: 'Expired', className: 'badge-neutral' };
      default:
        return { label: status || 'Unknown', className: 'badge-neutral' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
