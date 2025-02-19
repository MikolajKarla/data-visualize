import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO


def get_chart_data(data, chart_type):
    if chart_type == "csv":
        df = pd.read_csv(data)
        print(df.columns)
        return df.columns


def create_plot(data, chart_type, columns):
    df = pd.DataFrame(data)
    print(df)
    if df.empty:
        return "Brak danych do wygenerowania wykresu."
    
    plt.figure(figsize=(16, 9))  # Ustawienie rozmiaru figury (figsize) na początku

    x_col = columns.x_column[0]  # Jest tylko jedna wartość dla osi X

    if chart_type == 'line':
        # Dla wykresu liniowego możliwe jest kilka kolumn Y (1-3)
        for y in columns.y_columns:
            plt.plot(df[x_col], df[y], label=y)
        plt.xlabel(x_col)
        plt.ylabel('Wartości')
        plt.title(f'Wykres Liniowy: {", ".join(columns.y_columns)} vs {x_col}')
        plt.legend()

    elif chart_type == 'bar':
        # Zachowujemy oryginalne sprawdzanie dla wykresu słupkowego (musi być 1 kolumna dla X i Y)
        if len(columns.y_columns) != 1 or len(columns.x_column) != 1:
            return "Dla wykresu słupkowego wybierz jedną kolumnę dla osi X (kategoryczną) i jedną dla osi Y (numeryczną)."
        y_col = columns.y_columns[0]
        plt.bar(df[x_col], df[y_col])
        plt.xlabel(x_col)
        plt.ylabel(y_col)
        plt.title(f'Wykres Słupkowy: {y_col} względem {x_col}')

    elif chart_type == 'pie':
        if len(columns.value_column) != 1 or len(columns.category_column) != 1:
            return "Dla wykresu kołowego wybierz jedną kolumnę dla kategorii i jedną kolumnę dla wartości."
        category_col = columns.category_column[0]
        value_col = columns.value_column[0]
        plt.pie(df[value_col], labels=df[category_col], autopct='%1.1f%%', startangle=90)
        plt.title(f'Wykres Kołowy: Rozkład {value_col} według {category_col}')
        plt.ylabel(value_col)

    elif chart_type == 'scatter':
        # Jeśli jest więcej niż jedna kolumna Y, rysujemy wiele serii
        for y in columns.y_columns:
            plt.scatter(df[x_col], df[y], label=y)
        plt.xlabel(x_col)
        plt.ylabel('Wartości')
        plt.title(f'Wykres Punktowy: {", ".join(columns.y_columns)} vs {x_col}')
        plt.legend()

    elif chart_type == 'area':
        # Jeśli jedna kolumna Y, wykres warstwowy jak fill_between
        if len(columns.y_columns) == 1:
            y = columns.y_columns[0]
            plt.fill_between(df[x_col], df[y])
            plt.title(f'Wykres Warstwowy: {y} vs {x_col}')
        else:
            # Zbierz dane Y do listy
            y_data = [df[y] for y in columns.y_columns]
            plt.stackplot(df[x_col], *y_data, labels=columns.y_columns)
            plt.title(f'Wykres Warstwowy (Stacked): {", ".join(columns.y_columns)} vs {x_col}')
            plt.legend()
        plt.xlabel(x_col)
        plt.ylabel('Wartości')

    elif chart_type == 'radar':
        return "Wykres Radar nie jest jeszcze zaimplementowany w tym przykładzie."

    else:
        plt.text(0.5, 0.5, f'Nieznany typ wykresu: {chart_type}', ha='center', va='center')

    plt.xlabel('Oś X')
    plt.ylabel('Oś Y')
    plt.grid(True)

    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    plt.savefig('uploads/chart.png', format='png', bbox_inches='tight')
    buf.seek(0)
    plt.close()
    return buf
