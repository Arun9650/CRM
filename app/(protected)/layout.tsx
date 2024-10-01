
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
      <main className="flex min-h-screen w-full bg-muted/40">
        <DesktopNav />
        <div className='w-full'>

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:px-14">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <SignOutButton/>
          </header>
          <main className="bg-muted/40">
            {children}
          </main>
        </div>
        </div>
      </main>
    </Providers>
  );
}




