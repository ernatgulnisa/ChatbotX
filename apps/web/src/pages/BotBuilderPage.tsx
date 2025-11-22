import { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    useReactFlow,
    ReactFlowProvider,
    type Node,
    type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MessageNode from '@/components/custom/nodes/MessageNode';
import QuestionNode from '@/components/custom/nodes/QuestionNode';
import ButtonNode from '@/components/custom/nodes/ButtonNode';
import MediaNode from '@/components/custom/nodes/MediaNode';
import BookingNode from '@/components/custom/nodes/BookingNode';
import { Button } from '@/components/ui/button';
import { bots } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { BOT_TEMPLATES } from '@/lib/templates';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const nodeTypes = {
    message: MessageNode,
    question: QuestionNode,
    button: ButtonNode,
    media: MediaNode,
    booking: BookingNode,
};

const initialNodes: Node[] = [
    { id: '1', position: { x: 250, y: 5 }, data: { label: 'Start' }, type: 'message' },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function BotBuilderPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
    const [botList, setBotList] = useState<{ id: number; name: string }[]>([]);
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const { screenToFlowPosition } = useReactFlow();
    const { toast } = useToast();

    useEffect(() => {
        fetchBots();
    }, []);

    useEffect(() => {
        if (selectedBotId) {
            loadBot(Number(selectedBotId));
        }
    }, [selectedBotId]);

    const fetchBots = async () => {
        try {
            const data = await bots.findAll();
            setBotList(data);
        } catch (error) {
            console.error("Failed to fetch bots", error);
        }
    };

    const loadBot = async (id: number) => {
        try {
            const bot = await bots.findOne(id);
            if (bot.scenario) {
                const scenario = JSON.parse(bot.scenario);
                setNodes(scenario.nodes || []);
                setEdges(scenario.edges || []);
            }
        } catch (error) {
            console.error("Failed to load bot", error);
            toast({ title: "Error", description: "Failed to load bot", variant: "destructive" });
        }
    };

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleSave = async () => {
        if (!selectedBotId) {
            toast({ title: "Error", description: "No bot selected", variant: "destructive" });
            return;
        }
        try {
            const scenario = JSON.stringify({ nodes, edges });
            await bots.update(Number(selectedBotId), { scenario });
            toast({ title: "Success", description: "Bot saved successfully" });
        } catch (error) {
            console.error("Failed to save bot", error);
            toast({ title: "Error", description: "Failed to save bot", variant: "destructive" });
        }
    };

    const loadTemplate = (template: typeof BOT_TEMPLATES[0]) => {
        setNodes(template.nodes);
        setEdges(template.edges);
        setIsTemplatesOpen(false);
        toast({ title: "Template Loaded", description: `Loaded ${template.name}` });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">Bot Builder</h1>
                    <select
                        className="border rounded p-1"
                        value={selectedBotId || ''}
                        onChange={(e) => setSelectedBotId(e.target.value)}
                    >
                        <option value="" disabled>Select Bot</option>
                        {botList.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Templates</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Choose a Template</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {BOT_TEMPLATES.map((template) => (
                                    <div
                                        key={template.id}
                                        className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => loadTemplate(template)}
                                    >
                                        <h3 className="font-semibold">{template.name}</h3>
                                        <p className="text-sm text-gray-500">{template.description}</p>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleSave}>Save Bot</Button>
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="w-48 border-r bg-gray-50 p-4 flex flex-col gap-2">
                    <div className="font-semibold mb-2">Nodes</div>
                    <div
                        className="bg-white p-2 rounded shadow cursor-move border border-gray-200 text-sm"
                        onDragStart={(event) => onDragStart(event, "message")}
                        draggable
                    >
                        Message Node
                    </div>
                    <div
                        className="bg-white p-2 rounded shadow cursor-move border border-gray-200 text-sm"
                        onDragStart={(event) => onDragStart(event, "question")}
                        draggable
                    >
                        Question Node
                    </div>
                    <div
                        className="bg-white p-2 rounded shadow cursor-move border border-gray-200 text-sm"
                        onDragStart={(event) => onDragStart(event, "button")}
                        draggable
                    >
                        Button Node
                    </div>
                    <div
                        className="bg-white p-2 rounded shadow cursor-move border border-gray-200 text-sm"
                        onDragStart={(event) => onDragStart(event, "media")}
                        draggable
                    >
                        Media Node
                    </div>
                    <div
                        className="bg-white p-2 rounded shadow cursor-move border border-gray-200 text-sm"
                        onDragStart={(event) => onDragStart(event, "booking")}
                        draggable
                    >
                        Booking Node
                    </div>
                </div>
                <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}

export default function BotBuilderPageWrapper() {
    return (
        <ReactFlowProvider>
            <BotBuilderPage />
        </ReactFlowProvider>
    );
}
