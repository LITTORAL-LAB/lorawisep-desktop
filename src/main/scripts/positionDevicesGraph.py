
import matplotlib.pyplot as plt
import sys
import csv


def plot_positions_from_csv(file_path):
    coordinates = []
    with open(file_path, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)  # Skip the header row
        for row in reader:
            lat, lng = map(float, row)
            coordinates.append({'lat': lat, 'lng': lng})

    lats = [coord['lat'] for coord in coordinates]
    lngs = [coord['lng'] for coord in coordinates]

    plt.figure(figsize=(8, 6))
    plt.scatter(lngs, lats, marker='o', alpha=0.5, color='#1f77b4')
    plt.title("Device Positions")
    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    # plt.grid(True)
    plt.savefig('/home/pedro/Documentos/Github/LoRaWISEP-desktop/lorawisep/src/main/scripts/img/devices.png')
    plt.show()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("File path not provided")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    plot_positions_from_csv(csv_file_path)