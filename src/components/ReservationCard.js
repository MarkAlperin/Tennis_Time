import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";


export default function Upcoming({ reservation, date, cancelReservation }) {
  const [timeLeft, setTimeLeft] = useState(Math.abs(date - new Date(reservation.date).setHours(9, 0)));
  const [daysLeft, setDaysLeft] = useState();
  const [hoursLeft, setHoursLeft] = useState();
  const [minutesLeft, setMinutesLeft] = useState();
  const [secondsLeft, setSecondsLeft] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevState) => prevState - 1000);
    }, 1000);
    setDaysLeft(Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    setHoursLeft(Math.floor(timeLeft / (1000 * 60 * 60)) % 24);
    setMinutesLeft(Math.floor(timeLeft / (1000 * 60)) % 60);
    setSecondsLeft(Math.floor(timeLeft / 1000) % 60);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (integer) => (integer < 10 ? `0${integer}` : integer);

  const avatarSX =
    reservation.game === "Tennis"
      ? { m: 1, bgcolor: "secondary.main" }
      : { m: 1, bgcolor: "success.main" };


  return (
    <ReservationContainer>
      <DateTimeContainer>
        <Avatar sx={avatarSX}>
          <SportsTennisIcon />
        </Avatar>
        <Typography variant="h6">{reservation.game}</Typography>
        <p>{`${reservation.humanTime[0]}`}</p>{" "}
        <p>{`${reservation.humanTime[1]}`}</p>
      </DateTimeContainer>

      <UpcomingBody>
        {daysLeft - 14 > 0 && (
          <Typography>{`Event will be scheduled in ${
            daysLeft - 14
          } days`}</Typography>
        )}
        {!(daysLeft - 14 > 0) && (
          <Typography>{`Event will be scheduled in ${hoursLeft}:${formatTime(
            minutesLeft
          )}:${formatTime(secondsLeft)}`}</Typography>
        )}
        <Button
          type="submit"
          onClick={() => {cancelReservation(reservation._id)}}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Cancel
        </Button>
      </UpcomingBody>
    </ReservationContainer>
  );
}

const ReservationContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid black;
  width: 80%;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
`;

const UpcomingBody = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
`;
