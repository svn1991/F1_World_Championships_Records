import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import PropTypes from 'prop-types';
import { getSeasonsInfoFrom, getWinnerForYear } from '../CacheData/CacheData';

import Races from '../Races/Races';
import Loader from '../Loader/Loader';

import './styles.css';

function Seasons(props) {
  const { startYear, endYear } = props;
  const [seasons, setSeasons] = useState({});

  /**
   * Get season and winner name information from API
   */
  useEffect(() => {
    let isSubscribed = true;
    getSeasonsInfoFrom(startYear, endYear).then(seasonsResults => {
      // eslint-disable-next-line max-len
      const winnerPromises = seasonsResults.map(valueObject => getWinnerForYear(valueObject.season));
      Promise.all(winnerPromises).then(winners => {
        const seasonObject = {};
        winners.forEach((winner, index) => {
          const season = seasonsResults[index];
          seasonObject[season.season] = {
            winner,
            year: season.season,
            url: season.url,
          };
        });
        if (isSubscribed) {
          setSeasons(seasonObject);
        }
      });
    });
    return () => {
      isSubscribed = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Get season and winner information organised into
   * their rows and column titles
   */
  function getSeasonsProducts() {
    const years = Object.keys(seasons);
    return years.map(year => ({
      id: year,
      winnerId: seasons[year].winner.driverId,
      season: <a href={seasons[year].url}>{year}</a>,
      winner: (
        <a href={seasons[year].winner.url}>
          {`${seasons[year].winner.givenName} ${
            seasons[year].winner.familyName
          }`}
        </a>
      ),
    }));
  }

  /**
   * Column headers
   */
  const columns = [
    {
      dataField: 'season',
      text: 'Season',
    },
    {
      dataField: 'winner',
      text: 'Winner',
    },
  ];

  const expandRow = {
    onlyOneExpanding: true,
    showExpandColumn: true,
    // eslint-disable-next-line radix
    renderer: row => <Races year={parseInt(row.id)} seasonWinner={row.winnerId} />,
    // eslint-disable-next-line react/prop-types
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    // eslint-disable-next-line react/prop-types
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <b>-</b>;
      }
      return <b>...</b>;
    },
  };

  return (
    <div className="seasons-wrapper">
      <h1 className="seasons-title">
        {`F1 World Championships: ${startYear}-${endYear}`}
      </h1>
      {Object.keys(seasons).length === 0 ? (
        <Loader />
      ) : (
        <BootstrapTable
          keyField="id"
          data={getSeasonsProducts()}
          columns={columns}
          expandRow={expandRow}
          bordered={false}
          condensed
        />
      )}
    </div>
  );
}

Seasons.propTypes = {
  startYear: PropTypes.number.isRequired,
  endYear: PropTypes.number.isRequired,
};

export default Seasons;
