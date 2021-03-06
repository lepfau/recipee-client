import React, { useState, useEffect, useReducer } from "react";
import apiHandler from "../api/apiHandler";
import { withUser } from "../components/Auth/withUser";
import { motion } from "framer-motion";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

function OneRecipe(props) {
  const [oneRecipe, setoneRecipe] = useState([]);
  const [value, setValue] = React.useState(3);
  const [ratings, setRatings] = useState([]);
  const [noteComment, setNoteComment] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      note: 2,
      comment: "",
    }
  );
  const [user, setUser] = useState("");
  const [btnStyle, setBtnStyle] = useState("Ajouter aux favoris");
  const [message, setMessage] = useState("");
  const [ajout, setAjout] = useState(false);
  const [liste, setListe] = useState([]);

  useEffect(() => {
    apiHandler
      .getOneRecipe(props.match.params.id)
      .then((resp) => {
        setoneRecipe(resp);
        setRatings(resp.ratings);
        setUser(resp.id_user.userName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.match.params.id]);

  const handleChangeInput = (event) => {
    const name = event.target.name;
    const newValue = event.target.value;
    setNoteComment({ [name]: newValue });
  };

  function handleSubmit(event) {
    event.preventDefault();
    apiHandler
      .addRate(props.match.params.id, noteComment)
      .then((resp) => {
        apiHandler
          .getOneRecipe(props.match.params.id)
          .then((resp) => {
            setoneRecipe(resp);
            setRatings(resp.ratings);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  }

  function handleDelete(rateId) {
    apiHandler.deleteRate(rateId).then((resp) => {
      setRatings(ratings.filter((rate) => rate._id !== rateId));
    });
  }

  function handleAdd(id) {
    apiHandler.addFavorite(id).then((resp) => {
      setTimeout(() => {
        setBtnStyle("Ajouté aux favoris !");
      }, 500);
      setBtnStyle("...");
    });
  }

  function addListe(id, item) {
    apiHandler.addToListe(id, item).then((resp) => {
      console.log(resp);
      setListe([...liste, item]);
    });
  }

  return (
    <motion.div exit={{ opacity: 0 }} className="fullonerecipe">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div className="onerecipeing">
          <h1 className="onerecipesubtitle">Ingredients</h1>
          <h4 style={{ marginBottom: "25px", textAlign: "center" }}>
            (Cliquer pour ajouter a la liste de course)
          </h4>
          <div className="listeingredients">
            {oneRecipe.ingredients &&
              oneRecipe.ingredients.map((ing, index) => {
                return liste.includes(ing) ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <p className="inggg">
                      {ing[0].toUpperCase() + ing.substring(1)}
                    </p>{" "}
                    <p className="ajoute">ajouté ! </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <p className="inggg">
                      {ing[0].toUpperCase() + ing.substring(1)}
                    </p>

                    <button
                      className="btnformcreate"
                      onClick={() => addListe(props.context.user._id, ing)}
                      style={{ width: "30px" }}
                    >
                      {" "}
                      +{" "}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>{" "}
        <div className="onerecipepage">
          <h1 className="onerecipetitle">{oneRecipe.name}</h1>
          <h4> Ajouté par : {user}</h4>
          {props.context.isLoggedIn &&
          !props.context.user.favorites.includes(oneRecipe._id) ? (
            <button className="btnfav" onClick={() => handleAdd(oneRecipe._id)}>
              {btnStyle}
            </button>
          ) : null}
          <div className="onerecipeimagetime">
            <img className="onerecipeimage" src={oneRecipe.image} alt="img" />
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <p className="legend">
                <i className="far fa-clock"></i> {oneRecipe.temps} minutes
              </p>
              <p className="legend">
                <i className="fas fa-utensils"></i>
                {oneRecipe.type}
              </p>
            </div>
            <div className="onerecipe-specifies">
              {oneRecipe.vegan ? <p>Vegan</p> : null}
              {oneRecipe.vegetarian ? <p>Végétarien</p> : null}
              {oneRecipe.lactose ? <p>Sans Lactose</p> : null}
              {oneRecipe.gluten ? <p>Sans Gluten</p> : null}
            </div>
          </div>
          <hr className="onerecipehr"></hr>
          <div className="onerecipesteps">
            <h2 className="onerecipesubtitle">Etapes</h2>

            <ol
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
                textJustify: "inter-character",
                marginLeft: "50px",
              }}
            >
              {oneRecipe.etapes &&
                oneRecipe.etapes.map((ing, index) => {
                  return (
                    <li key={index} style={{ margin: "10px" }}>
                      {ing[0].toUpperCase() + ing.substring(1)}
                    </li>
                  );
                })}
            </ol>
          </div>
          <hr className="onerecipehr"></hr>
          <div>
            <div className="ratingcommentfull">
              <h2 style={{ marginBottom: "15px", textAlign: "center" }}>
                Commentaires et notes
              </h2>
              <div>
                <Box
                  component="fieldset"
                  mb={1}
                  borderColor="transparent"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    name="note"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                      handleChangeInput(event);
                    }}
                  />
                  <form
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      border: "none",
                      marginTop: "15px",
                    }}
                    onSubmit={handleSubmit}
                  >
                    <textarea
                      className="inputrating"
                      type="textarea"
                      name="comment"
                      onChange={handleChangeInput}
                    ></textarea>
                    <button className="btninputrating" type="submit">
                      Poster la note et/ou le commentaire
                    </button>
                  </form>

                  {message.length > 0 && (
                    <h3
                      style={{
                        border: "1px solid red",
                        padding: "8px",
                        alignSelf: "center",
                        marginTop: "10px",
                      }}
                    >
                      {message}{" "}
                    </h3>
                  )}
                </Box>
              </div>
            </div>

            <div className="ratingsonerecipe">
              {ratings.map((rate) => {
                return (
                  <div key={rate._id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "20px",
                      }}
                    >
                      <div>
                        <Box
                          component="fieldset"
                          mb={3}
                          borderColor="transparent"
                        >
                          <Rating name="read-only" value={rate.note} readOnly />
                        </Box>
                      </div>
                      <div>
                        <p>
                          <i> {rate.id_user.userName}</i>
                        </p>

                        <p style={{ marginRight: "20px" }}>{rate.comment}</p>
                      </div>
                      {props.context.isLoggedIn ? (
                        rate.id_user._id === props.context.user._id ? (
                          <i
                            style={{ cursor: "pointer" }}
                            className="fa fa-trash"
                            onClick={() => handleDelete(rate._id)}
                          ></i>
                        ) : null
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default withUser(OneRecipe);
