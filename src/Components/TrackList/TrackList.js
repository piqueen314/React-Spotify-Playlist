import './TrackList.css';
import React from 'react';
import Track from '../Track/Track'
class TrackList extends React.Component {
  

  render(){
   
    // const tracksArr = this.props.tracks;
    // console.log("TrackList= "+ JSON.stringify(tracksArr));
    // const tracksComp =tracksArr.map(
    //   (track2) => { return <Track key={track2.id} track={track2} /> }
    // );
    //console.log("TracksComp= "+ JSON.stringify(tracksComp));
    return (
      <div className="TrackList">
          {/* <!-- You will add a map method that renders a set of Track components  --> */}
         {
           this.props.tracks.map ( track => {
            return <Track key={track.id} track={track} onAdd={this.props.onAdd}
             onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} />
           })
         }
       
      </div>
    );
  }
    
  }
  
  export default TrackList;