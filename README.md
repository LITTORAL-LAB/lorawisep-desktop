# LoRaWISEP

**LoRaWISEP** é uma ferramenta de simulação e otimização para redes LoRaWAN projetada para facilitar o planejamento, avaliação de desempenho e otimização de infraestrutura de redes IoT. Este projeto integra o framework **Electron** com o **Network Simulator 3 (NS-3)**.

---

## 📚 Funcionalidades

- Simulação de redes LoRaWAN com dispositivos e gateways.
- Otimização de posicionamento de gateways baseada em algoritmos como K-Means.
- Análise de métricas como atraso, RSSI, SNR e distância.
- Visualização de resultados diretamente na interface do usuário.

---

## 🖼️ Exemplos da Interface

### 1. **Mapa com Gateways e Dispositivos**
Veja como os dispositivos e gateways são distribuídos no mapa após a configuração da simulação:

![Mapa com Gateways e Dispositivos](https://github.com/LITTORAL-LAB/lorawisep-desktop/blob/main/public/map.png)

---

### 2. **Processamento da Simulação**
Durante a execução da simulação, é exibido um estado de processamento:

![Processamento da Simulação](https://github.com/LITTORAL-LAB/lorawisep-desktop/blob/main/public/processing_simulation.png)

---

### 3. **Resultados da Simulação**
Os resultados são apresentados em um formato claro e visual, destacando métricas importantes:

![Resultados da Simulação](https://github.com/LITTORAL-LAB/lorawisep-desktop/blob/main/public/results.png)

---

## 🛠️ Configuração do Ambiente

### 1. Clonar o Repositório
```bash
git clone https://github.com/LITTORAL-LAB/lorawisep-desktop
cd lorawisep-desktop
```

### 2. Ativar o Ambiente Virtual do Python

Certifique-se de ter o Python instalado em sua máquina. Para criar e ativar um ambiente virtual:
```bash
python3 -m venv .venv
source .venv/bin/activate   # Linux/MacOS
# No Windows:
# .venv\Scripts\activate
```

### 3. Instalar as Dependências Python
```bash
pip install -r requirements.txt
```

### 4. Instalar o Network Simulator 3 (NS-3)

Baixe e instale o **NS-3** e o módulo **LoRaWAN** seguindo as instruções fornecidas no repositório oficial:
- **Repositório do LoRaWAN**: [https://github.com/signetlabdei/lorawan](https://github.com/signetlabdei/lorawan)

Após configurar o NS-3 e o módulo LoRaWAN, certifique-se de que o caminho do diretório NS-3 está configurado corretamente nas variáveis de ambiente (ver próxima seção).

---

## 🌐 Configuração das Variáveis de Ambiente

Edite o arquivo `.env` ou configure as variáveis de ambiente diretamente no seu sistema:

```bash
VITE_PATH_TO_NS3=caminho_para/ns-3-dev/
VITE_PATH_TO_ROOT=caminho_para/lorawisep-desktop/
```

### 5. Instalar as Dependências do Projeto (Electron)

Certifique-se de ter o **Node.js** e o **npm** instalados. Instale as dependências do projeto:
```bash
npm install
```

---

## 🚀 Executando o Projeto

### Modo de Desenvolvimento
Para iniciar o projeto em modo de desenvolvimento:
```bash
npm run dev
```

### Build de Produção
Para gerar o build de produção:
```bash
npm run build
```

---

## 📄 Publicações Associadas

### 1. Artigo Publicado no **FiCloud 2024**
> **LoRaWISEP: A Simulation and Optimization Tool for LoRaWAN IoT Networks**

**Referência BibTeX**:
```bibtex
@INPROCEEDINGS{10743063,
  author={Abreu, Pedro F. F. and de O. Mendes, Luis H. and Sarmento Neto, Geraldo A. and da Silva, Thiago A. R. and da S. Veloso, Artur F. and de Vasconcelos, Fillipe M. and Leao, Erico M. and dos Reis Junior, José V.},
  booktitle={2024 11th International Conference on Future Internet of Things and Cloud (FiCloud)}, 
  title={LoRaWISEP: A Simulation and Optimization Tool for LoRaWAN IoT Networks}, 
  year={2024},
  pages={91-97},
  doi={10.1109/FiCloud62933.2024.00022}
}
```

---

### 2. Artigo Publicado no **SBESC 2024**
> **LoRaWISEP+: A Comprehensive Tool for Strategic Gateway Placement in LoRaWAN Networks**

**Referência BibTeX**:
```bibtex
@inproceedings{sbesc_estendido,
 author = {Pedro F. Abreu and Luís H. Mendes and Geraldo Sarmento Neto and Thiago Silva and Artur F. Veloso and Erico Leão e José dos Reis Junior},
 title = { LoRaWISEP+: A Comprehensive Tool for Strategic Gateway Placement in LoRaWAN Networks},
 booktitle = {Anais Estendidos do XIV Simpósio Brasileiro de Engenharia de Sistemas Computacionais},
 location = {Recife/PE},
 year = {2024},
 pages = {17--20},
 doi = {10.5753/sbesc_estendido.2024.243700},
 url = {https://sol.sbc.org.br/index.php/sbesc_estendido/article/view/32254}
}
```