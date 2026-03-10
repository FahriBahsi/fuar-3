import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminStats } from '@/lib/api-db';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Direo',
  description: 'Administrative dashboard for managing the directory platform',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated or not admin
  if (!session?.user || !(session.user as any).id) {
    redirect('/auth/login');
  }

  // Check if user is admin (you'd implement proper role checking)
  if ((session.user as any).role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const stats = await getAdminStats();

  return (
    <div className="admin-layout">
      <AdminDashboard stats={stats} />
    </div>
  );
}
