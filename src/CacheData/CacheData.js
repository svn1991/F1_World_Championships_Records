import axios from "axios";

const storage = window.localStorage;
const url = "https://ergast.com/api/f1";

export function getSeasonsInfoFrom(startYear, endYear) {
  const seasonRangeUrl = `${url}/seasons.json?limit=${endYear -
    startYear +
    1}&offset=${startYear - 1950}`;
  if (!storage[seasonRangeUrl]) {
    return axios
      .get(seasonRangeUrl)
      .then(response => {
        const { data } = response;
        const { MRData } = data;
        const seasons = MRData.SeasonTable.Seasons;
        storage.setItem(seasonRangeUrl, JSON.stringify(seasons));
      })
      .catch(err => {
        console.log(err);
        storage.setItem(seasonRangeUrl, JSON.stringify([]));
      })
      .then(() => {
        return JSON.parse(storage.getItem(seasonRangeUrl));
      });
  } else {
    return Promise.resolve(JSON.parse(storage.getItem(seasonRangeUrl)));
  }
}

export function getWinnerForYear(year) {
  const winnerUrl = `${url}/${year}/driverStandings/1.json`;
  if (!storage[winnerUrl]) {
    return axios
      .get(winnerUrl)
      .then(response => {
        const { data } = response;
        const { MRData } = data;

        const driver =
          MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;
        driver.winningYearRecord = year;
        storage.setItem(winnerUrl, JSON.stringify(driver));
      })
      .catch(err => {
        console.log(err);
        storage.setItem(winnerUrl, JSON.stringify({}));
      })
      .then(() => {
        return JSON.parse(storage.getItem(winnerUrl));
      });
  } else {
    return Promise.resolve(JSON.parse(storage.getItem(winnerUrl)));
  }
}

export function getRacesInfoFrom(year) {
  const racesUrl = `${url}/${year}/results/1.json`;
  if (!storage[racesUrl]) {
    return axios
      .get(racesUrl)
      .then(response => {
        const { data } = response;
        const { MRData } = data;

        const races = MRData.RaceTable.Races;
        storage.setItem(racesUrl, JSON.stringify(races));
      })
      .catch(err => {
        console.log(err);
        storage.setItem(racesUrl, JSON.stringify([]));
      })
      .then(() => {
        return JSON.parse(storage.getItem(racesUrl));
      });
  } else {
    return Promise.resolve(JSON.parse(storage.getItem(racesUrl)));
  }
}
