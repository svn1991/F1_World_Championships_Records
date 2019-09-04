import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Races from '../Races';
import Loader from '../../Loader/Loader';
import * as RacesData from './races-2009.json';

const racesInfo = RacesData.MRData.RaceTable.Races;

const window = global;
const storage = window.localStorage;

describe('<Races />', () => {
  afterEach(() => {
    storage.clear();
    cleanup();
  });

  it.skip('Expect to log errors in console', done => {
    const spy = jest.spyOn(global.console, 'error');
    render(<Races />);
    requestAnimationFrame(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  // FIXME: correct this test, act render is having an issue
  it.skip('Expect to not log errors in console', done => {
    storage.setItem('https://ergast.com/api/f1/2009/results/1.json', JSON.stringify([]));
    const spy = jest.spyOn(global.console, 'error');
    render(<Races year={2009} seasonWinner="button" />);
    requestAnimationFrame(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });

  it('should render and match the snapshot', done => {
    storage.setItem('https://ergast.com/api/f1/2009/results/1.json', JSON.stringify([]));
    const { container: { firstChild } } = render(<Races year={2009} seasonWinner="button" />);
    requestAnimationFrame(() => {
      expect(firstChild).toMatchSnapshot();
      done();
    });
  });

  it('should render and match the snapshot with races data', done => {
    storage.setItem('https://ergast.com/api/f1/2009/results/1.json', JSON.stringify(racesInfo));
    const { container } = render(<Races year={2009} seasonWinner="button" />);

    requestAnimationFrame(() => {
      expect(container.firstChild).toMatchSnapshot();
      done();
    });
  });

  it('should mount loader component when no race information is available', done => {
    storage.setItem('https://ergast.com/api/f1/2009/results/1.json', JSON.stringify([]));
    const { container } = render(<Races year={2009} seasonWinner="button" />);
    const loader = render(<Loader />);

    requestAnimationFrame(() => {
      const raceLoading = container.querySelector('.races-wrapper #loading-wrapper');
      const loadContainer = loader.container.querySelector('#loading-wrapper');
      expect(raceLoading).toEqual(loadContainer);
      done();
    });
  });

  it('check driver who has won the season races vs driver who has only won races and not season', done => {
    storage.setItem('https://ergast.com/api/f1/2009/results/1.json', JSON.stringify(racesInfo));
    const { container } = render(<Races year={2009} seasonWinner="button" />);

    requestAnimationFrame(() => {
      const tableBodyRows = container.querySelectorAll('table tbody tr');

      const seasonWinner = tableBodyRows[3];
      expect(seasonWinner).toEqual(expect.anything());
      let columns = seasonWinner.children;
      expect(columns[0].children[0].innerHTML).toEqual('Bahrain Grand Prix');
      expect(columns[0].children[0].href).toEqual('http://en.wikipedia.org/wiki/2009_Bahrain_Grand_Prix');

      expect(columns[1].children[0].innerHTML).toEqual('Jenson Button');
      expect(columns[1].children[0].href).toEqual('http://en.wikipedia.org/wiki/Jenson_Button');
      expect(columns[1].children[0].classList.contains('highlight-winner')).toEqual(true);

      const raceWinner = tableBodyRows[8];
      expect(raceWinner).toEqual(expect.anything());
      columns = raceWinner.children;
      expect(columns[0].children[0].innerHTML).toEqual('German Grand Prix');
      expect(columns[0].children[0].href).toEqual('http://en.wikipedia.org/wiki/2009_German_Grand_Prix');

      expect(columns[1].children[0].innerHTML).toEqual('Mark Webber');
      expect(columns[1].children[0].href).toEqual('http://en.wikipedia.org/wiki/Mark_Webber');
      expect(columns[1].children[0].classList.contains('highlight-winner')).toEqual(false);
      done();
    });
  });
});
