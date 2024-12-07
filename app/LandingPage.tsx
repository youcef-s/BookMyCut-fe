'use client';
import { useAuth0 } from '@auth0/auth0-react';

export default function LandingPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Barbershop!</h1>
      <p className="text-lg mb-8 text-center">
        Experience the best grooming services in town. Our skilled barbers are here to give you the look you desire. 
        Book your appointment today and step into style!
      </p>
      <button
        onClick={() => loginWithRedirect()}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Schedule Appointment
      </button>
    </div>
  );
}