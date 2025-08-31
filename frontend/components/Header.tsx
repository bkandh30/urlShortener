"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
							<Link2 className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
							Hash.ly
						</h1>
					</div>

					<Link
						href="/"
						className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
					>
						Home
					</Link>
				</div>
			</div>
		</header>
	);
}
