import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MediaNodeProps {
    data: {
        label: string;
        mediaType?: 'image' | 'document';
        mediaUrl?: string;
        caption?: string;
    };
}

export default function MediaNode({ data }: MediaNodeProps) {
    return (
        <Card className="min-w-[250px] border-purple-500">
            <Handle type="target" position={Position.Top} />
            <CardHeader className="p-3 bg-purple-50">
                <CardTitle className="text-sm font-medium text-purple-700">Media Node</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
                <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                        value={data.mediaType || 'image'}
                        onValueChange={(val) => (data.mediaType = val as 'image' | 'document')}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="document">Document (PDF)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs">Media URL</Label>
                    <Input
                        className="h-8 text-xs"
                        defaultValue={data.mediaUrl}
                        onChange={(e) => (data.mediaUrl = e.target.value)}
                        placeholder="https://example.com/image.png"
                    />
                </div>
                {data.mediaType === 'image' && data.mediaUrl && (
                    <div className="mt-2">
                        <img
                            src={data.mediaUrl}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded border"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                )}
                <div>
                    <Label className="text-xs">Caption (Optional)</Label>
                    <Input
                        className="h-8 text-xs"
                        defaultValue={data.caption}
                        onChange={(e) => (data.caption = e.target.value)}
                        placeholder="Check this out!"
                    />
                </div>
            </CardContent>
            <Handle type="source" position={Position.Bottom} />
        </Card>
    );
}
