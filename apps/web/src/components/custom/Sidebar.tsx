import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Card className="w-64 border-r h-full rounded-none">
            <CardHeader>
                <CardTitle>Nodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div
                    className="p-2 border rounded cursor-move bg-blue-50 border-blue-200 text-blue-700"
                    onDragStart={(event) => onDragStart(event, 'message')}
                    draggable
                >
                    Message Node
                </div>
                <div
                    className="p-2 border rounded cursor-move bg-yellow-50 border-yellow-200 text-yellow-700"
                    onDragStart={(event) => onDragStart(event, 'question')}
                    draggable
                >
                    Question Node
                </div>
                <div
                    className="p-2 border rounded cursor-move bg-green-50 border-green-200 text-green-700"
                    onDragStart={(event) => onDragStart(event, 'button')}
                    draggable
                >
                    Button Node
                </div>
            </CardContent>
        </Card>
    );
}
