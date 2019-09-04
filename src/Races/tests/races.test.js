import React from 'react';
import { render, cleanup } from '@testing-library/react';
import axios from 'axios';
import Races from '../Races';
import Loader from '../../Loader/Loader';
import * as RacesData from './races-2009.json';

jest.mock('axios');

describe('<Races />', () => {
  afterEach(cleanup);

  it('Expect to log errors in console', done => {
    axios.get.mockResolvedValue({ data: {} });
    const spy = jest.spyOn(global.console, 'error');
    render(<Races />);
    expect(spy).toHaveBeenCalled();
    done();
  });

  it('Expect to not log errors in console', done => {
    axios.get.mockResolvedValue({ data: {} });
    const spy = jest.spyOn(global.console, 'error');
    render(<Races year={2009} seasonWinner="button" />);
    expect(spy).not.toHaveBeenCalled();
    done();
  });

  it('should render and match the snapshot', done => {
    axios.get.mockResolvedValue({ data: {} });
    const { container: { firstChild } } = render(<Races year={2009} seasonWinner="button" />);
    expect(firstChild).toMatchSnapshot();
    done();
  });

  it('should render and match the snapshot with races data', () => {
    axios.get.mockResolvedValue({ data: RacesData });
   const { container } = render(<Races year={2009} seasonWinner="button" />);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toMatchSnapshot();
    done();
  });

  it('should mount loader component when no race information is available', done => {
    axios.get.mockResolvedValue({ data: {} });
    const { container } = render(<Races year={2009} seasonWinner="button" />);
    const raceLoading = container.querySelector('.races-wrapper #loading-wrapper');
    const loader = render(<Loader />);
    const loadContainer = loader.container.querySelector('#loading-wrapper');
    expect(raceLoading).toEqual(loadContainer);
    done();
  });
});
