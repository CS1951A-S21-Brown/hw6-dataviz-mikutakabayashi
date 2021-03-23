import numpy as np
import glob
import os
import pandas as pd

path = "./data/video_games.csv"

with open(path, 'rb') as f:
    data = pd.read_csv(f)

df_na = data.sort_values(by=['NA_Sales'], ascending=False)[['Genre', 'NA_Sales']].head(100)
df_eu = data.sort_values(by=['EU_Sales'], ascending=False)[['Genre', 'EU_Sales']].head(100)
df_jp = data.sort_values(by=['JP_Sales'], ascending=False)[['Genre', 'JP_Sales']].head(100)
df_other = data.sort_values(by=['Other_Sales'], ascending=False)[['Genre', 'Other_Sales']].head(100)

genre_list = list(data['Genre'].to_list())

# percent of sales in top 100 games by Genre per region
total_na = df_na.sum()['NA_Sales']
df_na = (df_na.groupby(['Genre']).sum()/total_na * 100).round(2)
df_na = df_na.reset_index()
df_na.columns = ['Genre', 'Percent']
df_na = df_na.sort_values(by=['Percent'], ascending=False).head(3)
df_na['Region'] = ['na', 'na', 'na']

total_eu = df_eu.sum()['EU_Sales']
df_eu = (df_eu.groupby(['Genre']).sum()/total_eu * 100).round(2)
df_eu = df_eu.reset_index()
df_eu.columns = ['Genre', 'Percent']
df_eu = df_eu.sort_values(by=['Percent'], ascending=False).head(3)
df_eu['Region'] = ['eu', 'eu', 'eu']

total_jp = df_jp.sum()['JP_Sales']
df_jp = (df_jp.groupby(['Genre']).sum()/total_jp * 100).round(2)
df_jp = df_jp.reset_index()
df_jp.columns = ['Genre', 'Percent']
df_jp = df_jp.sort_values(by=['Percent'], ascending=False).head(3)
df_jp['Region'] = ['jp', 'jp', 'jp']

total_other = df_other.sum()['Other_Sales']
df_other = (df_other.groupby(['Genre']).sum()/total_other * 100).round(2)
df_other = df_other.reset_index()
df_other.columns = ['Genre', 'Percent']
df_other = df_other.sort_values(by=['Percent'], ascending=False).head(3)
df_other['Region'] = ['other', 'other', 'other']

result = pd.concat([df_na, df_eu, df_jp, df_other])

result.to_csv('./data/Regions.csv')
