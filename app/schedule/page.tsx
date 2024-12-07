'use client';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function ScheduleAppointment() {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (isAuthenticated && user) {
      const createUser = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          const newuser = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/user', {
            email: user.email,
          }, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          setUserId(newuser.data.id);
        } catch (error) {
          console.error('Error creating user:', error);
        }
      };
      createUser();
    }
  }, [isAuthenticated, isLoading, router, user, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'User ID is not available. Please try again later.',
      });
      return;
    }

    const appointmentData = {
      userId: userId,
      date: new Date(`${date}T${time}:00`),
    };

    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/appointments', appointmentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 201) {
        throw new Error('Failed to schedule appointment');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Appointment scheduled!',
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'Error scheduling appointment. Please try again.';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Schedule an Appointment</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            const day = selectedDate.getUTCDay();
            if (day !== 0 && day !== 6) {
              setDate(e.target.value);
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please select a weekday (Monday to Friday).',
              });
            }
          }}
          className="p-2 rounded bg-gray-800"
          required
        />
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="p-2 rounded bg-gray-800"
          required
        >
          <option value="" disabled>Select an hour</option>
          {[...Array(8).keys()].map(hour => (
            <option key={hour} value={(hour + 9).toString().padStart(2, '0')}>{hour + 9}:00</option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
}