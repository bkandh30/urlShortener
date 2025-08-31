"use client";

import { useEffect } from "react";
import { X, Download } from "lucide-react";
import { getQrUrl } from "@/lib/api";
import Image from "next/image";

interface QrModalProps {
	shortId: string;
	isOpen: boolean;
	onClose: () => void;
}

export default function QrModal({ shortId, isOpen, onClose }: QrModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleDownload = (format: "png" | "svg") => {
		const link = document.createElement("a");
		link.href = getQrUrl(shortId, format, 512);
		link.download = `qr-${shortId}.${format}`;
		link.click();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
				>
					<X className="w-5 h-5" />
				</button>

				<h2 className="text-xl font-semibold mb-4">QR Code</h2>

				<div className="flex justify-center mb-4 p-4 bg-gray-50 rounded-lg">
					<Image
						src={getQrUrl(shortId, "png", 256)}
						alt="QR Code"
						width={256}
						height={256}
					/>
				</div>

				<div className="flex gap-2">
					<button
						onClick={() => handleDownload("png")}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Download className="w-4 h-4" />
						Download PNG
					</button>
					<button
						onClick={() => handleDownload("svg")}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<Download className="w-4 h-4" />
						Download SVG
					</button>
				</div>
			</div>
		</div>
	);
}
