import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import Countdown from "./Countdown";

export default function ReservationsDisplay(props) {
  const [reservations, setReservations] = useState([]);
  const date = new Date();

  useEffect(() => {
    const getReservations = async () => {
      const reservationData = await axios.get(
        `http://localhost:3001/reservations`
      );
      console.log(reservationData.data);
      return reservationData.data;
    };
    setReservations(getReservations());
  }, []);


  return (
    <ReservationsPage>
      <ReservationsContainer>
        <ReservationsHeader>
          <ReservationsHeaderTitle>Reservations</ReservationsHeaderTitle>
        </ReservationsHeader>
        <ReservationsBody>
          {Array.isArray(reservations) && reservations.map((reservation) => (
            <Countdown reservation={reservation} date={date}/>
          ))}
        </ReservationsBody>
      </ReservationsContainer>
    </ReservationsPage>
  );
}

const ReservationsPage = styled.div``;
const ReservationsContainer = styled.div``;
const ReservationsHeader = styled.div``;
const ReservationsHeaderTitle = styled.h1``;
const ReservationsBody = styled.div``;
