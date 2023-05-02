import express from "express";
import * as dotenv from "dotenv";
import { App } from "./App";
import { AppProvider } from "./providers/AppProvider";

dotenv.config();

const port = 8009;

const appProvider = new AppProvider();

const app: App = new App(express(), port, appProvider);

app.startListening();
