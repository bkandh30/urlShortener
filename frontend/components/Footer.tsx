"use client";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full border-t bg-card/30 backdrop-blur-sm mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p className="text-sm text-muted-foreground whitespace-nowrap">
						{/* First Span */}
						<span>© {currentYear} Hash.ly</span>

						<span className="mx-2">|</span>

						{/* Second Span */}
						<span>
							Built with Next.js, Node.js, Express, TypeScript and TailwindCSS
						</span>

						<span className="mx-2">|</span>

						{/* Third Span */}
						<span>
							Developed by{" "}
							<a
								href="https://github.com/bkandh30/urlShortener"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium text-blue-600 hover:underline"
							>
								Bhavya Kandhari
							</a>
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
