import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../Playlist/Playlist'
//import Spotify from '../../util/Spotify';
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults:[],
      playlistName:"New Playlist",
      playlistTracks:[]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount(){
    console.log(window.sessionStorage);
  }
  componentWillUnmount(){
    // sessionStorage.removeItem('expiresAt');
    // sessionStorage.removeItem('accessToken');
  }

  search(term){
    Spotify.search(term).then( searchResults => {
      this.setState({searchResults:searchResults})
    }).catch( error =>{
      console.log(error);
    })
  }
  savePlaylist(){
    // const baseURI ='https://api.spotify.com';
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playlistName, trackURIs).then(()=> {
      this.setState({
        playlistName:'New Playlist',
        playlistTracks:[]
      })
    })
   
    return trackURIs;

  }
  updatePlaylistName(name){
    this.setState({playlistName:name})
  }
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks});
  }
  removeTrack(track){
    let tracks = this.state.playlistTracks.filter(
      removeTrack => {
        return removeTrack.id !== track.id;
      }
    );
    this.setState({playlistTracks:tracks});

  }
  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
             {/* Add a Playlist component  */}
             <PlayList playlistTracks={this.state.playlistTracks} 
             playlistName= {this.state.playlistName}
             onRemove={this.removeTrack} onAdd={this.addTrack} 
             onNameChange={this.updatePlaylistName} 
             onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
          
        );
  }
}

export default App;
