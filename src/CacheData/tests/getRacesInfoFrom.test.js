import axios from 'axios';

import { getRacesInfoFrom } from '../CacheData';

jest.mock('axios');

const window = global;

const storage = window.localStorage;

describe('getRacesInfoFrom', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('axios url parameters calculate correctly', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {},
    }));
    await getRacesInfoFrom(2017);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2017/results/1.json',
    );
  });

  it('successful axios call and setting of cache upon getRacesInfoFrom', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          RaceTable: {
            Races: ['Race 1', 'Race 2'],
          },
        },
      },
    }));
    expect(storage.getItem('https://ergast.com/api/f1/2007/results/1.json')).toEqual(null);
    const response = await getRacesInfoFrom(2007);
    expect(response).toEqual(['Race 1', 'Race 2']);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2007/results/1.json',
    );
    expect(storage.getItem('https://ergast.com/api/f1/2007/results/1.json')).toEqual('["Race 1","Race 2"]');
  });

  it('axios call gets errored upon getSeasonInfoFrom', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          SeasonTable: {},
        },
      },
    }));

    expect(storage.getItem('https://ergast.com/api/f1/2007/results/1.json')).toEqual(null);
    const response = await getRacesInfoFrom(2007);
    expect(response).toEqual([]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2007/results/1.json',
    );
    expect(storage.getItem('https://ergast.com/api/f1/2007/results/1.json')).toEqual('[]');
  });

  it('retrieve from cache instead of executing axios call', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          RaceTable: {
            Races: ['Race 1', 'Race 2'],
          },
        },
      },
    }));
    storage.setItem('https://ergast.com/api/f1/2007/results/1.json', JSON.stringify(['Race 3', 'Race 4']));
    expect(storage.getItem('https://ergast.com/api/f1/2007/results/1.json')).toEqual('["Race 3","Race 4"]');

    const response = await getRacesInfoFrom(2007);
    expect(response).toEqual(['Race 3', 'Race 4']);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(storage.getItem('https://ergast.com/api/f1/2007/results/1.json')).toEqual('["Race 3","Race 4"]');
  });
});
