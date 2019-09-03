import axios from 'axios';

import { getWinnerForYear } from '../CacheData';

jest.mock('axios');

const window = global;

const storage = window.localStorage;

describe('getWinnerForYear', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('axios url parameters calculate correctly', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {},
    }));
    await getWinnerForYear(2017);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2017/driverStandings/1.json',
    );
  });

  it('successful axios call and setting of cache upon getWinnerForYear', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          StandingsTable: {
            StandingsLists: [{
              DriverStandings: [{
                Driver: {
                  name: 'Test Driver 1',
                },
              }],
            }],
          },
        },
      },
    }));
    expect(storage.getItem('https://ergast.com/api/f1/2007/driverStandings/1.json')).toEqual(null);
    const response = await getWinnerForYear(2007);
    expect(response).toEqual({ name: 'Test Driver 1', winningYearRecord: 2007 });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2007/driverStandings/1.json',
    );
    expect(storage.getItem('https://ergast.com/api/f1/2007/driverStandings/1.json')).toEqual('{"name":"Test Driver 1","winningYearRecord":2007}');
  });

  it('axios call gets errored upon getSeasonInfoFrom', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          SeasonTable: {},
        },
      },
    }));

    expect(storage.getItem('https://ergast.com/api/f1/2007/driverStandings/1.json')).toEqual(null);
    const response = await getWinnerForYear(2007);
    expect(response).toEqual({});
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2007/driverStandings/1.json',
    );
    expect(storage.getItem('https://ergast.com/api/f1/2007/driverStandings/1.json')).toEqual('{}');
  });

  it('retrieve from cache instead of executing axios call', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        MRData: {
          StandingsTable: {},
        },
      },
    }));
    storage.setItem('https://ergast.com/api/f1/2007/driverStandings/1.json', JSON.stringify({
      name: 'Test Driver 2',
    }));
    expect(storage.getItem('https://ergast.com/api/f1/2007/driverStandings/1.json')).toEqual('{"name":"Test Driver 2"}');

    const response = await getWinnerForYear(2007);
    expect(response).toEqual({
      name: 'Test Driver 2',
    });
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(storage.getItem('https://ergast.com/api/f1/2007/driverStandings/1.json')).toEqual('{"name":"Test Driver 2"}');
  });
});
