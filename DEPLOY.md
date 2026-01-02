# Deploiement

## Sitemap/robots verification
- Construire le site: `npm run build` (prebuild genere le sitemap, postbuild verifie les assets).
- Synchroniser le contenu de `dist/` vers le web root Nginx configure pour innoviaburst.com (exemple: `/var/www/innoviaburst`).
- Sur le serveur: `ls -la <web_root>/sitemap.xml` et `ls -la <web_root>/robots.txt` doivent repondre avec des fichiers presents.
- Via Cloudflare/origin: `curl -I https://innoviaburst.com/sitemap.xml` doit retourner HTTP 200 avec un content-type XML.
