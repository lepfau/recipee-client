import React, { useState, useEffect, useRef } from "react";
import apiHandler from "../api/apiHandler";
import Recipe from "../components/Recipe";
import Searchbar from "../components/Searchbar";
import { NavLink } from "react-router-dom";

function Recipes(props) {
  const [recettes, setRecettes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [vegan, setVegan] = useState(false);
  const [vegetarien, setVegetarien] = useState(false);
  const [lactose, setLactose] = useState(false);
  const [gluten, setGluten] = useState(false);
  const [loading, setLoading] = useState(true);

  function handlefilter(resp) {
    if (vegan)
      setRecettes(
        resp.filter((rec) => rec.vegan === true || rec.lactose === true)
      );
    else if (vegetarien && gluten)
      setRecettes(
        resp.filter((rec) => rec.gluten === true && rec.vegetarian === true)
      );
    else if (vegetarien && lactose)
      setRecettes(
        resp.filter((rec) => rec.lactose === true && rec.vegetarian === true)
      );
    else if (vegetarien && lactose && gluten)
      setRecettes(
        resp.filter(
          (rec) =>
            rec.lactose === true &&
            rec.vegetarian === true &&
            rec.gluten === true
        )
      );
    else if (lactose && gluten)
      setRecettes(
        resp.filter((rec) => rec.lactose === true && rec.gluten === true)
      );
    else if (vegetarien)
      setRecettes(resp.filter((rec) => rec.vegetarian === true));
    else if (lactose)
      setRecettes(
        resp.filter((rec) => rec.lactose === true || rec.vegan === true)
      );
    else if (gluten) setRecettes(resp.filter((rec) => rec.gluten === true));
    else setRecettes(resp);
  }

  useEffect(() => {
    apiHandler
      .getRecipes()
      .then((resp) => {
        setRecettes(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    apiHandler
      .getRecipes()
      .then((resp) => {
        handlefilter(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vegan, vegetarien, lactose, gluten]);

  function handleChange(event, filter) {
    event.target.checked ? filter(true) : filter(false);
  }

  function handleSearch(inputsearch) {
    let search = [...recettes];
    if (inputsearch.length > 0) {
      apiHandler
        .getRecipes()
        .then((resp) => {
          let arr = resp.filter((rec) =>
            rec.name.toLowerCase().includes(inputsearch.toLowerCase())
          );
          handlefilter(arr);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      apiHandler
        .getRecipes()
        .then((resp) => {
          handlefilter(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleCat() {
    let cat = [...recettes];
    setRecettes(cat.filter((rec) => rec.type === "dessert"));
  }

  return (
    <div className="recettes">
      <h1 className="recettes-title">Les Recettes </h1>

      {/* <NavLink exact to={"/desserts"}>
        <p onClick={handleCat} style={{ color: "white" }}>
          * Desserts
        </p>
      </NavLink> */}
      <div className="pageelements">
        <div className="leftfilters">
          <Searchbar handleSearch={handleSearch} />
          <div className="filters">
            <div className="filterrecipe">
              <label
                style={{ color: "white" }}
                htmlFor="vegan"
                className="switch"
              >
                <input
                  id="vegan"
                  type="checkbox"
                  checked={vegan}
                  name="vegan"
                  onChange={(event) => handleChange(event, setVegan)}
                ></input>
                <span class="slider round"></span>
              </label>
              <span style={{ color: "white" }}>Vegan</span>
            </div>

            <div className="filterrecipe">
              <label
                style={{ color: "white" }}
                htmlFor="vegetarien"
                className="switch"
              >
                <input
                  id="vegetarien"
                  type="checkbox"
                  checked={vegetarien}
                  name="vegetarien"
                  onChange={(event) => handleChange(event, setVegetarien)}
                ></input>
                <span class="slider round"></span>
              </label>
              <span style={{ color: "white" }}>Vegetarien</span>
            </div>

            <div className="filterrecipe">
              <label
                style={{ color: "white" }}
                htmlFor="lactose"
                className="switch"
              >
                <input
                  id="lactose"
                  type="checkbox"
                  checked={lactose}
                  name="lactose"
                  onChange={(event) => handleChange(event, setLactose)}
                ></input>
                <span class="slider round"></span>
              </label>
              <span style={{ color: "white" }}>Sans lactose</span>
            </div>

            <div className="filterrecipe">
              <label
                style={{ color: "white" }}
                htmlFor="gluten"
                className="switch"
              >
                <input
                  id="gluten"
                  type="checkbox"
                  checked={gluten}
                  name="gluten"
                  onChange={(event) => handleChange(event, setGluten)}
                ></input>
                <span class="slider round"></span>
              </label>
              <span style={{ color: "white" }}>Sans gluten</span>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="recipe-container">
            {recettes.map((recette) => {
              return (
                <Recipe
                  key={recette._id}
                  name={recette.name}
                  image={recette.image}
                  id={recette._id}
                  type={recette.type}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recipes;
