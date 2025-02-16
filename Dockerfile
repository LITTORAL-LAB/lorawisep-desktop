# Etapa 1: Instalar dependências do Python e Node.js
FROM ubuntu:22.04 AS builder

# Atualizar pacotes e instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    python3 python3-venv python3-pip \
    nodejs npm \
    git curl wget build-essential \
    cmake clang g++ \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Clonar o repositório do NS-3 e configurar LoRaWAN
RUN git clone https://github.com/signetlabdei/lorawan /opt/lorawan \
    && cd /opt/lorawan \
    && ./waf configure --enable-examples --enable-tests \
    && ./waf build

# Copiar o código-fonte do LoRaWISEP para o container
COPY . /app

# Criar ambiente virtual do Python e instalar dependências
RUN python3 -m venv .venv \
    && source .venv/bin/activate \
    && pip install --no-cache-dir -r requirements.txt

# Instalar dependências do Electron
RUN npm install

# Etapa 2: Criar uma imagem final mais leve
FROM ubuntu:22.04

WORKDIR /app

# Copiar apenas o necessário da imagem builder
COPY --from=builder /opt/lorawan /opt/lorawan
COPY --from=builder /app /app

# Configurar variáveis de ambiente
ENV VITE_PATH_TO_NS3=/opt/lorawan/
ENV VITE_PATH_TO_ROOT=/app/

# Expor a porta do Electron
EXPOSE 3000

# Definir o comando para rodar o projeto
CMD ["npm", "run", "dev"]
