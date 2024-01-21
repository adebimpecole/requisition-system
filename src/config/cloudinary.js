import { Cloudinary } from "@cloudinary/url-gen";
import { apiKey, cloudName, apiSecret } from "../config.js";
import axios from 'axios';

const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
  url: {
    secure: true,
  },
});

const cloudinary = axios.create({
  baseURL: `https://api.cloudinary.com/v1_1/${cloudName}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
  },
});

export { cld, cloudinary };