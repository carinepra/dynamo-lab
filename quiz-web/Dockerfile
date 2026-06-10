# ============================================
# FRONTEND - DynamoDB Quiz (Nginx)
# ============================================
FROM nginx:alpine

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos estáticos
COPY index.html /usr/share/nginx/html/
COPY completion.html /usr/share/nginx/html/
COPY completion-test.html /usr/share/nginx/html/
COPY clear-cache.html /usr/share/nginx/html/
COPY componentes-quest.css /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Criar diretório de logs
RUN mkdir -p /var/log/nginx

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

