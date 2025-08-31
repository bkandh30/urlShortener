"use client";

import { useEffect, useState } from "react";
import { QrCode, ExternalLink, TrendingUp, Calendar } from "lucide-react";
import { getStats, LocalLink, getShortUrl } from "@/lib/api";
import { StatsResponse } from "@bkandh30/common-url-shortener";
import { formatDate } from "@/lib/utils";
import QrModal from "./QrModal";
import CopyButton from "./CopyButton";

interface LinkTableProps {
	links: LocalLink[];
}

interface LinkWithStats extends LocalLink {
	stats?: StatsResponse;
	loading?: boolean;
}

export default function LinkTable({ links }: LinkTableProps) {
	const [linksWithStats, setLinksWithStats] = useState<LinkWithStats[]>([]);
	const [selectedQr, setSelectedQr] = useState<string | null>(null);

	useEffect(() => {
		setLinksWithStats(links.map((link) => ({ ...link, loading: true })));

		links.forEach(async (link) => {
			try {
				const stats = await getStats(link.shortId);
				setLinksWithStats((prev) =>
					prev.map((l) =>
						l.shortId === link.shortId ? { ...l, stats, loading: false } : l,
					),
				);
			} catch (error) {
				console.error(`Failed to fetch stats for ${link.shortId}:`, error);
				setLinksWithStats((prev) =>
					prev.map((l) =>
						l.shortId === link.shortId ? { ...l, loading: false } : l,
					),
				);
			}
		});
	}, [links]);

	if (links.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-2xl flex items-center justify-center">
					<ExternalLink className="w-12 h-12 text-muted-foreground" />
				</div>
				<h3 className="text-xl font-semibold mb-2">No links yet</h3>
				<p className="text-muted-foreground">
					Paste a URL above to get started with your first shortened link
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4">
				<h2 className="text-2xl font-bold mb-6">Your Links</h2>

				<div className="space-y-4">
					{linksWithStats.map((link) => {
						const isExpired = new Date(link.expiresAt) < new Date();

						return (
							<div
								key={link.shortId}
								className={`p-6 bg-card rounded-2xl border transition-all duration-200 hover:shadow-medium ${
									isExpired && "border-destructive/50 bg-destructive/5"
								}`}
							>
								<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
									<div className="flex-1 space-y-3">
										<div>
											<div className="flex items-center gap-2 mb-1">
												<p className="text-sm text-muted-foreground">
													Original URL
												</p>
												{isExpired && (
													<span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
														Expired
													</span>
												)}
											</div>
											<a
												href={link.longUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-foreground hover:text-primary transition-colors break-all"
												title={link.longUrl}
											>
												{link.longUrl.length > 60
													? link.longUrl.substring(0, 60) + "..."
													: link.longUrl}
											</a>
										</div>

										<div>
											<p className="text-sm text-muted-foreground mb-1">
												Short URL
											</p>
											<p className="font-mono text-primary font-medium">
												{getShortUrl(link.shortId)}
											</p>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
										<div className="flex items-center gap-6 text-sm text-muted-foreground">
											<div className="flex items-center gap-1" title="Clicks">
												<TrendingUp className="w-4 h-4" />
												<span>{link.stats?.clicks || 0} clicks</span>
											</div>
											<div
												className="flex items-center gap-1"
												title={`Created on ${formatDate(link.createdAt)}`}
											>
												<Calendar className="w-4 h-4" />
												<span>{formatDate(link.createdAt)}</span>
											</div>
										</div>

										<div className="flex items-center gap-2">
											{/* Replaced inline button with CopyButton component */}
											<CopyButton text={getShortUrl(link.shortId)} />
											<button
												onClick={() => setSelectedQr(link.shortId)}
												className="p-2 hover:bg-secondary rounded-lg transition-colors"
												title="View QR Code"
											>
												<QrCode className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{selectedQr && (
				<QrModal
					shortId={selectedQr}
					isOpen={true}
					onClose={() => setSelectedQr(null)}
				/>
			)}
		</>
	);
}
