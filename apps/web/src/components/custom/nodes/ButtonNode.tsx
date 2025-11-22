import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

type ButtonNodeProps = {
    data: {
        message?: string;
        buttons?: { id: string; label: string }[];
        onChange: (data: any) => void;
    };
};

export default function ButtonNode({ data }: ButtonNodeProps) {
    const buttons = data.buttons || [];

    const handleChange = (field: string, value: any) => {
        data.onChange({ ...data, [field]: value });
    };

    const addButton = () => {
        const newButton = { id: crypto.randomUUID(), label: 'New Option' };
        handleChange('buttons', [...buttons, newButton]);
    };

    const updateButton = (id: string, label: string) => {
        const newButtons = buttons.map((b) => (b.id === id ? { ...b, label } : b));
        handleChange('buttons', newButtons);
    };

    const removeButton = (id: string) => {
        const newButtons = buttons.filter((b) => b.id !== id);
        handleChange('buttons', newButtons);
    };

    return (
        <Card className="w-64 border-2 border-purple-500">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Buttons</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
                <div>
                    <Label className="text-xs">Message</Label>
                    <Input
                        value={data.message || ''}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Choose an option:"
                        className="nodrag"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Options</Label>
                    {buttons.map((btn, index) => (
                        <div key={btn.id} className="relative flex items-center gap-2">
                            <Input
                                value={btn.label}
                                onChange={(e) => updateButton(btn.id, e.target.value)}
                                className="nodrag h-8 text-sm"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                onClick={() => removeButton(btn.id)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                            {/* Each button acts as a source handle */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={btn.id}
                                style={{ top: 10 + index * 40, right: -10, background: '#a855f7' }}
                            />
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={addButton}
                    >
                        <Plus className="h-3 w-3 mr-1" /> Add Button
                    </Button>
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} />
        </Card>
    );
}
