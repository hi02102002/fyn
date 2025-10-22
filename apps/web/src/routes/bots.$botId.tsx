import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

export const Route = createFileRoute("/bots/$botId")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/login",
				throw: true,
			});
		}
		return { session };
	},
});

type BlockType = "text" | "input" | "choice" | "conditional";

interface Block {
	id: string;
	type: BlockType;
	config: {
		text?: string;
		placeholder?: string;
		options?: string[];
		variable?: string;
		condition?: {
			variable: string;
			operator: "equals" | "contains" | "greaterThan" | "lessThan";
			value: string;
		};
	};
	position?: {
		x: number;
		y: number;
	};
	connections?: string[];
}

function RouteComponent() {
	const { botId } = Route.useParams();
	const { data: bot, isLoading } = useQuery(
		orpc.bot.getBot.queryOptions({ input: { botId } }),
	);

	const [blocks, setBlocks] = useState<Block[]>([]);
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
	const [blockPaletteOpen, setBlockPaletteOpen] = useState(false);

	// Initialize blocks when bot data is loaded
	useState(() => {
		if (bot?.blocks) {
			setBlocks(bot.blocks as Block[]);
		}
	});

	const updateBot = useMutation({
		...orpc.bot.updateBot.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bot", "getBot", { input: { botId } }],
			});
		},
	});

	const addBlock = (type: BlockType) => {
		const newBlock: Block = {
			id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
			type,
			config: {
				text: type === "text" ? "Hello! Enter your message here." : undefined,
				placeholder: type === "input" ? "Enter your response..." : undefined,
				options: type === "choice" ? ["Option 1", "Option 2"] : undefined,
				variable: type === "input" ? "response" : undefined,
			},
			position: { x: 100, y: blocks.length * 120 + 100 },
			connections: [],
		};

		setBlocks([...blocks, newBlock]);
		setSelectedBlockId(newBlock.id);
		setBlockPaletteOpen(false);
	};

	const updateBlockConfig = (
		blockId: string,
		config: Partial<Block["config"]>,
	) => {
		setBlocks(
			blocks.map((block) =>
				block.id === blockId
					? { ...block, config: { ...block.config, ...config } }
					: block,
			),
		);
	};

	const deleteBlock = (blockId: string) => {
		setBlocks(blocks.filter((block) => block.id !== blockId));
		setSelectedBlockId(null);
	};

	const connectBlocks = (fromId: string, toId: string) => {
		setBlocks(
			blocks.map((block) => {
				if (block.id === fromId) {
					const connections = block.connections || [];
					if (!connections.includes(toId)) {
						return { ...block, connections: [...connections, toId] };
					}
				}
				return block;
			}),
		);
	};

	const saveBot = () => {
		updateBot.mutate({
			botId,
			blocks,
		});
	};

	const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="mb-4 h-8 animate-pulse rounded bg-gray-200" />
				<div className="h-96 animate-pulse rounded bg-gray-100" />
			</div>
		);
	}

	if (!bot) {
		return (
			<div className="container mx-auto py-8">
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-gray-500">Bot not found</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="border-b bg-white px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl">{bot.name}</h1>
						<p className="text-gray-500 text-sm">{bot.description}</p>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setBlockPaletteOpen(!blockPaletteOpen)}
						>
							{blockPaletteOpen ? "Hide Blocks" : "Add Blocks"}
						</Button>
						<Button onClick={saveBot} disabled={updateBot.isPending}>
							{updateBot.isPending ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* Block Palette */}
				{blockPaletteOpen && (
					<div className="w-64 overflow-y-auto border-r bg-white p-4">
						<h2 className="mb-4 font-semibold">Block Types</h2>
						<div className="space-y-2">
							<Button
								variant="outline"
								className="w-full justify-start"
								onClick={() => addBlock("text")}
							>
								📝 Text
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								onClick={() => addBlock("input")}
							>
								✏️ Input
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								onClick={() => addBlock("choice")}
							>
								🔘 Choice
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								onClick={() => addBlock("conditional")}
							>
								🔀 Conditional
							</Button>
						</div>
					</div>
				)}

				{/* Canvas */}
				<div className="flex-1 overflow-auto bg-gray-50 p-8">
					<div className="max-w-4xl space-y-4">
						{blocks.length === 0 ? (
							<Card>
								<CardContent className="py-12 text-center">
									<p className="mb-4 text-gray-500">
										No blocks yet. Add blocks to build your bot flow.
									</p>
									<Button onClick={() => setBlockPaletteOpen(true)}>
										Add Your First Block
									</Button>
								</CardContent>
							</Card>
						) : (
							blocks.map((block, index) => (
								<Card
									key={block.id}
									className={`cursor-pointer transition-all ${
										selectedBlockId === block.id ? "ring-2 ring-blue-500" : ""
									}`}
									onClick={() => setSelectedBlockId(block.id)}
								>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="font-medium text-sm">
												Block {index + 1}: {block.type.toUpperCase()}
											</CardTitle>
											<div className="flex gap-2">
												{index < blocks.length - 1 && (
													<Button
														size="sm"
														variant="ghost"
														onClick={(e) => {
															e.stopPropagation();
															connectBlocks(block.id, blocks[index + 1].id);
														}}
													>
														↓ Connect
													</Button>
												)}
												<Button
													size="sm"
													variant="ghost"
													onClick={(e) => {
														e.stopPropagation();
														deleteBlock(block.id);
													}}
												>
													🗑️
												</Button>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="text-sm">
											{block.type === "text" && (
												<p className="text-gray-700">{block.config.text}</p>
											)}
											{block.type === "input" && (
												<p className="text-gray-500 italic">
													Input: {block.config.placeholder}
												</p>
											)}
											{block.type === "choice" && (
												<div>
													{block.config.options?.map((opt, i) => (
														<div key={i} className="text-gray-600">
															• {opt}
														</div>
													))}
												</div>
											)}
											{block.type === "conditional" && (
												<p className="text-gray-600">Conditional logic</p>
											)}
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</div>

				{/* Configuration Panel */}
				{selectedBlock && (
					<div className="w-80 overflow-y-auto border-l bg-white p-4">
						<h2 className="mb-4 font-semibold">Block Settings</h2>
						<div className="space-y-4">
							<div>
								<Label className="text-gray-500 text-xs">Block ID</Label>
								<p className="font-mono text-sm">{selectedBlock.id}</p>
							</div>

							<div>
								<Label className="text-gray-500 text-xs">Type</Label>
								<p className="text-sm">{selectedBlock.type}</p>
							</div>

							{selectedBlock.type === "text" && (
								<div>
									<Label htmlFor="text-content">Message</Label>
									<Input
										id="text-content"
										value={selectedBlock.config.text || ""}
										onChange={(e) =>
											updateBlockConfig(selectedBlock.id, {
												text: e.target.value,
											})
										}
									/>
								</div>
							)}

							{selectedBlock.type === "input" && (
								<>
									<div>
										<Label htmlFor="input-placeholder">Placeholder</Label>
										<Input
											id="input-placeholder"
											value={selectedBlock.config.placeholder || ""}
											onChange={(e) =>
												updateBlockConfig(selectedBlock.id, {
													placeholder: e.target.value,
												})
											}
										/>
									</div>
									<div>
										<Label htmlFor="input-variable">Variable Name</Label>
										<Input
											id="input-variable"
											value={selectedBlock.config.variable || ""}
											onChange={(e) =>
												updateBlockConfig(selectedBlock.id, {
													variable: e.target.value,
												})
											}
										/>
									</div>
								</>
							)}

							{selectedBlock.type === "choice" && (
								<div>
									<Label>Options (one per line)</Label>
									<textarea
										className="w-full rounded border p-2 text-sm"
										rows={4}
										value={selectedBlock.config.options?.join("\n") || ""}
										onChange={(e) =>
											updateBlockConfig(selectedBlock.id, {
												options: e.target.value
													.split("\n")
													.filter((s) => s.trim()),
											})
										}
									/>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
