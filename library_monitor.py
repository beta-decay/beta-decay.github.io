import requests, time, datetime, numpy as np
from bs4 import BeautifulSoup

# Make empty arrays
data = np.array([])
times = np.array([])

try:
    while True:
        # Get webpage
        page = requests.get("https://www.dur.ac.uk/library/")
        
        # Parse webpage
        soup = BeautifulSoup(page.text, 'html.parser')
        
        # Find seat number
        freeSeats = soup.find_all('text')[0].string
        
        print(freeSeats)
        
        # Append the arrays
        data = np.append(data, np.array([freeSeats]))
        times = np.append(times, np.array([datetime.datetime.now()]))
        
        # If a whole day of data has been collected, save data
        if len(data) >= 730:
            DAT =  np.column_stack((data, times))
            
            filename = time.strftime('data/%j_%m_%Y.txt')
            np.savetxt(filename, DAT, delimiter=" ", fmt="%s") 
            
            # Clear array
            data = np.array([])
            times = np.array([])
            
        # Wait for 2 minutes
        time.sleep(120)
        
except KeyboardInterrupt:
    # If keyboard interrupt,  save data
    # Get webpage
    page = requests.get("https://www.dur.ac.uk/library/")
    
    # Parse webpage
    soup = BeautifulSoup(page.text, 'html.parser')
    
    # Find seat number
    freeSeats = soup.find_all('text')[0].string
    
    DAT =  np.column_stack((data, times))
            
    filename = time.strftime('data/%j_%m_%Y_interrupted.txt')
    np.savetxt(filename, DAT, delimiter=" ", fmt="%s") 