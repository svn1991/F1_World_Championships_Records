import React, { useState, useEffect } from "react";
import { getRacesInfoFrom } from "../CacheData/CacheData";
import BootstrapTable from "react-bootstrap-table-next";
import PropTypes from "prop-types";

import Loader from "../Loader/Loader";

import "./styles.css";

function Races(props) {
  const { year, seasonWinner } = props;
  const [races, setRaces] = useState({});

  useEffect(() => {
    getRacesInfoFrom(year).then(races => {
      const raceObject = {};
      races.forEach((race, index) => {
        raceObject[race.round] = {
          round: race.round,
          raceName: race.raceName,
          raceUrl: race.url,
          winner: race.Results[0].Driver
        };
      });
      setRaces(raceObject);
    });
  }, []);

  function getRacesProducts() {
    const raceKeys = Object.keys(races);
    return raceKeys.map(raceKey => {
      const race = races[raceKey];
      return {
        id: race.round,
        race: <a href={race.url}>{race.raceName}</a>,
        winner: (
          <a
            href={race.winner.url}
            className={
              race.winner.driverId === seasonWinner ? "highlight-winner" : ""
            }
          >
            {`${race.winner.givenName} ${race.winner.familyName}`}
          </a>
        )
      };
    });
  }

  const columns = [
    {
      dataField: "race",
      text: "Races"
    },
    {
      dataField: "winner",
      text: "Winner"
    }
  ];

  return (
    <div className="races-wrapper">
      <h1 className="races-title">{`F1 Races for Season ${year}`}</h1>
      {Object.keys(races).length === 0 ? (
        <Loader />
      ) : (
        <BootstrapTable
          keyField="id"
          data={getRacesProducts()}
          columns={columns}
          condensed
          bordered={false}
        />
      )}
    </div>
  );
}

Races.propTypes = {
  year: PropTypes.number.isRequired,
  seasonWinner: PropTypes.string.isRequired
};

export default Races;
