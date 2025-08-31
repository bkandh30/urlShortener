"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UrlForm from "@/components/UrlForm";
import LinkTable from "@/components/LinkTable";
import { LocalLink } from "@/lib/api";

const STORAGE_KEY = "url-shortener-links";

export default function Home() {
	const [links, setLinks] = useState<LocalLink[]>([]);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsedLinks = JSON.parse(stored);
				setLinks(parsedLinks);
			} catch (error) {
				console.error("Failed to parse stored links:", error);
			}
		}
	}, []);

	useEffect(() => {
		if (links.length > 0) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
		}
	}, [links]);

	const handleLinkCreated = (link: LocalLink) => {
		setLinks((prev) => [link, ...prev]);
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Header Section */}
			<Header />

			<main className="flex-1">
				{/* Hero Section */}
				<section className="py-20 px-4 bg-gradient-to-b from-blue-50/50 to-transparent">
					<div className="container mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
							Shorten Your URLs
						</h1>
						<p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
							Create beautiful, short links with QR codes.
							<br className="hidden md:block" />
							Clean, fast, and professional URL shortening.
						</p>

						<div className="max-w-4xl mx-auto">
							<UrlForm onLinkCreated={handleLinkCreated} />
						</div>
					</div>
				</section>

				{/* Links Section */}
				<section className="py-12 px-4">
					<div className="container mx-auto max-w-6xl">
						<LinkTable links={links} />
					</div>
				</section>
			</main>

			{/* Footer Section */}
			<Footer />
		</div>
	);
}
