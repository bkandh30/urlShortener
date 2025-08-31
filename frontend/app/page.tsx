"use client";

import UrlForm from "@/components/UrlForm";
import LinkTable from "@/components/LinkTable";
import { Link2 } from "lucide-react";
import { LocalLink } from "@/lib/api";
import { useState, useEffect } from "react";

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
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="flex items-center justify-center gap-2 mb-4">
						<Link2 className="w-8 h-8 text-blue-600" />
						<h1 className="text-3xl font-bold text-gray-900">URL Shortener</h1>
					</div>
					<p className="text-gray-600">
						Create short, shareable links with QR codes and analytics
					</p>
				</div>

				{/* Form Section */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
					<UrlForm onLinkCreated={handleLinkCreated} />
				</div>

				{/* Links Table Section */}
				<div className="bg-white rounded-lg shadow-sm">
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
						<p className="text-sm text-gray-600 mt-1">
							Links are stored locally in your browser
						</p>
					</div>
					<div className="p-6">
						<LinkTable links={links} />
					</div>
				</div>
			</div>
		</div>
	);
}
