import React from 'react';
import InventoryGrid from '../Components/Inventoryrid';
import StaffHeader from '../Common/StaffHeader';

const Dashboard = () => {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      <StaffHeader />

      <main className="pb-16">
        <InventoryGrid />
      </main>
    </div>
  );
};

export default Dashboard;