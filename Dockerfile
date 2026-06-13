# === Stage 1 : Build Angular (statique) ===
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build en mode production statique
RUN npm run build --configuration=production

# === Stage 2 : Nginx ===
FROM nginx:alpine

# Copie le build (le dossier browser contient les fichiers statiques de l'application)
COPY --from=build /app/dist/blog-front/browser /usr/share/nginx/html

# Si Angular génère un index.csr.html à la place de index.html, on le renomme pour Nginx
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; fi

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1