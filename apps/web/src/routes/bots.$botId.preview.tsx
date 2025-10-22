import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/bots/$botId/preview")({
	component: RouteComponent,
});

interface Message {
	type: "bot" | "user";
	content: string;
}

function RouteComponent() {
	const { botId } = Route.useParams();
	const { data: bot } = useQuery(
		orpc.bot.getBot.queryOptions({ input: { botId } }),
	);

	const [messages, setMessages] = useState<Message[]>([]);
	const [currentInput, setCurrentInput] = useState("");
	const [sessionId] = useState(
		`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
	);
	const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
	const [isStarted, setIsStarted] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);

	const executeBot = useMutation({
		...orpc.bot.executeBot.mutationOptions(),
		onSuccess: (result) => {
			// Display the current block
			if (result.currentBlock) {
				const config = result.currentBlock.config as {
					text?: string;
					placeholder?: string;
					options?: string[];
				};

				if (result.currentBlock.type === "text" && config.text) {
					const text = config.text;
					setMessages((prev) => [
						...prev,
						{ type: "bot" as const, content: text },
					]);
				}

				if (result.currentBlock.type === "input" && config.placeholder) {
					const placeholder = config.placeholder;
					setMessages((prev) => [
						...prev,
						{ type: "bot" as const, content: placeholder },
					]);
				}

				if (result.currentBlock.type === "choice" && config.options) {
					setMessages((prev) => [
						...prev,
						{
							type: "bot" as const,
							content: `Choose an option: ${config.options?.join(", ") || ""}`,
						},
					]);
				}
			}

			// Move to next block
			if (result.nextBlock) {
				setCurrentBlockId(result.nextBlock.id);
				// Auto-execute next block if it's text or conditional (no user input needed)
				if (
					result.nextBlock.type === "text" ||
					result.nextBlock.type === "conditional"
				) {
					executeBot.mutate({
						botId,
						sessionId,
						currentBlockId: result.nextBlock.id,
					});
				}
			} else if (result.completed) {
				setIsCompleted(true);
				setMessages((prev) => [
					...prev,
					{
						type: "bot",
						content: "Thank you! The conversation is complete.",
					},
				]);
			}
		},
	});

	const startBot = () => {
		if (bot?.blocks && bot.blocks.length > 0) {
			const firstBlock = bot.blocks[0] as { id: string };
			setIsStarted(true);
			setCurrentBlockId(firstBlock.id);
			executeBot.mutate({
				botId,
				sessionId,
				currentBlockId: firstBlock.id,
			});
		}
	};

	const sendResponse = () => {
		if (currentInput.trim() && currentBlockId) {
			setMessages((prev) => [...prev, { type: "user", content: currentInput }]);
			executeBot.mutate({
				botId,
				sessionId,
				currentBlockId,
				response: currentInput,
			});
			setCurrentInput("");
		}
	};

	const resetBot = () => {
		setMessages([]);
		setCurrentInput("");
		setCurrentBlockId(null);
		setIsStarted(false);
		setIsCompleted(false);
	};

	if (!bot) {
		return (
			<div className="flex h-full items-center justify-center">
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Loading bot...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col bg-gray-50">
			{/* Header */}
			<div className="border-b bg-white px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl">{bot.name} - Preview</h1>
						<p className="text-gray-500 text-sm">{bot.description}</p>
					</div>
					<Button onClick={resetBot} variant="outline">
						Reset
					</Button>
				</div>
			</div>

			{/* Chat Area */}
			<div className="flex-1 overflow-auto">
				<div className="container mx-auto max-w-3xl py-8">
					{!isStarted ? (
						<Card>
							<CardContent className="py-12 text-center">
								<p className="mb-4 text-gray-500">
									Ready to test your bot? Click start to begin.
								</p>
								<Button onClick={startBot}>Start Bot</Button>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`flex ${
										message.type === "user" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`max-w-[80%] rounded-lg px-4 py-2 ${
											message.type === "user"
												? "bg-blue-500 text-white"
												: "border bg-white"
										}`}
									>
										{message.content}
									</div>
								</div>
							))}

							{executeBot.isPending && (
								<div className="flex justify-start">
									<div className="rounded-lg border bg-white px-4 py-2">
										<div className="flex space-x-2">
											<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
											<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
											<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Input Area */}
			{isStarted && !isCompleted && currentBlockId && (
				<div className="border-t bg-white p-4">
					<div className="container mx-auto flex max-w-3xl gap-2">
						<Input
							placeholder="Type your response..."
							value={currentInput}
							onChange={(e) => setCurrentInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									sendResponse();
								}
							}}
							disabled={executeBot.isPending}
						/>
						<Button
							onClick={sendResponse}
							disabled={!currentInput.trim() || executeBot.isPending}
						>
							Send
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
