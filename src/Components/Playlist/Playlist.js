import './Playlist.css';
import React from 'react';
import TrackList from '../TrackList/TrackList'
class PlayList extends React.Component  {
  constructor(props){
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event){
    const name = event.target.value;
    this.props.onNameChange(name);
  }

  render(){
    return (
      <div className="Playlist">
        <input value={this.props.playlistName}
        onChange={this.handleNameChange} />
        {/* <!-- Add a TrackList component --> */}
        <TrackList tracks={this.props.playlistTracks}
         onAdd={this.props.onAdd} onRemove={this.props.onRemove} 
         isRemoval={true} />
        <button className="Playlist-save"
        onClick={this.props.onSave} >SAVE TO SPOTIFY</button>
      </div>
      
    );
  }
   
  }
  
  export default PlayList;