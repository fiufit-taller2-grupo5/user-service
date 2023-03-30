import express from "express";
import * as dotenv from "dotenv";
import { App } from './App';
import { AppProvider } from "./AppProvider";

dotenv.config();

const port: number = Number(process.env.PORT) || 7878;

const appProvider = new AppProvider();

const app: App = new App(express(), port, appProvider.getAppRouter());

app.startListening();
