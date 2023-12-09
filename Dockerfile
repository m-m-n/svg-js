FROM debian:stable-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates zip unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://deno.land/x/install/install.sh | sh

COPY ./scripts /scripts
COPY ./resources /resources

CMD [ "/root/.deno/bin/deno", "run", "--allow-read", "--allow-write", "/scripts/index.ts" ]

