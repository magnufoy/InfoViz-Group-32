import csv
import numpy as np

with open("bubble_data/characters_v2.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    rows = []
    for row in csv_reader:
        rows.append(row)


with open("data/characters.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    characters = []
    for character in csv_reader:
        characters.append(character)

output = []

for character in characters:
    for row in rows:
        if character[0] == row[0].lower().replace(" ","_"):
            output.append(row)

np.savetxt("./bubble_data/reduced_characters_v2.csv", output, delimiter=",", fmt ='% s')

m=1
