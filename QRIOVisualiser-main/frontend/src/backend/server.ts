import axios from "axios";
import { io } from "socket.io-client";

export const BASE_URL = "http://127.0.0.1:3000/";
export const META_URL = "<ENTER META SERVER URL HERE>";

export const baseServer = axios.create();

export const socket = io;
