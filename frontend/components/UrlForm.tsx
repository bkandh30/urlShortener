"use client";

import { useState } from "react";
import { createLink, LocalLink } from "@/lib/api";
import { formatDate, getTimeUntilExpiry } from "@/lib/utils";
import { Link2 } from "lucide-react";

interface UrlFormProps {
	onLinkCreated: (link: LocalLink) => void;
}

export default function UrlForm({ onLinkCreated }: UrlFormProps) {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState<LocalLink | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(null);

		if (!url) {
			setError("Please enter a URL");
			return;
		}

		setLoading(true);
		try {
			const link = await createLink(url);

			setSuccess(link);
			onLinkCreated(link);
			setUrl("");

			setTimeout(() => setSuccess(null), 5000);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unexpected error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full space-y-8">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<input
						type="url"
						placeholder="https://example.com/very-long-url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className="flex-1 h-14 px-6 text-lg border-2 rounded-2xl bg-white focus:border-primary focus:outline-none transition-all duration-200"
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading || !url.trim()}
						className="h-14 px-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
					>
						<Link2 className="w-5 h-5" />
						{loading ? "Creating..." : "Shorten"}
					</button>
				</div>
			</form>

			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
					{error}
				</div>
			)}

			{success && (
				<div className="p-6 bg-white rounded-2xl shadow-medium border">
					<h3 className="text-lg font-semibold mb-4">
						Link created successfully!
					</h3>
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<div className="flex-1">
							<p className="text-sm text-muted-foreground mb-1">Short URL:</p>
							<p className="text-lg font-mono text-primary break-all">
								{success.shortUrl}
							</p>
						</div>
					</div>
					<div className="mt-4 text-sm text-muted-foreground">
						Expires: {formatDate(success.expiresAt)} (
						{getTimeUntilExpiry(success.expiresAt)})
					</div>
				</div>
			)}
		</div>
	);
}
