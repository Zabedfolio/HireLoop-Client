'use client';

import NoCompanyState from '@/components/dashboard/recruiter/Nocompanystate';
import PendingCompanyCard from '@/components/dashboard/recruiter/Pendingcompanycard';
import RegisterModal from '@/components/dashboard/recruiter/Registermodal';
import { T } from '@/lib/actions/Tokens';
import React, { useState } from 'react';


const CompanyProfile = ({recruiter, recruiterCompany}) => {
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany]     = useState(recruiterCompany);
  const [modalCompany, setModalCompany] = useState(null);

  const openRegisterModal = () => {
    setModalCompany(null);
    setShowModal(true);
  };

  const openEditModal = () => {
    setModalCompany(company);
    setShowModal(true);
  };

  const handleSaveCompany = (data) => {
    setCompany({ ...data, status: data.status || 'pending' });
    setShowModal(false);
    setModalCompany(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalCompany(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: T.text1,
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 16px' }}>

        {/* Page header */}
        <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 22, marginBottom: 28 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3 }}>
            Recruiter
          </p>
          <h1 style={{ margin: '3px 0 5px', fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em', lineHeight: 1 }}>
            My Company
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>
            Manage your business profile and hiring presence.
          </p>
        </div>

        {/* Main content */}
        {!company ? (
          <div style={{ borderRadius: 16, border: `1px solid ${T.border}` }}>
            <NoCompanyState onRegister={openRegisterModal} />
          </div>
        ) : (
          <PendingCompanyCard company={company} onEdit={openEditModal} />
        )}
      </div>

      {showModal && (
        <RegisterModal
          onClose={closeModal}
          onSubmit={handleSaveCompany}
          initialData={modalCompany}
          recruiter={recruiter}
        />
      )}
    </div>
  );
};

export default CompanyProfile;