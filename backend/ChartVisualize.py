import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


def get_chart_data(data, chart_type):
    if(chart_type=="csv"):
        pd.read_csv(data)
        print(data.columns)
        return data.columns
    
def create_plot(data,columns):
    # Create a plot
    sns.set_theme(style="whitegrid")
    plt.figure(figsize=(10, 5))
    sns.barplot(x="species", y="sepal_length", data=data)
    plt.title("Iris Dataset - Sepal Length")
    plt.show()
    return plt