import Link from 'next/link';
import { NavItem } from '../nav-item';
import {
	BookCheck,
	ContactRound,
	Home,
	LineChart,
	PanelLeft,
	ShoppingCart,
	UserPlus,
	Users2,
} from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import React from 'react';
import Image from 'next/image';

const DesktopNav = () => {
	const navItems = [
		{ href: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
		{
			href: '/create-employee',
			label: 'Create Employee',
			icon: <ContactRound className="h-5 w-5" />,
		},
	];

	return (
    <div className="w-80 bg-indigo-700 text-white">
    <div className="p-6">
      <div className="flex items-center space-x-3">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
    </div>
    <nav className="mt-6">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label}  >
            {item.icon}
          </NavItem>
        ))}
      </ul>
    </nav>
  </div>

	);
};

const MobileNav = () => {
	const navItems = [
		{ href: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
		{
			href: '/create-employee',
			label: 'Create Task',
			icon: <ShoppingCart className="h-5 w-5" />,
		},
	];

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className="sm:hidden"
					// onClick={handleLinkClick}
				>
					<PanelLeft className="h-5 w-5" />
				</Button>
			</SheetTrigger>

			<SheetContent side="left" className="sm:max-w-xs bg-white">
				<nav className="grid gap-6 text-lg font-medium">
					{/* <Image
          src="https://res.cloudinary.com/dga7phidh/image/upload/v1727343700/WhatsApp_Image_2024-09-25_at_20.47.59_9ded0a5f_de6zz7.jpg"
          alt="beestar"
          width={50}
          height={50}
          className="rounded-full"
         
        /> */}

					<p className="font-bold  text-xl">Admin</p>

					{navItems.map((item, index) => (
						<SheetClose asChild key={index}>
							<Link
								href={item.href}
								className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
							>
								{item.icon}
								{item.label}
							</Link>
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
};

export { DesktopNav, MobileNav };
