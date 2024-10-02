'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
	href,
	label,
	children,
}: {
	href: string;
	label: string;
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<Link href={href}>
			<div
				className={clsx(
					'flex items-center  gap-4 px-6 py-3 hover:bg-indigo-800 cursor-pointer',
					{
						'text-indigo-100 bg-indigo-800': pathname === href,
					}
				)}
			>
				{children}
				<span className="">{label}</span>
			</div>
		</Link>
	);
}
