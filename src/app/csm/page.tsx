'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CSMRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root page as the default
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
