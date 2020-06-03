# excel file link: http://www2.nphs.wales.nhs.uk:8080/CommunitySurveillanceDocs.nsf/3dc04669c9e1eaa880257062003b246b/77fdb9a33544aee88025855100300cab/$FILE/Rapid%20COVID-19%20surveillance%20data.xlsx
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.cm
import matplotlib.dates as mdates
from matplotlib.ticker import (MultipleLocator, FormatStrFormatter,
                               AutoMinorLocator)
from matplotlib.figure import figaspect
import requests
import re

# Set plot style
plt.style.use("ggplot")

# Get colormap
cmap = matplotlib.cm.get_cmap('tab10')

# Open Excel data file
xl = pd.ExcelFile("Rapid COVID-19 surveillance data.xlsx")

# Isolate relevant sheet from Excel file
df = xl.parse("Tests by specimen date")

# List of counties in North Wales
county_list = ["Conwy", "Denbighshire", "Flintshire", "Gwynedd", "Isle of Anglesey", "Wrexham"]

fig = plt.figure(dpi=400)
w, h = figaspect(0.8)
plt.subplots(figsize=(w,h))
plt.subplot(1,1,1)

#avg_dates = []
#avg_sum = []

#frame1=fig.add_axes((.15,.18,.8,.8))
# Iterate through all counties
for i in range(len(county_list)):
    # Get name of county
    county_name = county_list[i]

    # Extract county data from sheet
    county = df[df["Local Authority"] == county_name]

    # Extract data
    date = county["Specimen date"]
    new_cases = county["Cases (new)"]

    if i == 0:
        avg_dates = np.array(date[:])
        avg_sum = np.array(new_cases[:])
    else:
        # Sum all counties
        avg_sum += np.array(new_cases[:])
        
moving_average = np.zeros(len(avg_sum)-7)

# Calculate 7-day moving average
for j in range(7,len(avg_sum)):
    moving_average[j-7] = sum(avg_sum[j-7:j])/7

# Plot the data
plt.plot(avg_dates[:-7-15], moving_average[:-15])

ax = plt.gca()

# Remove gridlines
ax.grid(False)

# Set tick positions
ax.tick_params(which="major", direction='out', left=True, right=False)
ax.tick_params(which="minor", direction='out', left=True, right=False)
ax.tick_params(which="major", direction='out', top=False, bottom=True)
ax.tick_params(which="minor", direction='out', top=False, bottom=True)
ax.xaxis.set_minor_locator(MultipleLocator(5))
ax.xaxis.set_major_locator(MultipleLocator(10))
ax.yaxis.set_minor_locator(MultipleLocator(1))

plt.gcf().autofmt_xdate()

# Format date
myFmt = mdates.DateFormatter('%d/%m/%Y')
ax.xaxis.set_major_formatter(myFmt)

# Add axis labels
plt.ylabel("Daily Confirmed Covid-19 Cases\n(7-day Moving Average)")
plt.xlabel("Date")

# Save figure to png file
plt.tight_layout()
plt.savefig("covid_n_wales_combined.png",dpi=400)

# Get first sheet
contents = xl.parse("Contents")

# Find when cases were last updated
case_update = contents.iloc[5,4]

# Open index.htm
with open("index.htm", "r") as f:
    page = f.read()

# Update information
modified_page = re.sub(r"<span>.*</span>", r"<span>"+case_update+"</span>", page)

# Open index.htm
with open("index.htm", "w") as f:
    f.write(modified_page)
    
