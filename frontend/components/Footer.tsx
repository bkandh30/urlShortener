"use client";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full border-t bg-card/30 backdrop-blur-sm mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						© {currentYear} Hash.ly. Built with Next.js, Express, TypeScript
						and TailwindCSS.
					</p>
				</div>
			</div>
		</footer>
	);
}
