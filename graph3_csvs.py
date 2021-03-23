import numpy as np
import glob
import os
import pandas as pd

path = "./data/video_games.csv"

with open(path, 'rb') as f:
    data = pd.read_csv(f)

genres = list(data['Genre'].to_list())

for genre in genres:
    new_df = data.loc[data['Genre'] == genre].head(50)
    df = new_df['Publisher'].value_counts().reset_index()
    df.columns = ['Publisher', 'count']
    file_path = './data/' + genre + '.csv'
    df.to_csv(file_path)
