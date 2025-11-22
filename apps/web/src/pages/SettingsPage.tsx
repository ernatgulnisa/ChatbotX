import { useEffect, useState } from "react"
import { settings as settingsApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Copy, RefreshCw, ExternalLink, Check } from "lucide-react"


export default function SettingsPage() {
    const [settings, setSettings] = useState({
        WHATSAPP_API_TOKEN: "",
        WHATSAPP_PHONE_NUMBER_ID: "",
        WHATSAPP_VERIFY_TOKEN: "",
    })
    const [loading, setLoading] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsApi.get()
                setSettings((prev) => ({ ...prev, ...data }))
            } catch (error) {
                console.error("Failed to fetch settings", error)
            }
        }
        fetchSettings()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await settingsApi.save(settings)
            toast({
                title: "Settings saved",
                description: "Your configuration has been updated successfully.",
            })
        } catch (error) {
            console.error("Failed to save settings", error)
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const generateToken = () => {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        setSettings(prev => ({ ...prev, WHATSAPP_VERIFY_TOKEN: token }))
        toast({ title: "New token generated" })
    }

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(fieldName)
        setTimeout(() => setCopiedField(null), 2000)
        toast({ title: "Copied to clipboard" })
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">System Settings</h1>
                <p className="text-muted-foreground">Configure your WhatsApp Business API integration.</p>
            </div>

            <div className="grid gap-6">
                {/* Webhook Configuration Guide */}
                <Card className="bg-blue-50/50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900 flex items-center gap-2">
                            <RefreshCw className="h-5 w-5" />
                            Webhook Configuration
                        </CardTitle>
                        <CardDescription className="text-blue-700">
                            You need to configure these details in your <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer" className="underline font-medium hover:text-blue-900 inline-flex items-center gap-1">Meta App Dashboard <ExternalLink className="h-3 w-3" /></a>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-blue-900">Callback URL</Label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-200 text-sm font-mono truncate">
                                        {window.location.origin}/api/whatsapp/webhook
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-white border-blue-200 hover:bg-blue-50 text-blue-700"
                                        onClick={() => copyToClipboard(`${window.location.origin}/api/whatsapp/webhook`, 'url')}
                                    >
                                        {copiedField === 'url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-blue-600">
                                    If testing locally, use <strong>ngrok</strong> to get a public URL.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-blue-900">Verify Token</Label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-white px-3 py-2 rounded border border-blue-200 text-sm font-mono truncate">
                                        {settings.WHATSAPP_VERIFY_TOKEN || "Not set"}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-white border-blue-200 hover:bg-blue-50 text-blue-700"
                                        onClick={() => copyToClipboard(settings.WHATSAPP_VERIFY_TOKEN, 'verify_token_display')}
                                        disabled={!settings.WHATSAPP_VERIFY_TOKEN}
                                    >
                                        {copiedField === 'verify_token_display' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Credentials Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Credentials</CardTitle>
                        <CardDescription>
                            Enter your WhatsApp Business API credentials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="WHATSAPP_API_TOKEN">Permanent Access Token</Label>
                            <div className="relative">
                                <Input
                                    id="WHATSAPP_API_TOKEN"
                                    name="WHATSAPP_API_TOKEN"
                                    value={settings.WHATSAPP_API_TOKEN}
                                    onChange={handleChange}
                                    type="password"
                                    className="pr-10 font-mono"
                                    placeholder="EAAG..."
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Found in Business Settings &gt; System Users.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="WHATSAPP_PHONE_NUMBER_ID">Phone Number ID</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="WHATSAPP_PHONE_NUMBER_ID"
                                    name="WHATSAPP_PHONE_NUMBER_ID"
                                    value={settings.WHATSAPP_PHONE_NUMBER_ID}
                                    onChange={handleChange}
                                    placeholder="1234567890"
                                    className="font-mono"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(settings.WHATSAPP_PHONE_NUMBER_ID, 'phone_id')}
                                    disabled={!settings.WHATSAPP_PHONE_NUMBER_ID}
                                >
                                    {copiedField === 'phone_id' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="WHATSAPP_VERIFY_TOKEN">Verify Token</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="WHATSAPP_VERIFY_TOKEN"
                                    name="WHATSAPP_VERIFY_TOKEN"
                                    value={settings.WHATSAPP_VERIFY_TOKEN}
                                    onChange={handleChange}
                                    placeholder="Generate a secure token..."
                                    className="font-mono"
                                />
                                <Button
                                    variant="secondary"
                                    onClick={generateToken}
                                    title="Generate Random Token"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Generate
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(settings.WHATSAPP_VERIFY_TOKEN, 'verify_token_input')}
                                    disabled={!settings.WHATSAPP_VERIFY_TOKEN}
                                >
                                    {copiedField === 'verify_token_input' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Use this same token when configuring the webhook in Meta Dashboard.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
                                {loading ? "Saving..." : "Save Configuration"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
