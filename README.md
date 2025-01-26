

# **LoRaWAN Simulation Interface**

A **LoRaWAN Simulation Interface** é uma interface gráfica projetada para facilitar a execução de simulações em redes **LoRaWAN**, eliminando a complexidade de configurar e executar essas simulações manualmente. Esta ferramenta combina a simplicidade de uma interface intuitiva com o poder de algoritmos avançados de **machine learning** e o simulador de redes **NS-3**.

---

## **Objetivo**

Nosso objetivo é fornecer uma ferramenta acessível e poderosa para profissionais, pesquisadores e estudantes que desejam realizar simulações em redes LoRaWAN. Com esta interface, é possível configurar cenários personalizados, ajustar parâmetros avançados e obter resultados rapidamente, sem a necessidade de interagir diretamente com scripts ou linhas de comando.

---

## **Principais Funcionalidades**

### 🛠️ **Configuração Simplificada**
- Configure parâmetros essenciais da simulação, como:
  - **Tempo de Simulação**: Defina o período total da simulação em segundos.
  - **Área de Simulação**: Especifique largura, altura e quantidade de dispositivos.
  - **Modelo de Perda de Propagação**: Escolha entre diferentes modelos para refletir condições reais do ambiente (ex.: urbano, rural).

### ⚡ **Algoritmos Inteligentes**
- Utilize algoritmos de **machine learning** para otimizar a configuração da rede:
  - Algoritmos para determinar o número ideal de gateways (**Elbow Method**, **Gap Statistic**).
  - Algoritmos para posicionamento ideal de gateways (**K-Means**, **PSO**, **Genetic Algorithm**).

### 📊 **Simulação Avançada**
- A interface executa simulações realistas utilizando o **NS-3** por baixo dos panos, oferecendo precisão e flexibilidade no comportamento da rede.

### 🖥️ **Interface Intuitiva**
- Uma interface gráfica amigável, desenvolvida com tecnologias modernas como **React**, **TailwindCSS** e **Electron**, para tornar a experiência do usuário fluida e agradável.

---

## **Como Funciona?**

1. **Configuração do Projeto**:
   - Defina o nome, descrição e cenário da simulação (urbano ou rural).
   - Ajuste a largura, altura e número de dispositivos no ambiente de simulação.

2. **Seleção de Algoritmos**:
   - Escolha algoritmos para otimização da rede (quantidade e posicionamento de gateways).
   - Ajuste parâmetros adicionais para personalizar o comportamento da simulação.

3. **Execução da Simulação**:
   - A interface configura e executa o simulador **NS-3** com base nos parâmetros fornecidos.
   - Utilize os algoritmos de **machine learning** para otimizar a rede.

4. **Resultados**:
   - Visualize resultados da simulação, como cobertura da rede, desempenho do gateway e eficiência geral.

---

## **Tecnologias Utilizadas**

### **Frontend**
- **React**: Para a construção da interface de usuário.
- **TailwindCSS**: Para estilização moderna e responsiva.
- **Electron**: Para oferecer uma experiência desktop multiplataforma.

### **Backend**
- **NS-3**: Simulador de redes avançado, utilizado para simular a comunicação LoRaWAN.
- **Machine Learning**: Algoritmos otimizados para análise e tomada de decisão durante a simulação.

---

## **Instalação**

### **Pré-requisitos**
- **Node.js** (versão 14 ou superior)
- **Git**

### **Passo a passo**
1. Clone o repositório:
   ```bash
   git clone https://github.com/LITTORAL-LAB/LoRaWISEP-desktop
   cd LoRaWISEP-desktop
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação:
   ```bash
   npm start
   ```

4. Caso deseje construir o executável:
   ```bash
   npm run build
   ```

