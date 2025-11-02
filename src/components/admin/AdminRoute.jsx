import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  console.log('🔐 AdminRoute Check - Starting...');
  
  if (!userData || !token) {
    console.log('❌ No user data or token found');
    return <Navigate to="/adminlogin" replace />;
  }
  
  try {
    const user = JSON.parse(userData);
    console.log('👤 Full user object:', user);
    console.log('👤 User role:', user.role);
    console.log('👤 User isAdmin:', user.isAdmin);
    
    // Check ALL possible admin indicators
    const isAdmin = 
      user.role === 'admin' || 
      user.isAdmin === true || 
      user.isAdmin === 'true' ||
      user.type === 'admin' ||
      user.userType === 'admin';
    
    console.log('✅ Final admin check result:', isAdmin);
    
    if (!isAdmin) {
      console.log('❌ User does not have admin privileges');
      console.log('❌ Redirecting to /home');
      return <Navigate to="/home" replace />;
    }
    
    console.log('✅ Admin access GRANTED');
    return children;
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    return <Navigate to="/adminlogin" replace />;
  }
};

export default AdminRoute;