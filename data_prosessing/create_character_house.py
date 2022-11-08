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

for character in characters:
    output=[]
    for row in rows:
        if character[0] == row[0].lower().replace(" ","_"):
            output.append(["name","house"])
            output.append([character[0],row[1]])
            np.savetxt("./data/houses/"+character[0]+"_house.csv", output, delimiter=",", fmt ='% s')

m=1