#F1 World Championships Records

This app is built using plain react. It displays F1 championships records for 2005 - 2015 currently based on api data from [erghast](http://ergast.com/mrd/).

##Installation

** Please ensure that you have the latest [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) installed.

1) `git clone https://github.com/svn1991/F1_World_Championships_Records.git`
2) npm install
3) npm run build

## Application

1) Show F1 seasons for year 2005-2015 and the winners
2) Clicking on a season row, should show all the races held in selected season
3) If winner of race is also season winner, winner's name is highlighted
4) Wiki links for season, winner, and races have been added
5) LocalStorage caching of api data to reduce calls to api

## TODOs/Improvements:

1) Add unit testing
2) Add usage of redux/saga for better management of async calls to api
3) Improve winner highlight by adding an icon
4) Make range flexible so that user can select range of records to view on the fly
5) Better UI design