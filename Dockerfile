FROM nginx:alpine

RUN apk add --no-cache git \
    && rm -rf /usr/share/nginx/html \
    && git clone https://github.com/kelwynOliveira/portal-home-like.git /usr/share/nginx/html \
    && apk del git

# COPY portal/ /usr/share/nginx/html