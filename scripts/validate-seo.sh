#!/usr/bin/env bash
# ================================================================================
# SEO & Performance Validation Checklist
# ================================================================================
# Run this script after deployment to validate that all SEO fixes are in place.
#
# Usage:
#   chmod +x scripts/validate-seo.sh
#   ./scripts/validate-seo.sh [base_url]
#
# Default base URL: https://innoviaburst.com
# ================================================================================

set -e

BASE_URL="${1:-https://innoviaburst.com}"
PASSED=0
FAILED=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
}

log_info() {
    echo -e "ℹ INFO: $1"
}

check_status() {
    local url="$1"
    local expected="$2"
    local desc="$3"
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status" = "$expected" ]; then
        log_pass "$desc (HTTP $status)"
    else
        log_fail "$desc - Expected $expected, got $status"
    fi
}

check_header() {
    local url="$1"
    local header="$2"
    local pattern="$3"
    local desc="$4"
    
    value=$(curl -sI "$url" 2>/dev/null | grep -i "^$header:" | head -1 || echo "")
    
    if echo "$value" | grep -qi "$pattern"; then
        log_pass "$desc"
    else
        log_fail "$desc - Header '$header' not matching '$pattern'"
        log_info "  Got: $value"
    fi
}

check_content() {
    local url="$1"
    local pattern="$2"
    local desc="$3"
    
    content=$(curl -s "$url" 2>/dev/null | head -c 5000 || echo "")
    
    if echo "$content" | grep -qi "$pattern"; then
        log_pass "$desc"
    else
        log_fail "$desc - Content not matching pattern '$pattern'"
    fi
}

echo ""
echo "=============================================="
echo " SEO & Performance Validation"
echo " Base URL: $BASE_URL"
echo "=============================================="
echo ""

# ==========================================
# 1. Core Pages Return 200
# ==========================================
echo "--- 1. Core Pages HTTP Status ---"

CORE_PAGES=(
    "/"
    "/automations"
    "/trust"
    "/resources"
    "/industries"
    "/privacy"
    "/cookies"
    "/terms"
    "/works"
    "/subprocessors"
    "/ai-ops-sprint"
    "/automation-build"
    "/mvp-launch"
)

for page in "${CORE_PAGES[@]}"; do
    check_status "$BASE_URL$page" "200" "$page returns 200"
done

echo ""

# ==========================================
# 2. robots.txt Validation
# ==========================================
echo "--- 2. robots.txt Validation ---"

check_status "$BASE_URL/robots.txt" "200" "robots.txt accessible"
check_header "$BASE_URL/robots.txt" "content-type" "text/plain" "robots.txt content-type is text/plain"
check_content "$BASE_URL/robots.txt" "User-agent" "robots.txt contains User-agent directive"
check_content "$BASE_URL/robots.txt" "Sitemap:" "robots.txt contains Sitemap reference"

# Check for invalid directives
robots_content=$(curl -s "$BASE_URL/robots.txt" 2>/dev/null || echo "")
if echo "$robots_content" | grep -qi "Content-signal"; then
    log_fail "robots.txt contains invalid 'Content-signal' directive"
else
    log_pass "robots.txt has no invalid directives"
fi

echo ""

# ==========================================
# 3. sitemap.xml Validation
# ==========================================
echo "--- 3. sitemap.xml Validation ---"

check_status "$BASE_URL/sitemap.xml" "200" "sitemap.xml accessible"
check_header "$BASE_URL/sitemap.xml" "content-type" "xml" "sitemap.xml content-type contains xml"
check_content "$BASE_URL/sitemap.xml" "<urlset" "sitemap.xml is valid XML with urlset"
check_content "$BASE_URL/sitemap.xml" "<loc>$BASE_URL" "sitemap.xml contains canonical URLs"

# Count URLs in sitemap
url_count=$(curl -s "$BASE_URL/sitemap.xml" 2>/dev/null | grep -c "<loc>" || echo "0")
if [ "$url_count" -ge "5" ]; then
    log_pass "sitemap.xml contains $url_count URLs (minimum 5)"
else
    log_fail "sitemap.xml only has $url_count URLs (should be at least 5)"
fi

echo ""

# ==========================================
# 4. Caching Headers
# ==========================================
echo "--- 4. Caching Headers ---"

# Check index.html is NOT cached long-term
check_header "$BASE_URL/" "cache-control" "no-cache\|max-age=0\|must-revalidate" "HTML has short/no cache"

# Check assets have long cache (try to find a hashed asset)
# This might fail if we can't find an asset URL
asset_url=$(curl -s "$BASE_URL/" 2>/dev/null | grep -oP '(?<=src="|href=")[^"]*assets/[^"]+' | head -1 || echo "")
if [ -n "$asset_url" ]; then
    if [[ "$asset_url" != http* ]]; then
        asset_url="$BASE_URL$asset_url"
    fi
    check_header "$asset_url" "cache-control" "immutable\|max-age=31536000" "Hashed assets have 1-year cache"
else
    log_warn "Could not find hashed asset to test caching headers"
fi

echo ""

# ==========================================
# 5. Security Headers
# ==========================================
echo "--- 5. Security Headers ---"

check_header "$BASE_URL/" "x-content-type-options" "nosniff" "X-Content-Type-Options: nosniff"
check_header "$BASE_URL/" "x-frame-options" "SAMEORIGIN\|DENY" "X-Frame-Options present"

echo ""

# ==========================================
# 6. SEO Meta Tags (requires JavaScript rendering)
# ==========================================
echo "--- 6. HTML Meta Tags (initial render) ---"

check_content "$BASE_URL/" "<title>" "Homepage has <title> tag"
check_content "$BASE_URL/" "description" "Homepage has meta description"
check_content "$BASE_URL/" "og:title" "Homepage has Open Graph title"

echo ""

# ==========================================
# Summary
# ==========================================
echo "=============================================="
echo " SUMMARY"
echo "=============================================="
echo -e " ${GREEN}Passed${NC}: $PASSED"
echo -e " ${RED}Failed${NC}: $FAILED"
echo ""

if [ "$FAILED" -gt 0 ]; then
    echo -e "${RED}Some checks failed. Review and fix before Search Console validation.${NC}"
    exit 1
else
    echo -e "${GREEN}All checks passed! Ready for Search Console validation.${NC}"
    exit 0
fi
