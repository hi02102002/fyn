import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { useNavigateGetStarted } from "../_hooks/use-navigate-get-started";

export const HeroSection = () => {
	const { handleGetStarted } = useNavigateGetStarted();

	return (
		<div
			style={{
				backgroundImage: "url(/landing-page/hero.png)",
			}}
			className="relative mx-auto min-h-[500px] w-full w-full max-w-8xl bg-cover bg-top-right bg-no-repeat lg:min-h-svh"
		>
			<div
				style={{
					backgroundImage:
						"linear-gradient(180deg,rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 0) 100%)",
				}}
				className="absolute inset-0 h-[80%] w-full"
			/>
			<div
				style={{
					backgroundImage:
						"linear-gradient(360deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
				}}
				className="absolute bottom-0 h-[5%] w-full"
			/>
			<div
				style={{
					backgroundImage:
						"linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
				}}
				className="absolute left-0 h-full w-[5%]"
			/>
			<div
				style={{
					backgroundImage:
						"linear-gradient(-90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
				}}
				className="absolute right-0 h-full w-[5%]"
			/>
			<div className="container relative z-10 mx-auto h-full min-h-[500px] items-center justify-center px-4 pt-24 sm:pt-80 lg:min-h-svh">
				<div className="flex flex-col items-center">
					<H1 className="text-center font-semibold text-shadow-md">
						<span className="block w-full">Master your focus with</span>
						<span className="block w-full text-blue-600">
							deep work sessions
						</span>
					</H1>
					<p className="mt-4 text-center font-medium text-lg text-primary md:text-xl">
						A minimal Pomodoro timer for deep work. Stay focused and reclaim
						your time.
					</p>
					<Button
						size="lg"
						onClick={handleGetStarted}
						className="mt-6 cursor-pointer"
					>
						Get Started
					</Button>
				</div>
			</div>
		</div>
	);
};
