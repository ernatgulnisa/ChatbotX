import { useEffect, useState } from "react"
import { deals, clients } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Deal = {
    id: number
    status: string
    value: number
    client: {
        name: string
        phone: string
    }
}

const COLUMNS = [
    { id: "new", title: "New" },
    { id: "in_progress", title: "In Progress" },
    { id: "won", title: "Won" },
    { id: "lost", title: "Lost" },
]

export default function DealsPage() {
    const [allDeals, setAllDeals] = useState<Deal[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newDeal, setNewDeal] = useState({ clientId: "", value: 0, status: "new" })
    const [clientList, setClientList] = useState<{ id: number; name: string }[]>([])

    useEffect(() => {
        fetchDeals()
        fetchClients()
    }, [])

    const fetchDeals = async () => {
        try {
            const data = await deals.findAll()
            setAllDeals(data)
        } catch (error) {
            console.error("Failed to fetch deals", error)
        }
    }

    const fetchClients = async () => {
        try {
            const data = await clients.findAll()
            setClientList(data)
        } catch (error) {
            console.error("Failed to fetch clients", error)
        }
    }

    const handleCreate = async () => {
        try {
            await deals.create(Number(newDeal.clientId), newDeal.status, Number(newDeal.value))
            setIsCreateOpen(false)
            fetchDeals()
        } catch (error) {
            console.error("Failed to create deal", error)
        }
    }

    const handleMove = async (dealId: number, newStatus: string) => {
        try {
            // Optimistic update
            setAllDeals((prev) =>
                prev.map((d) => (d.id === dealId ? { ...d, status: newStatus } : d))
            )
            await deals.update(dealId, { status: newStatus })
        } catch (error) {
            console.error("Failed to update deal", error)
            fetchDeals() // Revert on error
        }
    }

    return (
        <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Deals Pipeline</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Deal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Deal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Client</Label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newDeal.clientId}
                                    onChange={(e) => setNewDeal({ ...newDeal, clientId: e.target.value })}
                                >
                                    <option value="" disabled>Select client</option>
                                    {clientList.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name || "Unnamed"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Value ($)</Label>
                                <Input
                                    type="number"
                                    value={newDeal.value}
                                    onChange={(e) =>
                                        setNewDeal({ ...newDeal, value: Number(e.target.value) })
                                    }
                                />
                            </div>
                        </div>
                        <Button onClick={handleCreate} className="w-full">
                            Create Deal
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
                {COLUMNS.map((col) => (
                    <div key={col.id} className="flex flex-col bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-4 text-gray-500 uppercase text-sm">
                            {col.title}
                        </h3>
                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {allDeals
                                .filter((d) => d.status === col.id)
                                .map((deal) => (
                                    <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="font-medium">{deal.client?.name || "Unknown Client"}</div>
                                            <div className="text-sm text-gray-500">
                                                ${deal.value.toLocaleString()}
                                            </div>
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {col.id !== "new" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10px]"
                                                        onClick={() => handleMove(deal.id, "new")}
                                                    >
                                                        New
                                                    </Button>
                                                )}
                                                {col.id !== "in_progress" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10px]"
                                                        onClick={() => handleMove(deal.id, "in_progress")}
                                                    >
                                                        WIP
                                                    </Button>
                                                )}
                                                {col.id !== "won" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10px] text-green-600 border-green-200 hover:bg-green-50"
                                                        onClick={() => handleMove(deal.id, "won")}
                                                    >
                                                        Won
                                                    </Button>
                                                )}
                                                {col.id !== "lost" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10px] text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => handleMove(deal.id, "lost")}
                                                    >
                                                        Lost
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
