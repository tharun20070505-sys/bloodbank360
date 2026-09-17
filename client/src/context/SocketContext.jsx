import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast, refetch } = useNotifications();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to server socket
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Connected to BloodConnect 360 Socket Gateway:', socketInstance.id);
      socketInstance.emit('join_emergency');

      if (user) {
        socketInstance.emit('join_user', user._id);
        if (user.role === 'BLOOD_BANK' && user.profile) {
          socketInstance.emit('join_bank', user.profile._id);
        }
      }
    });

    socketInstance.on('emergency_blood_request', (data) => {
      addToast({
        type: 'emergency',
        title: `🚨 EMERGENCY REQUEST: ${data.bloodGroup}`,
        message: `${data.unitsRequired} unit(s) needed urgently at ${data.hospitalName}.`
      });
      refetch();
    });

    socketInstance.on('donor_response_received', (data) => {
      addToast({
        type: 'success',
        title: '🩸 Donor Accepted Request!',
        message: data.message || 'A registered donor is responding to your request.'
      });
      refetch();
    });

    socketInstance.on('new_blood_request', (data) => {
      addToast({
        type: data.emergency ? 'emergency' : 'info',
        title: `🩸 Urgent Request in Your Area: ${data.bloodGroup}`,
        message: `Patient at ${data.hospital} requires blood donation.`
      });
      refetch();
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
