"use client";
import { Grid } from "@mantine/core";
import { InterestRateGuess } from "./components/interestRate/InterestRateGuess";

export default function Game() {
  return (
    <Grid justify="center" align="flex-start">
      <Grid.Col span={6}>
        <InterestRateGuess />
      </Grid.Col>
      <Grid.Col span={6}>
        <h1>IR Date</h1>
      </Grid.Col>
      <Grid.Col span={6}>
        <h1>Stock</h1>
      </Grid.Col>
      <Grid.Col span={6}>
        <h1>StockDate</h1>
      </Grid.Col>
      <Grid.Col span={6}>
        <h1>Currency</h1>
      </Grid.Col>
      <Grid.Col span={6}>
        <h1>Currency Date</h1>
      </Grid.Col>
    </Grid>
  );
}
