import csv
import numpy as np

with open("bubble_data/characters_v2.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    rows = []
    for row in csv_reader:
        rows.append(row)


for i in range(13,86):
    characters = []
    a = 0;
    for row in rows:
        if a==0:
            characters.append(row)
        elif int(row[i]) == 1:
            characters.append(row)
        a+=1
    episode_nr = str(i-12)
    np.savetxt("./bubble_data/episodes_appearances/episode_"+episode_nr+".csv", characters, delimiter=",", fmt ='% s')
