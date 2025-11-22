import { useReactFlow } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export default function PropertiesPanel() {
    const { getNodes, setNodes } = useReactFlow();
    const [selectedNode, setSelectedNode] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nodes = getNodes();
            const selected = nodes.find((n) => n.selected);
            if (selected?.id !== selectedNode?.id) {
                setSelectedNode(selected);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [getNodes, selectedNode]);

    const updateNodeData = (key: string, value: any) => {
        if (!selectedNode) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [key]: value,
                        },
                    };
                }
                return node;
            })
        );
        setSelectedNode((prev: any) => ({ ...prev, data: { ...prev.data, [key]: value } }));
    };

    if (!selectedNode) {
        return (
            <Card className="w-80 border-l h-full rounded-none">
                <CardHeader>
                    <CardTitle>Properties</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">Select a node to edit properties.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-80 border-l h-full rounded-none overflow-y-auto">
            <CardHeader>
                <CardTitle>Edit {selectedNode.type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                        value={selectedNode.data.label}
                        onChange={(e) => updateNodeData('label', e.target.value)}
                    />
                </div>

                {selectedNode.type === 'message' && (
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Input
                            value={selectedNode.data.content || ''}
                            onChange={(e) => updateNodeData('content', e.target.value)}
                        />
                    </div>
                )}

                {selectedNode.type === 'question' && (
                    <div className="space-y-2">
                        <Label>Question</Label>
                        <Input
                            value={selectedNode.data.question || ''}
                            onChange={(e) => updateNodeData('question', e.target.value)}
                        />
                    </div>
                )}

                {selectedNode.type === 'button' && (
                    <div className="space-y-2">
                        <Label>Text</Label>
                        <Input
                            value={selectedNode.data.text || ''}
                            onChange={(e) => updateNodeData('text', e.target.value)}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
