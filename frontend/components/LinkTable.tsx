"use client";

import { useEffect, useState } from "react";
import { QrCode, ExternalLink, TrendingUp } from "lucide-react";
import { getStats, LocalLink, getShortUrl } from "@/lib/api";
import { StatsResponse } from "@bkandh30/common-url-shortener";
import { formatDate, getTimeUntilExpiry, cn } from "@/lib/utils";
import CopyButton from "./CopyButton";
import QrModal from "./QrModal";

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
			<div className="text-center py-12 text-gray-500">
				<p className="text-lg mb-2">No links created yet</p>
				<p className="text-sm">Create your first short link above</p>
			</div>
		);
	}

	return (
		<>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 px-4 font-medium text-gray-700">
								Original URL
							</th>
							<th className="text-left py-3 px-4 font-medium text-gray-700">
								Short URL
							</th>
							<th className="text-center py-3 px-4 font-medium text-gray-700">
								Clicks
							</th>
							<th className="text-left py-3 px-4 font-medium text-gray-700">
								Created
							</th>
							<th className="text-left py-3 px-4 font-medium text-gray-700">
								Status
							</th>
							<th className="text-center py-3 px-4 font-medium text-gray-700">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{linksWithStats.map((link) => {
							const status =
								link.stats?.status ||
								(new Date(link.expiresAt) < new Date() ? "expired" : "active");
							const isExpired = status === "expired";

							return (
								<tr
									key={link.shortId}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-4">
										<div className="max-w-xs truncate text-sm">
											<a
												href={link.longUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-600 hover:text-gray-900 hover:underline"
												title={link.longUrl}
											>
												{link.longUrl}
											</a>
										</div>
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center gap-1">
											<a
												href={getShortUrl(link.shortId)}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline text-sm font-mono"
											>
												{link.shortId}
											</a>
											<CopyButton text={getShortUrl(link.shortId)} />
										</div>
									</td>
									<td className="py-3 px-4 text-center">
										{link.loading ? (
											<span className="text-gray-400">...</span>
										) : (
											<div className="flex items-center justify-center gap-1">
												<TrendingUp className="w-4 h-4 text-gray-400" />
												<span className="font-medium">
													{link.stats?.clicks || 0}
												</span>
											</div>
										)}
									</td>
									<td className="py-3 px-4">
										<div className="text-sm text-gray-600">
											{formatDate(link.createdAt)}
										</div>
									</td>
									<td className="py-3 px-4">
										<span
											className={cn(
												"inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
												isExpired
													? "bg-red-100 text-red-700"
													: "bg-green-100 text-green-700",
											)}
										>
											{isExpired
												? "Expired"
												: getTimeUntilExpiry(link.expiresAt)}
										</span>
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center justify-center gap-2">
											<button
												onClick={() => setSelectedQr(link.shortId)}
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title="View QR Code"
											>
												<QrCode className="w-4 h-4 text-gray-600" />
											</button>
											<a
												href={getShortUrl(link.shortId)}
												target="_blank"
												rel="noopener noreferrer"
												className="p-1.5 hover:bg-gray-100 rounded transition-colors"
												title="Open link"
											>
												<ExternalLink className="w-4 h-4 text-gray-600" />
											</a>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
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
