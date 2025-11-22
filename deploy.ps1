param (
    [Parameter(Mandatory=$true)]
    [string]$IpAddress,
    [string]$User = "root"
)

$RemotePath = "/root/botx"

Write-Host "🚀 Starting deployment to $IpAddress..." -ForegroundColor Cyan

# 1. Check for SSH connection
Write-Host "Checking connection..."
ssh -o ConnectTimeout=5 "$User@$IpAddress" "echo Connection successful"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Could not connect to $IpAddress. Please check your IP and SSH key."
    exit 1
}

# 2. Copy Files
Write-Host "📂 Copying project files..." -ForegroundColor Yellow
# Exclude node_modules and .git to save time
scp -r -O . "$User@$($IpAddress):$RemotePath"

# 3. Execute Remote Setup
Write-Host "⚙️  Configuring remote server..." -ForegroundColor Yellow
$Script = @"
    set -e
    cd $RemotePath

    # Install Docker if missing
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
    fi

    # Create .env if missing
    if [ ! -f .env ]; then
        echo "Creating default .env..."
        echo "DATABASE_URL='file:./dev.db'" > .env
        echo "JWT_SECRET='$(openssl rand -hex 32)'" >> .env
        # Placeholders - user should edit these
        echo "WHATSAPP_API_TOKEN=''" >> .env
        echo "WHATSAPP_PHONE_NUMBER_ID=''" >> .env
        echo "WHATSAPP_VERIFY_TOKEN=''" >> .env
    fi

    # Build and Start
    echo "Building and starting containers..."
    docker compose down
    docker compose up -d --build
    
    echo "✅ Deployment Complete!"
"@

ssh "$User@$IpAddress" "bash -s" <<EOF
$Script
EOF

Write-Host "🎉 Done! Your app is running at http://$IpAddress" -ForegroundColor Green
Write-Host "📝 NOTE: You may need to edit .env on the server to add your WhatsApp credentials." -ForegroundColor Gray
