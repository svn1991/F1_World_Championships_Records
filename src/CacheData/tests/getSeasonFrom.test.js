import axios from 'axios';

import { getSeasonsInfoFrom } from '../CacheData';

jest.mock('axios');

const window = global;

const storage = window.localStorage;

describe('getSeasonInfoFrom', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('axios url parameters calculate correctly', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {},
    }));
    await getSeasonsInfoFrom(2001, 2017);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/seasons.json?limit=17&offset=51',
    );
  });

  it('successful axios call and setting of cache upon getSeasonInfoFrom', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          SeasonTable: {
            Seasons: [1, 2, 3, 4],
          },
        },
      },
    }));
    expect(storage.getItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55')).toEqual(null);
    const response = await getSeasonsInfoFrom(2005, 2015);
    expect(response).toEqual([1, 2, 3, 4]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/seasons.json?limit=11&offset=55',
    );
    expect(storage.getItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55')).toEqual('[1,2,3,4]');
  });

  it('axios call gets errored upon getSeasonInfoFrom', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          SeasonTable: {},
        },
      },
    }));

    expect(storage.getItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55')).toEqual(null);
    const response = await getSeasonsInfoFrom(2005, 2015);
    expect(response).toEqual([]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/seasons.json?limit=11&offset=55',
    );
    expect(storage.getItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55')).toEqual('[]');
  });

  it('retrieve from cache instead of executing axios call', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          SeasonTable: {
            Seasons: [1, 2, 3, 4],
          },
        },
      },
    }));
    storage.setItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55', JSON.stringify(['Testing cache']));
    expect(storage.getItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55')).toEqual('["Testing cache"]');

    const response = await getSeasonsInfoFrom(2005, 2015);
    expect(response).toEqual(['Testing cache']);
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(storage.getItem('https://ergast.com/api/f1/seasons.json?limit=11&offset=55')).toEqual('["Testing cache"]');
  });
});
