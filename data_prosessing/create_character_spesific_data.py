import csv
import numpy as np

with open("data/characters.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    characters = []
    for row in csv_reader:
        characters.append(row[0])

with open("data/dialogue_data_processed.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    rows = []
    for row in csv_reader:
        rows.append(row)

for character in characters:
    filtered_data = [["episode","dialogue_count"]]
    i = 0
    for row in rows:
        if row[0].replace(" ", "_") == character:
            i+=1
            filtered_data.append([i, row[3].strip()])
    np.savetxt("./data/dialogue_data/"+character+".csv", filtered_data, delimiter=",", fmt ='% s')