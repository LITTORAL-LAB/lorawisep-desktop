# Etapa 1: Base Ubuntu com dependências do sistema
FROM ubuntu:22.04 AS builder

# Atualiza pacotes e instala dependências do ns-3
RUN apt-get update && apt-get install -y \
    g++ python3 python3-venv python3-pip cmake ninja-build git ccache \
    curl wget build-essential clang \
    && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /opt/

# Clona o ns-3-dev
RUN git clone https://gitlab.com/nsnam/ns-3-dev.git && cd ns-3-dev \
    && git clone https://github.com/signetlabdei/lorawan src/lorawan \
    && tag=$(< src/lorawan/NS3-VERSION) && tag=${tag#release } && git checkout $tag -b $tag

# Configura e compila o ns-3 com o módulo LoRaWAN
WORKDIR /opt/ns-3-dev
RUN ./ns3 configure --enable-tests --enable-examples --enable-modules=lorawan \
    && ./ns3 build

# Etapa 2: Criar uma imagem final mais leve
FROM ubuntu:22.04

# Define diretório de trabalho
WORKDIR /app

# Copia apenas o ns-3 compilado da etapa anterior
COPY --from=builder /opt/ns-3-dev /opt/ns-3-dev

# Instala dependências do projeto
RUN apt-get update && apt-get install -y python3 python3-venv python3-pip nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Copia o código-fonte do LoRaWISEP
COPY . /app

# Cria e ativa ambiente virtual Python
RUN python3 -m venv .venv \
    && source .venv/bin/activate \
    && pip install --no-cache-dir -r requirements.txt

# Instala dependências do Electron
RUN npm install

# Configura variáveis de ambiente
ENV VITE_PATH_TO_NS3=/opt/ns-3-dev/
ENV VITE_PATH_TO_ROOT=/app/

# Expor a porta do Electron
EXPOSE 3000

# Comando para iniciar o Electron em modo desenvolvimento
CMD ["npm", "run", "dev"]
