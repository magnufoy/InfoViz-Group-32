import csv
import numpy as np

with open("data/characters.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    characters = []
    for row in csv_reader:
        characters.append(row[0])

output = [["episode", "dialogue_count"]]
for epsiode in range(1,74):
    count = 0
    for character in characters:
        with open("data/dialogue_data/"+character+".csv") as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            rows = []
            for row in csv_reader:
                rows.append(row[1])
        count += int(rows[epsiode])
    output.append([epsiode,count])
np.savetxt("./data/dialogue_data/sum.csv", output, delimiter=",", fmt ='% s')
