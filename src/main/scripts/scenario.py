import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.offsetbox as offsetbox
from PIL import Image

# Caminhos para os arquivos
ed_file_path = "./src/main/scripts/devices.csv"
gw_file_path = "./src/main/scripts/gateways.csv"
icon_path = "./public/tower.png"

marker_img = Image.open(icon_path).convert("RGBA")
marker_size = 30
icon_zoom = 0.5

def plot_gateway_positions(ed_file_path, gw_file_path):
    # Especifica as colunas manualmente, pois os arquivos não têm cabeçalhos
    ed_positions = pd.read_csv(ed_file_path, header=None, names=['lat', 'lng'])
    gw_positions = pd.read_csv(gw_file_path, header=None, names=['lat', 'lng'])

    print(ed_positions)
    print(gw_positions)

    # Configuração do plot
    _, ax = plt.subplots(figsize=(8, 6))
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
    plt.show()

def execute():
    plot_gateway_positions(ed_file_path, gw_file_path)

if __name__ == "__main__":
    execute()
