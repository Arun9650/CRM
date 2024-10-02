'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Import the select component

const formSchema = z.object({
	EmployeeName: z
		.string()
		.min(2, { message: 'Employee Name must be at least 2 characters.' }),
	EmployeePhoneNo: z
		.string()
		.regex(/^\d{10}$/, {
			message: 'Invalid phone number. Must contain exactly 10 digits.',
		}),
	EmployeeEmail: z.string().email({ message: 'Invalid email address.' }),
	EmployeeUsername: z
		.string()
		.min(2, { message: 'Username must be at least 2 characters.' }),
	EmployeePassword: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters.' }),
	EmployeeStatus: z.enum(['Active', 'Inactive'], { required_error: 'Please select a status.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCardForm() {
	const { width, height } = useWindowSize();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			EmployeeName: '',
			EmployeePhoneNo: '',
			EmployeeEmail: '',
			EmployeeUsername: '',
			EmployeePassword: '',
			EmployeeStatus: 'Active', // Default value can be 'Active'
		},
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);

	async function onSubmit(values: FormValues) {
		setIsLoading(true);

		const apiEndpoint = '/api/employee/create';

		const res = await fetch(apiEndpoint, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(values),
		});

		if (res.ok) {
			setShowConfetti(true);
		}

		setIsLoading(false);
	}

	return (
		<div className="z-50">
			<Confetti width={width} height={height} recycle={false} run={showConfetti} />
			<Card className="p-6 rounded-xl">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="EmployeeName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Employee Name</FormLabel>
									<FormControl>
										<Input placeholder="Employee Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="EmployeePhoneNo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder="Employee Phone Number"
											{...field}
											onFocus={(e) => {
												if (e.target.value === '0') {
													e.target.value = '';
												}
											}}
											onBlur={(e) => {
												if (e.target.value === '') {
													e.target.value = '0';
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="EmployeeEmail"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Employee Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="Employee Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="EmployeeUsername"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder="Employee Username" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="EmployeePassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Employee Password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status Select Dropdown */}
						<FormField
							control={form.control}
							name="EmployeeStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select Status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Active">Active</SelectItem>
												<SelectItem value="Inactive">Inactive</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isLoading} className="w-40">
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								'Add Employee'
							)}
						</Button>
					</form>
				</Form>
			</Card>
		</div>
	);
}
