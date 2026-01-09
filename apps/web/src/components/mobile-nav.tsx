import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
	title: string;
	href: string;
	isActive?: boolean;
}

interface NavSection {
	title: string;
	items: NavItem[];
}

interface MobileNavProps {
	navigation: NavSection[];
	currentTitle: string;
}

export function MobileNav({ navigation, currentTitle }: MobileNavProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="lg:hidden">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between rounded-md border bg-background px-4 py-2 text-sm font-medium"
			>
				<span>{currentTitle}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={cn("transition-transform", isOpen && "rotate-180")}
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>

			{isOpen && (
				<div className="absolute left-0 right-0 z-50 mt-2 rounded-md border bg-background p-4 shadow-lg">
					<nav className="space-y-4">
						{navigation.map((section) => (
							<div key={section.title}>
								<h4 className="mb-2 text-sm font-semibold text-foreground">
									{section.title}
								</h4>
								<ul className="space-y-1">
									{section.items.map((item) => (
										<li key={item.href}>
											<a
												href={item.href}
												className={cn(
													"block rounded-md px-2 py-1.5 text-sm transition-colors",
													item.isActive
														? "bg-muted font-medium text-foreground"
														: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
												)}
												onClick={() => setIsOpen(false)}
											>
												{item.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>
			)}
		</div>
	);
}
