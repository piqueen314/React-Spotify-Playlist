let accessToken;

const clientId = '';
const redirectURI = "http://localhost:3000"
// const redirectURI = "http://cece.surge.sh"
  
const Spotify = {
  Storage : {},
 
  // getAccessToken(){
  //   if(accessToken){
  //     console.log('cece 1')
  //     return accessToken;
  //   }
  //   // if(sessionStorage.getItem('accessToken')){
  //   //   console.log("cece 4")
  //   //   return sessionStorage.getItem('accessToken');
  //   // }
  //   let tokenMatch = window.location.href.match(/access_token=([^&]*)/);
  //   console.log("tokenMatch= "+ tokenMatch)
  //   if(!tokenMatch){
  //     const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
  //       window.location.assign(accessURL);
        
  //       console.log("windoLoc="+ window.location.href);
  //       console.log("windoLocSearch="+ window.location.pathname);
  //      console.log('cece 3')
       
  //   }
  //    tokenMatch = window.location.href.match(/access_token=([^&]*)/);
  //   console.log("windLocH="+window.location.href)
  //   const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);
  //   if(tokenMatch && expiresMatch){
  //     accessToken = tokenMatch[1];
  //     // This clears the token parameter so we can get a new
  //     // access token when it expires
  //     let expires = Number( expiresMatch[1]);
  //     console.log('expires='+expires)
  //     window.setTimeout(() => accessToken = '', expires * 1000);
  //     //This clears the parameter from the URL so we don't grab an expired token
  //     window.history.pushState('Access Token', null, '/');
  //     console.log('cece 2')
  //     window.sessionStorage.setItem('accessToken',accessToken);
  //     return accessToken;

  //   }
  
  // },
  getAccessToken(){
    // console.log(window.sessionStorage);
    //check curent time to see if we have expired tokens in session storage
    if(sessionStorage.getItem('expiresAt') && sessionStorage.getItem('accessToken')){
      const curentTime = Date.now();
      const expiresAt = Number(sessionStorage.getItem('expiresAt'));
      console.log("expires= "+expiresAt +" curr= "+ curentTime);
      if(curentTime >= expiresAt){
        sessionStorage.removeItem('expiresAt');
        console.log("cleared expired");
        sessionStorage.removeItem('accessToken');
        console.log("cleared");
      }
    }
    // If the token exsists it is stored in the session
    if(sessionStorage.getItem('accessToken')){
      console.log("cece 4")
      return sessionStorage.getItem('accessToken');
    }
    // if the token is not in storage it might be in the sites URL as
    // a reponse from Spotify API
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);
    if(tokenMatch && expiresMatch){
          accessToken = tokenMatch[1];
          //This clears the parameter from the URL so we don't grab an expired token
          window.history.pushState('Access Token', null, '/');
          console.log('cece 2')
          console.log("f "+ JSON.stringify(window.sessionStorage));
          window.sessionStorage.setItem('accessToken',accessToken);
          console.log("l "+ JSON.stringify(window.sessionStorage));
          return accessToken;
    }
    
    // if the token doesn't exsist we do a GET request to Spotify API
    const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
    window.location.assign(accessURL)  
    // start the timer of one hour for the token
    const DEFAULT_EXPIRE_SECS = 3600; //Spotify tokens expire in one hour
    // Date.now is in millisecs
    let expiresAt = Date.now() + (DEFAULT_EXPIRE_SECS * 1000);
    //place expire time in session strorage Note time will be stored as a string in sessionStorage
    sessionStorage.setItem('expiresAt', expiresAt);
    console.log("cece 1")



  },

  search(term){
    accessToken = this.getAccessToken();
    console.log("seachToken="+accessToken)
    const baseURL='https://api.spotify.com';
    const endpoint = `/v1/search?type=track&q=${term};`;
    const urlToFetch =`${baseURL}${endpoint}`;
    const headers =  {Authorization: `Bearer ${accessToken}`} 
    // if(!accessToken){
    //   return "No Token"
    // }
    return fetch(urlToFetch, {headers:headers})
    .then(response =>{
      return response.json()
      .then(jsonResponse => {
        if(!jsonResponse){
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri

        }));
      });
    });

  },
  savePlayList (name, trackURIs){
    // console.log(`length= ${trackURIs.join("")}`)
    if(!name || !trackURIs.length){
      return;
    }
    // console.log('trracks='+trackURIs)
    const baseURL='https://api.spotify.com';
    accessToken = this.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`} 
    const endpoint = '/v1/me';
    const urlToFetch =`${baseURL}${endpoint}`;
    let userId;
    return fetch(urlToFetch, { headers: headers }
      ).then(response => response.json()
      ).then(jsonResponse =>{
        userId = jsonResponse.id;
        return fetch(`${baseURL}/v1/users/${userId}/playlists`,
      {
        headers: headers,
        method: 'POST',
        body:JSON.stringify({name: name})

      }
      ).then(response => response.json()).then(jsonResponse =>{
        const playlistId = jsonResponse.id;
        return fetch(`${baseURL}/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
          headers: headers,
          method: 'POST',
         body: JSON.stringify({uris: trackURIs})
        });
      });
    });
  }
};


export default Spotify