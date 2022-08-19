import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import FaceIcon from "@mui/icons-material/Face";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import MaterialUIPickers from "./MaterialUIPickers";
import { formatResData } from "../helpers/helpers";

const theme = createTheme();
const localRandiAuth = localStorage.getItem("localRandiAuth");

export default function ReservationForm() {
  const [facility, setFacility] = useState("Tennis");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [clickCounter, setClickCounter] = useState(0);
  const [isRandi, setIsRandi] = useState(localRandiAuth);

  const chipClickHandler = () => {
    setFacility((prevState) => {
      return prevState === "Tennis" ? "Pickleball" : "Tennis";
    });
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleTimeChange = (newValue) => {
    setTime(newValue);
  };

  const handleCheckboxChange = (e) => {
    setClickCounter((prevState) => prevState + 1);
  };

  const handleAvatarClick = () => {
    if (clickCounter === 7) {
      setIsRandi(true);
      localStorage.setItem("localRandiAuth", true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (date && time) {
      const resData = formatResData(date, time, facility, isRandi);
      axios({
        method: "post",
        url: `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_DB_NAME}`,
        data: resData,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
          alert(err.message);
        });
    } else {
      alert("Please select a date and time");
    }
  };

  const avatarSX = isRandi
    ? { m: 1, bgcolor: "success.main" }
    : { m: 1, bgcolor: "secondary.main" };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar onClick={handleAvatarClick} sx={avatarSX}>
            <FaceIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Tennis Time
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <SelectContainer>
                  <Chip
                    icon={facility === "Tennis" ? <SportsTennisIcon /> : null}
                    onClick={chipClickHandler}
                    color={facility === "Pickleball" ? "default" : "success"}
                    label="Tennis"
                  />
                  <Chip
                    icon={
                      facility === "Pickleball" ? <SportsTennisIcon /> : null
                    }
                    onClick={chipClickHandler}
                    color={facility === "Pickleball" ? "success" : "default"}
                    label="Pickleball"
                  />
                </SelectContainer>
              </Grid>
              <Grid item xs={12}>
                <MaterialUIPickers
                  handleDateChange={handleDateChange}
                  handleTimeChange={handleTimeChange}
                  time={time}
                  date={date}
                />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="upToNoGood"
                      color="primary"
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="I solemly swear that I am up to no good 🧙🏻‍♂️"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Schedule Reservation
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="https://sites.onlinecourtreservations.com/reservations"
                  target="_blank"
                  variant="body2"
                >
                  Cinco Ranch reservations website
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="https://sites.onlinecourtreservations.com/reservations"
                  target="_blank"
                  variant="body2"
                >
                  See your future scheduleings
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 20px;
`;
