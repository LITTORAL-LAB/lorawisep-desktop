import pandas as pd
import json

status_folder_path = 'src/main/scripts/output'


def load_data_from_folder02(folder_path):
    _, avg_rssi, avg_snr, avg_dist, avg_delay = [], [], [], [], []
    df = pd.read_csv(f'{folder_path}/status.csv')
    avg_delay.append(df['delay'].mean())
    avg_dist.append(df['dist'].mean(skipna=True))
    avg_rssi.append(df['rssi'].mean())
    avg_snr.append(df['snr'].mean())
    return avg_delay[0], avg_dist[0], avg_rssi[0], avg_snr[0]


def main():
    delay_k, dist_k, rssi_k, snr_k = load_data_from_folder02(status_folder_path)
    results = {
        "avg_delay": delay_k,
        "avg_dist": dist_k,
        "avg_rssi": rssi_k,
        "avg_snr": snr_k
    }
    print(json.dumps(results))  # Retorna os resultados como JSON para o Electron


if __name__ == "__main__":
    main()
