# Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

This project is using Information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System. The data set included is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). Includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

### D3 Dabbler

Using the D3 techniques, a scatter plot between 3 of the data variables such as `Healthcare vs. Poverty/ Age` was created to represent each state with circle elements (with the state abbreviations in the circles). The graphic was coded in the `app.js` file pulling the data from `data.csv` by using the `d3.csv` function.

#### More Data, More Dynamics

The scatter plot places additional labels and has click events so the users can decide which data to display (Animated transitions for the circles' locations as well as the range of X axes).

#### Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. tooltips were added in the D3 graphic to reveal a specific element's data when the user hovers their cursor over the element. 


* Note: You'll need to use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.

### Copyright

Trilogy Education Services © 2019. All Rights Reserved.
