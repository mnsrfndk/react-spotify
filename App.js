/* import Axios, React useEffect & useState Hooks and Local CSS */
import axios from 'axios'
import { useEffect, useState } from 'react';
import './App.css';
/*--------------------------------------------------------------*/


function App() {
  /* Spotify requirements for using the API, saved as variables */
  const CLIENT_ID = "2542e5e949d9429cac22003ad9f0de74"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  /*------------------------------------------------------------*/


  /* Token, SearchKey, Artists - State declerations */
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])
  /*------------------------------------------------*/


  /* Get Access Token - Start */
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])
  /* Get Access Token - End */


  /* Remove Token When Logout - Start */
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }
  /* Remove Token When Logout - End */


  /* onSubmit Function - Get Data from API - Start */
  const searchArtists = async (e) => {
    e.preventDefault()
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })

    setArtists(data.artists.items)

  }
  /* onSubmit Function - Get Data from API End */


  /* map the 'artists' array(state) to obtain information about each individual artist - Start */
  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt={`${artist.name} Photo`} /> : <div>No Image</div>}
        {artist.name}
      </div>
    ))
  }
  /*-------------------------------------------------------------------------------------------*/


  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>


        {/* if 
        No value is saved in token variable, basically send this link => 
       https://accounts.spotify.com/authorize?client_id=2542e5e949d9429cac22003ad9f0de74&redirect_uri=http://localhost:3000&response_type=token
            else
        Show a Logout button which executes logout function on click
        */}
        {!token
          ? <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>

          : <button onClick={logout}>Logout</button>}


        {/*   if
         Token is present, display a form with input and button elements. Everytime input changes, update search key. 
              else
          Display "Please login"
          */}
        {token
          ? <form onSubmit={searchArtists}>
              <input type="text" onChange={e => setSearchKey(e.target.value)} />
              <button type={"submit"}>Search</button>
            </form>

          : <h2>Please login</h2>
        }

        {renderArtists()}

      </header>
    </div>
  );
}

export default App;
