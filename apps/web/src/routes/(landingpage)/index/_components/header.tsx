import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useNavigateGetStarted } from "../_hooks/use-navigate-get-started";

const NAV_ITEMS = [
	{ label: "Features", to: "features" },
	{ label: "Pricing", to: "pricing" },
];

export const Header = () => {
	const { handleGetStarted } = useNavigateGetStarted();

	return (
		<header
			className={cn(
				"fixed top-0 right-0 left-0 z-50 w-full bg-transparent bg-white",
			)}
		>
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-2 font-bold text-xl">
					<div className="flex items-center justify-center rounded-md text-primary-foreground">
						<img src="/logo.svg" alt="Logo" className="h-8 w-8" />
					</div>
					Fyn
				</Link>
				<div className="flex items-center gap-4">
					<NavigationMenu>
						<NavigationMenuList>
							{NAV_ITEMS.map((item) => {
								return (
									<NavigationMenuItem key={item.to}>
										<NavigationMenuLink
											asChild
											className={navigationMenuTriggerStyle()}
										>
											<Link to="/" hash={item.to}>
												{item.label}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
					<Button className="cursor-pointer" onClick={handleGetStarted}>
						Get Started
					</Button>
				</div>
			</div>
		</header>
	);
};
