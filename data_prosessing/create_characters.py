import numpy as np
import csv


with open("data/dialogue_data_processed.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    rows = []
    for row in csv_reader:
        rows.append(row[0].replace(" ", "_"))

    names = list(set(rows))
    print(names)
    print(len(names))
    np.savetxt("./data/names.csv", names, delimiter=",", fmt ='% s')