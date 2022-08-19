import React, { useState, useEffect } from "react";
import axios from "axios";

import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import ReservationCard from "./ReservationCard";


const theme = createTheme();

export default function ReservationsDisplay(props) {
  const [reservations, setReservations] = useState([]);
  const date = new Date();

  useEffect(() => {
    getReservations();
  }, []);

  const getReservations = async () => {
    const reservationData = await axios.get(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_DB_NAME}`);
    setReservations(reservationData.data);
  };

  const cancelReservation = async (id) => {
    await axios.delete(`http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_DB_NAME}/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
    getReservations();
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
          {!reservations.length && <Typography variant="body1">No reservations</Typography>}
          {Array.isArray(reservations) &&
            reservations.map((reservation) => (
              <ReservationCard
                reservation={reservation}
                date={date}
                key={reservation._id}
                cancelReservation={cancelReservation}
              />
            ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
