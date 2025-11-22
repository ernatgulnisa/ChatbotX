import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type QuestionNodeProps = {
    data: {
        question?: string;
        variable?: string;
        onChange: (data: any) => void;
    };
};

export default function QuestionNode({ data }: QuestionNodeProps) {
    const handleChange = (field: string, value: string) => {
        data.onChange({ ...data, [field]: value });
    };

    return (
        <Card className="w-64 border-2 border-orange-500">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Ask Question</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
                <div>
                    <Label htmlFor="question" className="text-xs">Question</Label>
                    <Input
                        id="question"
                        value={data.question || ''}
                        onChange={(e) => handleChange('question', e.target.value)}
                        placeholder="What is your name?"
                        className="nodrag"
                    />
                </div>
                <div>
                    <Label htmlFor="variable" className="text-xs">Save Answer To</Label>
                    <Input
                        id="variable"
                        value={data.variable || ''}
                        onChange={(e) => handleChange('variable', e.target.value)}
                        placeholder="e.g. user_name"
                        className="nodrag"
                    />
                </div>
            </CardContent>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </Card>
    );
}
