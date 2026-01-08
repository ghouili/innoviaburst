# ================================================================================
# SEO & Performance Validation Checklist (PowerShell)
# ================================================================================
# Run this script after deployment to validate that all SEO fixes are in place.
#
# Usage:
#   .\scripts\validate-seo.ps1 [-BaseUrl "https://innoviaburst.com"]
#
# ================================================================================

param(
    [string]$BaseUrl = "https://innoviaburst.com"
)

$script:Passed = 0
$script:Failed = 0

function Log-Pass {
    param([string]$Message)
    Write-Host "✓ PASS: $Message" -ForegroundColor Green
    $script:Passed++
}

function Log-Fail {
    param([string]$Message)
    Write-Host "✗ FAIL: $Message" -ForegroundColor Red
    $script:Failed++
}

function Log-Warn {
    param([string]$Message)
    Write-Host "⚠ WARN: $Message" -ForegroundColor Yellow
}

function Log-Info {
    param([string]$Message)
    Write-Host "ℹ INFO: $Message" -ForegroundColor Cyan
}

function Check-Status {
    param(
        [string]$Url,
        [int]$Expected,
        [string]$Description
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -ErrorAction Stop
        $status = $response.StatusCode
        
        if ($status -eq $Expected) {
            Log-Pass "$Description (HTTP $status)"
        } else {
            Log-Fail "$Description - Expected $Expected, got $status"
        }
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq $Expected) {
            Log-Pass "$Description (HTTP $status)"
        } else {
            Log-Fail "$Description - Expected $Expected, got $($status ?? 'Error')"
        }
    }
}

function Check-Header {
    param(
        [string]$Url,
        [string]$Header,
        [string]$Pattern,
        [string]$Description
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -ErrorAction Stop
        $headerValue = $response.Headers[$Header]
        
        if ($headerValue -match $Pattern) {
            Log-Pass $Description
        } else {
            Log-Fail "$Description - Header '$Header' not matching '$Pattern'"
            Log-Info "  Got: $headerValue"
        }
    } catch {
        Log-Fail "$Description - Could not fetch URL"
    }
}

function Check-Content {
    param(
        [string]$Url,
        [string]$Pattern,
        [string]$Description
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
        $content = $response.Content
        
        if ($content -match $Pattern) {
            Log-Pass $Description
        } else {
            Log-Fail "$Description - Content not matching pattern '$Pattern'"
        }
    } catch {
        Log-Fail "$Description - Could not fetch URL"
    }
}

Write-Host ""
Write-Host "=============================================="
Write-Host " SEO & Performance Validation"
Write-Host " Base URL: $BaseUrl"
Write-Host "=============================================="
Write-Host ""

# ==========================================
# 1. Core Pages Return 200
# ==========================================
Write-Host "--- 1. Core Pages HTTP Status ---"

$corePages = @(
    "/",
    "/automations",
    "/trust",
    "/resources",
    "/industries",
    "/privacy",
    "/cookies",
    "/terms",
    "/works",
    "/subprocessors",
    "/ai-ops-sprint",
    "/automation-build",
    "/mvp-launch"
)

foreach ($page in $corePages) {
    Check-Status -Url "$BaseUrl$page" -Expected 200 -Description "$page returns 200"
}

Write-Host ""

# ==========================================
# 2. robots.txt Validation
# ==========================================
Write-Host "--- 2. robots.txt Validation ---"

Check-Status -Url "$BaseUrl/robots.txt" -Expected 200 -Description "robots.txt accessible"
Check-Content -Url "$BaseUrl/robots.txt" -Pattern "User-agent" -Description "robots.txt contains User-agent directive"
Check-Content -Url "$BaseUrl/robots.txt" -Pattern "Sitemap:" -Description "robots.txt contains Sitemap reference"

# Check for invalid directives
try {
    $robotsContent = (Invoke-WebRequest -Uri "$BaseUrl/robots.txt" -UseBasicParsing).Content
    if ($robotsContent -match "Content-signal") {
        Log-Fail "robots.txt contains invalid 'Content-signal' directive"
    } else {
        Log-Pass "robots.txt has no invalid directives"
    }
} catch {
    Log-Warn "Could not check robots.txt content"
}

Write-Host ""

# ==========================================
# 3. sitemap.xml Validation
# ==========================================
Write-Host "--- 3. sitemap.xml Validation ---"

Check-Status -Url "$BaseUrl/sitemap.xml" -Expected 200 -Description "sitemap.xml accessible"
Check-Content -Url "$BaseUrl/sitemap.xml" -Pattern "<urlset" -Description "sitemap.xml is valid XML with urlset"
Check-Content -Url "$BaseUrl/sitemap.xml" -Pattern "<loc>$([regex]::Escape($BaseUrl))" -Description "sitemap.xml contains canonical URLs"

# Count URLs in sitemap
try {
    $sitemapContent = (Invoke-WebRequest -Uri "$BaseUrl/sitemap.xml" -UseBasicParsing).Content
    $urlCount = ([regex]::Matches($sitemapContent, "<loc>")).Count
    if ($urlCount -ge 5) {
        Log-Pass "sitemap.xml contains $urlCount URLs (minimum 5)"
    } else {
        Log-Fail "sitemap.xml only has $urlCount URLs (should be at least 5)"
    }
} catch {
    Log-Warn "Could not count sitemap URLs"
}

Write-Host ""

# ==========================================
# 4. SEO Meta Tags
# ==========================================
Write-Host "--- 4. HTML Meta Tags ---"

Check-Content -Url "$BaseUrl/" -Pattern "<title>" -Description "Homepage has <title> tag"
Check-Content -Url "$BaseUrl/" -Pattern "description" -Description "Homepage has meta description"
Check-Content -Url "$BaseUrl/" -Pattern "og:title" -Description "Homepage has Open Graph title"

Write-Host ""

# ==========================================
# Summary
# ==========================================
Write-Host "=============================================="
Write-Host " SUMMARY"
Write-Host "=============================================="
Write-Host " Passed: $script:Passed" -ForegroundColor Green
Write-Host " Failed: $script:Failed" -ForegroundColor Red
Write-Host ""

if ($script:Failed -gt 0) {
    Write-Host "Some checks failed. Review and fix before Search Console validation." -ForegroundColor Red
    exit 1
} else {
    Write-Host "All checks passed! Ready for Search Console validation." -ForegroundColor Green
    exit 0
}
