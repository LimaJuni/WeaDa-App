/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright Lima Junior 2025 All rights reserved
 * @author Lima Junior <tahjunior028@gmail.com>
 */


'use strict';

const api_key = "d86136b25eb78da5164c40e58a5bc13b";


/**
 * fetch data from server
 * @param {string} URL API url
 * @param {Function} callback callback
 */
export const fetchData = function (URL, callback) {
    fetch(`${URL}&appid=${api_key}`)
      .then(res => res.json())
      .then(data => callback(data));
}

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    reverseGeo(lat, lon) {
        return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    /**
     * 
     * @param {string} query Search query e.g. : "Yaounde", "New York"
     */
    geo(query) {
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}