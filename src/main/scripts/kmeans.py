import csv
import pandas as pd
from sklearn.cluster import KMeans
from yellowbrick.cluster import KElbowVisualizer
import sys
import os

def read_coordinates_from_csv(file_path):
    data = pd.read_csv(file_path, skiprows=1, names=['lat', 'lng'])
    return pd.DataFrame(data, columns=['lat', 'lng'])

def find_optimal_clusters(df, max_cluster):
    kmeans = KMeans()
    visualizer = KElbowVisualizer(kmeans, k=(1, max_cluster), timings=False)
    visualizer.fit(df[['lat', 'lng']])
    return visualizer.elbow_value_

def perform_clustering(df, num_clusters):
    kmeans = KMeans(n_clusters=num_clusters)
    kmeans.fit(df[['lat', 'lng']])
    return kmeans.cluster_centers_

def save_gateways_to_csv(gateways, file_path):
    with open(file_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['lat', 'lng'])  # Adicionando o cabeçalho
        for gateway in gateways:
            writer.writerow([gateway[0], gateway[1]])

def main():
    if len(sys.argv) < 2:
        print("CSV file path not provided.")
        sys.exit(1)

    input_file_path = sys.argv[1]
    devices_df = read_coordinates_from_csv(input_file_path)

    n_clusters = find_optimal_clusters(devices_df, max(devices_df.shape[0], 2))
    gateways = perform_clustering(devices_df, n_clusters)

    project_dir = os.path.dirname(__file__)
    output_file_path = os.path.join(project_dir, "gateways.csv")

    save_gateways_to_csv(gateways, output_file_path)
    print("Gateways saved to CSV at:", output_file_path)

if __name__ == "__main__":
    main()
