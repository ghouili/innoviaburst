# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-08

### SEO & Indexing Fixes

This release addresses Search Console indexing issues and improves PageSpeed Insights scores.

#### Changed

- **index.html**: Removed duplicate `preconnect` links to Google Fonts
- **index.html**: Implemented non-render-blocking font loading using `preload` + `media="print" onload` pattern
- **Footer.tsx**: Changed hash-only links (`/#industries`, `/#work`, `/#resources`) to crawlable standalone page links (`/industries`, `/works`, `/resources`) to improve internal link discoverability in Search Console

#### Added

- **nginx.conf.example**: Sample Nginx configuration with:
  - SPA routing via `try_files $uri $uri/ /index.html` (prevents 5xx on deep links)
  - 1-year immutable caching for hashed `/assets/*` files
  - No-cache headers for HTML to enable fast deployments
  - Security headers (X-Frame-Options, X-Content-Type-Options)
  - Gzip compression for text assets
  
- **scripts/validate-seo.sh**: Bash validation script to verify:
  - All core pages return HTTP 200
  - robots.txt is valid (no unsupported directives)
  - sitemap.xml is accessible and contains URLs
  - Caching headers are correct
  - Security headers are present
  
- **scripts/validate-seo.ps1**: PowerShell version of validation script for Windows

### What Was Already Good

The codebase already had several SEO best practices in place:
- ✅ Route-level code splitting with `React.lazy()` and `Suspense`
- ✅ Sitemap generation in prebuild script
- ✅ robots.txt with standard directives and Sitemap reference
- ✅ `SeoHead` component using react-helmet-async for per-page meta tags
- ✅ Proper canonical URLs
- ✅ JSON-LD structured data (Organization, Website, BreadcrumbList)
- ✅ Responsive hero images with multiple sizes (480, 768, 1024, 1920)

### Validation Checklist

After deploying, run these checks:

```bash
# 1. Test core pages return 200 (not 5xx)
curl -I https://innoviaburst.com/about
curl -I https://innoviaburst.com/trust
curl -I https://innoviaburst.com/privacy
curl -I https://innoviaburst.com/automations

# 2. Verify robots.txt
curl https://innoviaburst.com/robots.txt

# 3. Verify sitemap.xml
curl -I https://innoviaburst.com/sitemap.xml

# 4. Check asset caching headers (find a hashed asset filename from page source)
curl -I https://innoviaburst.com/assets/<some-file>-abc123.js
# Should return: Cache-Control: public, max-age=31536000, immutable

# 5. Run full validation script
./scripts/validate-seo.sh https://innoviaburst.com
# OR on Windows:
# .\scripts\validate-seo.ps1 -BaseUrl "https://innoviaburst.com"

# 6. Run Lighthouse (via Chrome DevTools or CLI)
npx lighthouse https://innoviaburst.com --view

# 7. In Google Search Console:
#    - Submit sitemap.xml
#    - Request indexing for previously 5xx pages
#    - Click "Validate Fix" on the Server Errors issue
```

### Server Configuration Notes

If pages still return 5xx after deployment, check:

1. **Nginx try_files**: Ensure the config includes:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

2. **Static file serving**: Assets in `/dist/assets/` must be served directly, not proxied

3. **No upstream proxy for SPA routes**: If you have a Node backend, ensure it's only for `/api/*` routes

4. **File permissions**: Ensure Nginx can read the `dist/` folder:
   ```bash
   chmod -R 755 /var/www/innoviaburst/dist
   chown -R www-data:www-data /var/www/innoviaburst/dist
   ```

### Performance Notes

- Font loading is now non-render-blocking (reduced render-blocking resources)
- Vite already configured with manual chunks for optimal code splitting
- Hero images available in WebP format with multiple sizes

### Breaking Changes

None.
