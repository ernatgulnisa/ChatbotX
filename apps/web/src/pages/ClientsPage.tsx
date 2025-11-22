import { useEffect, useState } from "react"
import { clients, tags as tagsApi } from "@/lib/api"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command"
import { useToast } from "@/hooks/use-toast"

export default function ClientsPage() {
    const { toast } = useToast()
    const [clientList, setClientList] = useState<any[]>([])
    const [availableTags, setAvailableTags] = useState<any[]>([])

    const fetchData = async () => {
        try {
            const [clientsData, tagsData] = await Promise.all([
                clients.findAll(),
                tagsApi.findAll()
            ])
            setClientList(clientsData)
            setAvailableTags(tagsData)
        } catch (error) {
            console.error("Failed to fetch data", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddTag = async (clientId: number, tagId: number) => {
        try {
            await tagsApi.assign(clientId, tagId)
            fetchData() // Refresh list
            toast({ title: "Tag assigned" })
        } catch (error) {
            toast({ title: "Failed to assign tag", variant: "destructive" })
        }
    }

    const handleRemoveTag = async (clientId: number, tagId: number) => {
        try {
            await tagsApi.remove(clientId, tagId)
            fetchData() // Refresh list
            toast({ title: "Tag removed" })
        } catch (error) {
            toast({ title: "Failed to remove tag", variant: "destructive" })
        }
    }

    const handleCreateTag = async (name: string) => {
        try {
            await tagsApi.create(name)
            fetchData()
            toast({ title: "Tag created" })
        } catch (error) {
            toast({ title: "Failed to create tag", variant: "destructive" })
        }
    }

    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Clients</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of your clients.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Bot</TableHead>
                                <TableHead className="text-right">Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientList.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.id}</TableCell>
                                    <TableCell>{client.name || "Unknown"}</TableCell>
                                    <TableCell>{client.phone}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 items-center">
                                            {client.tags?.map((tag: any) => (
                                                <Badge key={tag.id} variant="outline" style={{ borderColor: tag.color, color: tag.color }}>
                                                    {tag.name}
                                                    <button
                                                        className="ml-1 hover:text-red-500"
                                                        onClick={() => handleRemoveTag(client.id, tag.id)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search or create tag..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                <div className="p-2 text-sm text-muted-foreground">
                                                                    No tags found.
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="w-full justify-start text-sm"
                                                                    onClick={(e) => {
                                                                        const input = e.currentTarget.closest('[cmdk-root]')?.querySelector('input') as HTMLInputElement;
                                                                        if (input?.value) handleCreateTag(input.value);
                                                                    }}
                                                                >
                                                                    Create new tag
                                                                </Button>
                                                            </CommandEmpty>
                                                            <CommandGroup heading="Available Tags">
                                                                {availableTags
                                                                    .filter(tag => !client.tags?.some((t: any) => t.id === tag.id))
                                                                    .map(tag => (
                                                                        <CommandItem
                                                                            key={tag.id}
                                                                            onSelect={() => handleAddTag(client.id, tag.id)}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                                                                                {tag.name}
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                    <TableCell>{client.bot?.name || "N/A"}</TableCell>
                                    <TableCell className="text-right">{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/chats/${client.id}`}>
                                            <Button size="sm">Chat</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
