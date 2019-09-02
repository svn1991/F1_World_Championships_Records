import React, { useState, useEffect } from "react";
import { getSeasonsInfoFrom, getWinnerForYear } from "../CacheData/CacheData";
import BootstrapTable from "react-bootstrap-table-next";
import PropTypes from "prop-types";

import Races from "../Races/Races";
import Loader from "../Loader/Loader";

import "./styles.css";

function Seasons(props) {
  const { startYear, endYear } = props;
  const [seasons, setSeasons] = useState({});

  /**
   * Get season and winner name information from API
   */
  useEffect(() => {
    let isSubscribed = true;
    getSeasonsInfoFrom(startYear, endYear).then(seasons => {
      const winnerPromises = seasons.map(valueObject =>
        getWinnerForYear(valueObject.season)
      );
      Promise.all(winnerPromises).then(winners => {
        const seasonObject = {};
        winners.forEach((winner, index) => {
          const season = seasons[index];
          seasonObject[season.season] = {
            winner,
            year: season.season,
            url: season.url
          };
        });
        if (isSubscribed) {
          setSeasons(seasonObject);
        }
      });
    });
    return () => (isSubscribed = false);
  }, []);

  /**
   * Get season and winner information organised into
   * their rows and column titles
   */
  function getSeasonsProducts() {
    const years = Object.keys(seasons);
    return years.map(year => {
      return {
        id: year,
        winnerId: seasons[year].winner.driverId,
        season: <a href={seasons[year].url}>{year}</a>,
        winner: (
          <a href={seasons[year].winner.url}>
            {`${seasons[year].winner.givenName} ${
              seasons[year].winner.familyName
            }`}
          </a>
        )
      };
    });
  }

  /**
   * Column headers
   */
  const columns = [
    {
      dataField: "season",
      text: "Season"
    },
    {
      dataField: "winner",
      text: "Winner"
    }
  ];

  const expandRow = {
    onlyOneExpanding: true,
    showExpandColumn: true,
    renderer: row => <Races year={row.id} seasonWinner={row.winnerId} />,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return <b>-</b>;
      }
      return <b>...</b>;
    }
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
  endYear: PropTypes.number.isRequired
};

export default Seasons;
