import csv
import numpy as np

with open("dialogues_data.csv") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    header = []
    header = next(csv_reader)
    rows = []
    for row in csv_reader:
        rows.append(row)
    
    names = [row[2] for row in rows]
    set_of_names = sorted(set(names))

    episodes = [row[1] for row in rows]
    set_of_episodes = sorted(set(episodes))
    set_of_episodes.pop(1)
    set_of_episodes.append('Episode 10')

    seasons = [row[0] for row in rows]
    set_of_seasons = sorted(set(seasons))

# Processing data set to be on form [[name, season, episode, number_of_dialogues]]
    processed_list = []
    print_count = 0
    for name in set_of_names:
        print_count += 1
        print("Name nr:",print_count, "of", len(set_of_names), "Character name:", name)
        rows_with_same_name = []
        for row in rows:
            if row[2] == name:
                rows_with_same_name.append(row)
        for season in set_of_seasons:
            rows_with_same_name_season = []
            for row in rows_with_same_name:
                if row[0] == season:
                    rows_with_same_name_season.append(row)
            for episode in set_of_episodes:
                if season == "Season 7" and episode == "Episode 8":
                    break
                if season == "Season 8" and episode == "Episode 7":
                    break
                rows_with_same_name_season_episode = []
                for row in rows_with_same_name_season:
                    if row[1] == episode:
                        rows_with_same_name_season_episode.append(row)
                number_of_dialogues = len(rows_with_same_name_season_episode)
                processed_list.append([name, season, episode, number_of_dialogues])

# Reading character_names.csv to a list
with open("character_names.csv") as names_csv: 
    names_reader = csv.reader(names_csv, delimiter=',') 
    name_header = []
    name_header = next(names_reader)
    names = []
    for row in names_reader:
        names.append(row[0])

# Transforming all the names to lowercase
for i in range(len(names)):
    names[i] = names[i].lower()

# Removing names in processed_list that is not matching the names in character_names.csv
processed_list_filtered = []
for row in processed_list:
    if row[0] in names:
        processed_list_filtered.append(row)

print("Number of rows", len(processed_list))
print("Number of characters", len(processed_list)/73)
print("Number of rows, filtered:", len(processed_list_filtered))
print("Number of characters, filtered:", len(processed_list_filtered)/73)

np.savetxt("dialogue_data_processed.csv", processed_list_filtered, delimiter=", ", fmt ='% s')

