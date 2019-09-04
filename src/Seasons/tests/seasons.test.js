import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Seasons from '../Seasons';
import Loader from '../../Loader/Loader';
import * as SeasonsData from './seasons-2001-2015.json';
import * as WinnersData from './season-winners-2001-2015.json';

const seasonsInfo = SeasonsData.MRData.SeasonTable.Seasons;
const winnersInfo = WinnersData.MRData.StandingsTable.StandingsLists;

const window = global;
const storage = window.localStorage;

describe('<Seasons />', () => {
  beforeEach(() => {
    winnersInfo.forEach(winnerInfo => {
      storage.setItem(`https://ergast.com/api/f1/${winnerInfo.season}/driverStandings/1.json`, JSON.stringify({
        ...winnerInfo.DriverStandings[0].Driver,
        winningYearRecord: winnerInfo.season,
      }));
    });
  });
  afterEach(() => {
    storage.clear();
    cleanup();
  });

  it.skip('Expect to log errors in console', done => {
    const spy = jest.spyOn(global.console, 'error');
    render(<Seasons />);
    requestAnimationFrame(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  // FIXME: correct this test, act render is having an issue
  it.skip('Expect to not log errors in console', done => {
    storage.setItem('https://ergast.com/api/f1/seasons.json?limit=15&offset=51', JSON.stringify([]));
    const spy = jest.spyOn(global.console, 'error');
    render(<Seasons startYear={2001} endYear={2015} />);
    requestAnimationFrame(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });

  it('should render and match the snapshot', done => {
    storage.setItem('https://ergast.com/api/f1/seasons.json?limit=15&offset=51', JSON.stringify([]));
    const { container: { firstChild } } = render(<Seasons startYear={2001} endYear={2015} />);
    requestAnimationFrame(() => {
      expect(firstChild).toMatchSnapshot();
      done();
    });
  });

  it('should render and match the snapshot with seasons data', done => {
    storage.setItem('https://ergast.com/api/f1/seasons.json?limit=15&offset=51', JSON.stringify(seasonsInfo));
    const { container } = render(<Seasons startYear={2001} endYear={2015} />);

    requestAnimationFrame(() => {
      expect(container.firstChild).toMatchSnapshot();
      done();
    });
  });

  it('should mount loader component when no season information is available', done => {
    storage.setItem('https://ergast.com/api/f1/seasons.json?limit=15&offset=51', JSON.stringify([]));
    const { container } = render(<Seasons startYear={2001} endYear={2015} />);
    const loader = render(<Loader />);

    requestAnimationFrame(() => {
      const seasonLoading = container.querySelector('.seasons-wrapper #loading-wrapper');
      const loadContainer = loader.container.querySelector('#loading-wrapper');
      expect(seasonLoading).toEqual(loadContainer);
      done();
    });
  });

  it('random check season row to have season year, url, winner, winner url displayed, and click loads races info', done => {
    storage.setItem('https://ergast.com/api/f1/seasons.json?limit=15&offset=51', JSON.stringify(seasonsInfo));
    const { container } = render(<Seasons startYear={2001} endYear={2015} />);

    requestAnimationFrame(() => {
      expect(container.querySelectorAll('.races-wrapper').length).toEqual(0);
      const tableBodyRows = container.querySelectorAll('table tbody tr');

      const season = tableBodyRows[3];
      expect(season).toEqual(expect.anything());
      const columns = season.children;
      expect(columns[1].children[0].innerHTML).toEqual('2004');
      expect(columns[1].children[0].href).toEqual('https://en.wikipedia.org/wiki/2004_Formula_One_season');

      expect(columns[2].children[0].innerHTML).toEqual('Michael Schumacher');
      expect(columns[2].children[0].href).toEqual('http://en.wikipedia.org/wiki/Michael_Schumacher');

      fireEvent.click(season);
      expect(container.querySelectorAll('.races-wrapper').length).toEqual(1);
      done();
    });
  });
});
