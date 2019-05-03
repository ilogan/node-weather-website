const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

// Define paths for Expresss config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Ian Logan"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Ian Logan",
    content: "Placeholder text about About"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Ian Logan",
    content: "Placeholder text about Help"
  });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({ error: "You must provide an address." });
  }
  // returns an error or geolocation data
  geocode(address, (geoError, { latitude, longitude, location } = {}) => {
    if (geoError) {
      return res.send({ error: geoError });
    }

    forecast(latitude, longitude, (forecastError, forecast) => {
      if (forecastError) {
        return res.send({ error: forecastError });
      }
      console.log(forecast);
      res.send({
        forecast,
        location,
        address
      });
    });
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Ian 404-not-aga-ain",
    errorMessage: "Help article not found."
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Ian 404-not-aga-ain",
    errorMessage: "Page not found."
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
