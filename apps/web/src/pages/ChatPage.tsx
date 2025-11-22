import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { messages, clients } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatPage() {
    const { clientId } = useParams<{ clientId: string }>()
    const [messageList, setMessageList] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [client, setClient] = useState<any>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchClient = async () => {
            if (clientId) {
                try {
                    const data = await clients.findOne(+clientId)
                    setClient(data)
                } catch (error) {
                    console.error("Failed to fetch client", error)
                }
            }
        }
        fetchClient()
    }, [clientId])

    useEffect(() => {
        const fetchMessages = async () => {
            if (clientId) {
                try {
                    const data = await messages.findAll(+clientId)
                    setMessageList(data)
                } catch (error) {
                    console.error("Failed to fetch messages", error)
                }
            }
        }
        fetchMessages()
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [clientId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messageList])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !clientId || !client) return

        try {
            await messages.create(newMessage, "bot", +clientId, client.botId)
            setNewMessage("")
            // Refresh messages immediately
            const data = await messages.findAll(+clientId)
            setMessageList(data)
        } catch (error) {
            console.error("Failed to send message", error)
        }
    }

    return (
        <div className="p-8 h-screen flex flex-col">
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Chat with {client?.name || "Client"}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messageList.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "bot" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "bot"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-black"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
