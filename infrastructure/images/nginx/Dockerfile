FROM fabiocicerchia/nginx-lua:1.19.6-alpine3.13.0

RUN apk add --no-cache lua5.1-dev luarocks5.1
RUN luarocks-5.1 install lua-resty-template
RUN apk del lua5.1-dev luarocks5.1
