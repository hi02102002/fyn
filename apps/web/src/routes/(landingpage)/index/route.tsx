import { createFileRoute } from "@tanstack/react-router";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";

export const Route = createFileRoute("/(landingpage)/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<>
			<Header />
			<HeroSection />
		</>
	);
}
