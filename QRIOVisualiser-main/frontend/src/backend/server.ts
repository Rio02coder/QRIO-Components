import axios from "axios";
import { io } from "socket.io-client";

export const BASE_URL = "http://127.0.0.1:3000/";
export const META_URL = "http://<META-SERVER-IP>:8000/";

export const baseServer = axios.create();

export const socket = io;
