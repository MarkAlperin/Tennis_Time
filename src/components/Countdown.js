import React, {useState, useEffect} from "react";
import styled from "styled-components";


export default function Countdown(props) {
  const [timeLeft, setTimeLeft] = useState(props.date - props.reservation.date);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevState) => prevState - 1000);
    } , 1000);
    return () => clearInterval(interval);
  } , []);


  return (
    <CountdownContainer>
      <CountdownHeader>
        <CountdownHeaderTitle>{props.reservation.facility}</CountdownHeaderTitle>
        <CountdownHeaderDate>{props.reservation.date}</CountdownHeaderDate>
      </CountdownHeader>
      <CountdownBody>
        <CountdownText>This is some text</CountdownText>
        <CountdownBodyTime>{timeLeft}</CountdownBodyTime>
      </CountdownBody>
    </CountdownContainer>
);

};

const CountdownContainer = styled.div``;
const CountdownHeader = styled.div``;
const CountdownHeaderTitle = styled.h1``;
const CountdownHeaderDate = styled.h2``;
const CountdownBody = styled.div``;
const CountdownBodyTime = styled.h2``;
const CountdownText = styled.p``;
