import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to install textarea
import { useState } from 'react';

export default function MessageNode({ data }: { data: { label: string, content?: string } }) {
    const [content, setContent] = useState(data.content || "");

    return (
        <Card className="w-[250px] shadow-md">
            <Handle type="target" position={Position.Top} />
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Message</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="space-y-2">
                    <Label htmlFor="content" className="sr-only">Content</Label>
                    <Textarea
                        id="content"
                        placeholder="Type your message..."
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        className="min-h-[80px]"
                    />
                </div>
            </CardContent>
            <Handle type="source" position={Position.Bottom} />
        </Card>
    );
}
