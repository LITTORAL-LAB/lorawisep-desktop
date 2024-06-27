import json
import matplotlib.pyplot as plt

def plot_positions(coordinates):
    lats = [coord['lat'] for coord in coordinates]
    lngs = [coord['lng'] for coord in coordinates]

    plt.figure(figsize=(8, 6))
    plt.scatter(x=lngs, y=lats, marker='o', alpha=0.5, color='#1f77b4')
    plt.title("Devices Positions")
    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    # plt.grid(True)
    plt.savefig('/home/pedro/Documentos/Github/LoRaWISEP-desktop/lorawisep/src/main/scripts/img/devices.png')
    # plt.show()

def execute():
    # Coordenadas fornecidas no formato JSON
    coordinates_json = '''
    [
        {"lat": 119.55368538923005, "lng": 244.4298740293207},
        {"lat": 373.12942722313534, "lng": 295.6267794245304},
        {"lat": 639.4117733492361, "lng": 597.7631141890638},
        {"lat": 299.0824534350203, "lng": 213.46770375760872},
        {"lat": 354.6700631248887, "lng": 300.5359324190797},
        {"lat": 638.4429583935145, "lng": 132.72259309723688},
        {"lat": 73.17776241940943, "lng": 203.81009924519634},
        {"lat": 694.2094076085201, "lng": 188.02567837953643},
        {"lat": 499.7528784338916, "lng": 109.26167117767527},
        {"lat": 516.848191748555, "lng": 328.1227109676834}
    ]
    '''

    coordinates = json.loads(coordinates_json)
    plot_positions(coordinates)

if __name__ == "__main__":
    execute()
