import { useEffect, useState } from "react"
import { calendar } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar as CalendarIcon, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CalendarPage() {
    const { toast } = useToast()
    const [appointments, setAppointments] = useState<any[]>([])
    const [services, setServices] = useState<any[]>([])
    const [newService, setNewService] = useState({ name: "", duration: 30, price: 0 })

    const fetchData = async () => {
        try {
            const [apptData, serviceData] = await Promise.all([
                calendar.getAppointments(),
                calendar.getServices()
            ])
            setAppointments(apptData)
            setServices(serviceData)
        } catch (error) {
            console.error("Failed to fetch calendar data", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreateService = async () => {
        try {
            await calendar.createService(newService)
            toast({ title: "Service created" })
            fetchData()
            setNewService({ name: "", duration: 30, price: 0 })
        } catch (error) {
            toast({ title: "Error creating service", variant: "destructive" })
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Calendar & Booking</h1>
            </div>

            <Tabs defaultValue="appointments">
                <TabsList className="mb-4">
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointments.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No appointments scheduled.</p>
                            ) : (
                                <div className="space-y-4">
                                    {appointments.map((appt) => (
                                        <div key={appt.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h4 className="font-semibold">{appt.service?.name || "Unknown Service"}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Client: {appt.client?.name || appt.client?.phone}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {new Date(appt.startTime).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <Badge variant={appt.status === 'cancelled' ? 'destructive' : 'default'}>
                                                {appt.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="services">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Service</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Service Name</Label>
                                    <Input
                                        value={newService.name}
                                        onChange={e => setNewService({ ...newService, name: e.target.value })}
                                        placeholder="e.g. Consultation"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Duration (min)</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                className="pl-8"
                                                value={newService.duration}
                                                onChange={e => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Price ($)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                className="pl-8"
                                                value={newService.price}
                                                onChange={e => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={handleCreateService} className="w-full">Add Service</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Existing Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {services.map(service => (
                                        <div key={service.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md">
                                            <span className="font-medium">{service.name}</span>
                                            <div className="text-sm text-muted-foreground flex gap-3">
                                                <span>{service.duration} min</span>
                                                <span>${service.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
