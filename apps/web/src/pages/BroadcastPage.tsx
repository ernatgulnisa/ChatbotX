import { useEffect, useState } from "react"
import { marketing, tags as tagsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Megaphone, Send, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BroadcastPage() {
    const { toast } = useToast()
    const [message, setMessage] = useState("")
    const [mediaUrl, setMediaUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<{ sentCount: number; total: number } | null>(null)

    const [availableTags, setAvailableTags] = useState<any[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    useEffect(() => {
        const loadTags = async () => {
            try {
                const data = await tagsApi.findAll()
                setAvailableTags(data)
            } catch (e) {
                console.error("Failed to load tags", e)
            }
        }
        loadTags()
    }, [])

    const toggleTag = (tagName: string) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        )
    }

    const handleSend = async () => {
        if (!message.trim() && !mediaUrl.trim()) {
            toast({
                title: "Error",
                description: "Please enter a message or media URL",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        setStats(null)

        try {
            const type = mediaUrl ? "image" : "text"
            const filter = selectedTags.length > 0 ? { tags: selectedTags } : undefined
            const response = await marketing.broadcast(message, type, mediaUrl, filter)

            setStats({
                sentCount: response.sentCount,
                total: response.total
            })

            toast({
                title: "Broadcast Sent",
                description: `Successfully sent to ${response.sentCount} clients.`,
            })

            setMessage("")
            setMediaUrl("")
            setSelectedTags([])
        } catch (error) {
            console.error("Broadcast failed", error)
            toast({
                title: "Error",
                description: "Failed to send broadcast",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Megaphone className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Broadcast Messaging</h1>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Compose Message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Audience Selector */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Audience (Optional)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {availableTags.map(tag => (
                                    <Badge
                                        key={tag.id}
                                        variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            backgroundColor: selectedTags.includes(tag.name) ? tag.color : 'transparent',
                                            borderColor: tag.color,
                                            color: selectedTags.includes(tag.name) ? 'white' : tag.color
                                        }}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                            {selectedTags.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Sending to <strong>ALL</strong> clients. Click tags to filter.
                                </p>
                            )}
                            {selectedTags.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Sending to clients with tags: <strong>{selectedTags.join(", ")}</strong>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Message Text</label>
                            <Textarea
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-[150px]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Media URL (Optional)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <ImageIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        className="pl-8"
                                        value={mediaUrl}
                                        onChange={(e) => setMediaUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Provide a direct link to an image or PDF.
                            </p>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? (
                                "Sending..."
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Broadcast
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {stats && (
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-semibold text-green-800 mb-1">Broadcast Complete!</h3>
                            <p className="text-green-700">
                                Message sent to <strong>{stats.sentCount}</strong> out of <strong>{stats.total}</strong> clients.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
