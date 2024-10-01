import Link from "next/link";
import { NavItem } from "../nav-item";
import { BookCheck, ContactRound, Home, LineChart, PanelLeft,  ShoppingCart, Users2 } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import React from "react";
import Image from "next/image";

const DesktopNav = () => {
  const navItems = [
    { href: "/", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/create-employee", label: "Create Employee", icon: <ContactRound className="h-5 w-5" /> },
  ];

  return (
    <aside className="inset-y-0 left-0 z-10 hidden w-72 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Image
          src="https://res.cloudinary.com/dga7phidh/image/upload/v1727343700/WhatsApp_Image_2024-09-25_at_20.47.59_9ded0a5f_de6zz7.jpg"
          alt="beestar"
          width={50}
          height={50}
          className="rounded-full"
         
        />
          
 

        {navItems.map((item, index) => (
          <NavItem key={index} href={item.href} label={item.label}>
            {item.icon}
          </NavItem>
        ))}
      </nav>
    </aside>
  );
};

const MobileNav = () => {

    const navItems = [
        { href: "/", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
        { href: "/create-employee", label: "Create Task", icon: <ShoppingCart className="h-5 w-5" /> },
      ];

      
    

  return (
    <Sheet  >
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden" 
        // onClick={handleLinkClick}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="sm:max-w-xs bg-white">
        <nav className="grid gap-6 text-lg font-medium">
        <Image
          src="https://res.cloudinary.com/dga7phidh/image/upload/v1727343700/WhatsApp_Image_2024-09-25_at_20.47.59_9ded0a5f_de6zz7.jpg"
          alt="beestar"
          width={50}
          height={50}
          className="rounded-full"
         
        />
          

          {navItems.map((item, index) => (
            <SheetClose   asChild  key={index}>

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
