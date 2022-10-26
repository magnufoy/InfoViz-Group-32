import csv
import numpy as np

name = "catelyn stark"
with open("data/dialogue_data_processed.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    rows = []
    for row in csv_reader:
        rows.append(row)
    
    filtered_data = []
    filtered_data.append(["character", "season", "episode", "dialogue_count"]) 

    for row in rows:
        if row[0] == name:
            filtered_data.append(row)
    

np.savetxt("data/dialogue_catelyn_stark.csv", filtered_data, delimiter=", ", fmt ='% s')
           
