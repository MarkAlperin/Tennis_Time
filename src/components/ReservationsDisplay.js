import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Countdown from "./Countdown";

const theme = createTheme();

export default function ReservationsDisplay(props) {
  const [reservations, setReservations] = useState([]);
  const date = new Date();

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = async () => {
    const reservationData = await axios.get(
      `http://localhost:3001/reservations`
    );
    setReservations(reservationData.data);
  };

  const cancelReservation = (id) => {

    axios.delete(`http://localhost:3001/reservations/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Reservations to be scheduled
          </Typography>
          {Array.isArray(reservations) &&
            reservations.map((reservation, idx) => (
              <Countdown
                reservation={reservation}
                date={date}
                key={idx}
                cancelReservation={cancelReservation}
              />
            ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

// const ReservationsPage = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 90vh;
//   width: 90vw;

//   `;
// const ReservationsContainer = styled.div``;
// const ReservationsHeader = styled.div``;
// const ReservationsHeaderTitle = styled.h1``;
// const ReservationsBody = styled.div``;
