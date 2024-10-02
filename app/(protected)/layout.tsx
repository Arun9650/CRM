
import Providers from '@/providers/Tooltip';
import { DesktopNav, MobileNav } from '@/components/Navigation/Navigation';
import SignOutButton from '@/components/SignOut';


export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full bg-gray-100">
        <DesktopNav />
        <div className='w-full'>

        <div className="flex flex-col sm:gap-4 sm:py-4 ">
        <header className="bg-white shadow-sm">
          <div className="mx-auto py-4 px- sm:px-6 lg:px-8 flex justify-between items-center">
          <MobileNav />
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <SignOutButton/>
          </div>
        </header>
          <main className="bg-gray-100 sm:px-14">
            {children}
          </main>
        </div>
        </div>
      </main>
    </Providers>
  );
}




