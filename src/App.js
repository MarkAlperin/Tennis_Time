import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

import MaterialUIPickers from "./components/MaterialUIPickers";



const theme = createTheme();

export default function SignUp() {
  const [facility, setFacility] = useState("Tennis");

  const chipClickHandler = () => {
    setFacility((prevState) => {
      return prevState === "Tennis" ? "Pickleball" : "Tennis";
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
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
              <Grid item xs={12} sm={6}>
                <Chip onClick={chipClickHandler} color={facility === "Pickleball" ? "default" : "success"} label="Tennis" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Chip onClick={chipClickHandler} color={facility === "Pickleball" ? "success" : "default"}  label="Pickleball" />
              </Grid>
              <Grid item xs={12}>
                <MaterialUIPickers />
              </Grid>
              <Grid item xs={12}>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="upToNoGood" color="primary" />
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
                <Link href="#" variant="body2">
                  Would you like to see already scheduled reservations?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
