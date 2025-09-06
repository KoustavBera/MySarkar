import React from 'react';

const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Schemes</h3>
          <p className="text-3xl font-bold text-purple-600">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">156</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">67</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Analytics Coming Soon</h2>
        <p className="text-gray-600">Detailed analytics and reporting features will be available here.</p>
      </div>
    </div>
  );
};

export default Analytics;