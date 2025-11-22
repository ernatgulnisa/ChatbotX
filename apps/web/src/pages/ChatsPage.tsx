import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { messages, clients } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"

export default function ChatsPage() {
    const { clientId } = useParams<{ clientId: string }>()
    const navigate = useNavigate()
    const [clientList, setClientList] = useState<any[]>([])
    const [filteredClients, setFilteredClients] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [messageList, setMessageList] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Fetch Clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await clients.findAll()
                setClientList(data)
                setFilteredClients(data)
            } catch (error) {
                console.error("Failed to fetch clients", error)
            }
        }
        fetchClients()
    }, [])

    // Filter Clients
    useEffect(() => {
        if (searchQuery) {
            setFilteredClients(clientList.filter(c =>
                c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.phone.includes(searchQuery)
            ))
        } else {
            setFilteredClients(clientList)
        }
    }, [searchQuery, clientList])

    // Select Client based on URL
    useEffect(() => {
        if (clientId && clientList.length > 0) {
            const client = clientList.find(c => c.id === +clientId)
            if (client) {
                setSelectedClient(client)
            }
        }
    }, [clientId, clientList])

    // Fetch Messages for Selected Client
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedClient) {
                try {
                    const data = await messages.findAll(selectedClient.id)
                    setMessageList(data)
                } catch (error) {
                    console.error("Failed to fetch messages", error)
                }
            }
        }

        if (selectedClient) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 3000)
            return () => clearInterval(interval)
        } else {
            setMessageList([])
        }
    }, [selectedClient])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messageList])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedClient) return

        try {
            await messages.create(newMessage, "bot", selectedClient.id, selectedClient.botId)
            setNewMessage("")
            // Refresh messages immediately
            const data = await messages.findAll(selectedClient.id)
            setMessageList(data)
        } catch (error) {
            console.error("Failed to send message", error)
        }
    }

    const handleClientSelect = (client: any) => {
        setSelectedClient(client)
        navigate(`/chats/${client.id}`)
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar - Client List */}
            <div className="w-1/3 border-r bg-white flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Chats</h2>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search clients..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {filteredClients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => handleClientSelect(client)}
                                className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition-colors text-left ${selectedClient?.id === client.id ? "bg-gray-100" : ""
                                    }`}
                            >
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name || client.phone}`} />
                                    <AvatarFallback>{client.name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="font-medium truncate">{client.name || "Unknown"}</div>
                                    <div className="text-sm text-muted-foreground truncate">{client.phone}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content - Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedClient ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedClient.name || selectedClient.phone}`} />
                                <AvatarFallback>{selectedClient.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-bold">{selectedClient.name || "Unknown"}</div>
                                <div className="text-sm text-muted-foreground">{selectedClient.phone}</div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ded8]">
                            {messageList.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "bot" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.sender === "bot"
                                            ? "bg-[#dcf8c6] text-black"
                                            : "bg-white text-black"
                                            }`}
                                    >
                                        {msg.content}
                                        <div className="text-[10px] text-gray-500 text-right mt-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage}>Send</Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 text-muted-foreground">
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Select a chat to start messaging</h3>
                            <p>Choose a client from the sidebar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
