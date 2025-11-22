import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from 'react';
import { calendar } from '@/lib/api';
import { Calendar } from 'lucide-react';

export default function BookingNode({ id, data }: { id: string, data: { label: string, serviceId?: string } }) {
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState(data.serviceId || "");
    const { updateNodeData } = useReactFlow();

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await calendar.getServices();
                setServices(data);
            } catch (e) {
                console.error("Failed to load services", e);
            }
        };
        loadServices();
    }, []);

    const handleServiceChange = (value: string) => {
        setSelectedService(value);
        updateNodeData(id, { serviceId: value });
    };

    return (
        <Card className="w-[250px] shadow-md border-blue-200">
            <Handle type="target" position={Position.Top} />
            <CardHeader className="p-4 pb-2 bg-blue-50 rounded-t-lg">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
                    <Calendar className="h-4 w-4" />
                    Booking
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Select Service</Label>
                    <Select value={selectedService} onValueChange={handleServiceChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose service..." />
                        </SelectTrigger>
                        <SelectContent>
                            {services.map((service) => (
                                <SelectItem key={service.id} value={String(service.id)}>
                                    {service.name} ({service.duration}m)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <Handle type="source" position={Position.Bottom} />
        </Card>
    );
}
