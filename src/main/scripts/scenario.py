import sys
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.offsetbox as offsetbox
from PIL import Image

# Caminhos para os arquivos
ed_file_path = "./src/main/scripts/devices.csv"  
gw_file_path = "./src/main/scripts/gateways.csv"
icon_path = "./resources/tower.png"

# Abre a imagem do ícone a ser usada como marcador para os gateways
marker_img = Image.open(icon_path).convert("RGBA")
marker_size = 30  # Tamanho do marcador em pontos
icon_zoom = 0.5 # Zoom do ícone (ajuste conforme necessário)

def plot_gateway_positions(ed_file_path, gw_file_path):
    # Lendo os arquivos CSV
    ed_positions = pd.read_csv(ed_file_path)
    gw_positions = pd.read_csv(gw_file_path)
    print(ed_positions)
    print(gw_positions)

    # Configuração do plot
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.scatter(ed_positions['lat'], ed_positions['lng'], marker='o', alpha=0.3, color='#1f77b4', label='End Devices')
    
    # Usando Bbox para plotar a imagem como marcador
    for x, y in zip(gw_positions['lat'], gw_positions['lng']):
        ab = offsetbox.AnnotationBbox(
            offsetbox.OffsetImage(marker_img, zoom=icon_zoom),
            (x, y), frameon=False, box_alignment=(0.5, 0.5))
        ax.add_artist(ab)

    ax.set_title("Gateway and End Device Positions")
    ax.set_xlabel("Latitude")
    ax.set_ylabel("Longitude")
    plt.legend()
    # plt.grid(True)
    plt.savefig('./src/main/scripts/img/complete-positions.png')
    plt.show()  # Se desejar visualizar a imagem diretamente

def execute():
    plot_gateway_positions(ed_file_path, gw_file_path)

if __name__ == "__main__":
    execute()
