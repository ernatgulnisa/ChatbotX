import { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MessageNode from './nodes/MessageNode';
import QuestionNode from './nodes/QuestionNode';
import ButtonNode from './nodes/ButtonNode';

const nodeTypes = {
    message: MessageNode,
    question: QuestionNode,
    button: ButtonNode,
};

const initialNodes = [
    { id: '1', type: 'message', position: { x: 0, y: 0 }, data: { label: 'Start', content: 'Hello! Welcome to our bot.' } },
    { id: '2', type: 'question', position: { x: 0, y: 150 }, data: { label: 'Ask Name', question: 'What is your name?' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function BotCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

            // TODO: Calculate position based on mouse coordinates relative to canvas
            const position = { x: event.clientX - 300, y: event.clientY - 100 }; // Rough approximation

            const newNode = {
                id: `${type}-${nodes.length + 1}`,
                type,
                position,
                data: { label: `${type} node` },
            } as any;

            setNodes((nds) => nds.concat(newNode));
        },
        [nodes, setNodes],
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
