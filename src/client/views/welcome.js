import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { TextField, FlatButton, ListItem, List} from 'material-ui';
import { Card, CardTitle, CardText, CardActions  } from 'material-ui/Card';
import { login, newRoom } from '../actions';

class Welcome extends Component {

  createRoom() {
    let room = prompt("Please input channel name.", "channel").trim()
    const {app} = this.props
    let error = false
    if (room.length == 0) error = true
    if (error) {
      alert ("It's blank!!!")
      return
    }
    app.rooms.forEach(function(element) {
      if (room == element.name)  error = true
    }) 
    if (error) {
      alert('Please input the unique string.')
    } else {
      this.props.dispatch(newRoom({room}));
    }
  }

  selectRoom(room){
    const username = document.getElementById('welcome-username').value;
    if (username && 0 < username.length) {
      this.props.dispatch(login({ username, room}));
    }
 
  }

  render() {
    const {app} = this.props;
    return (
      <div style={{ display: 'flex', marginTop: '32px' }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ width: '400px' }}>
          <Card>
            <CardTitle
              title="Chatroom Emporium"
            />
            <CardText>
              To start chat, please choose your name.
              <TextField
                id="welcome-username"
                hintText="Your nick name."
                floatingLabelText="Display Name"
              />
              <List >
              {
					    	app.rooms.map((item, index) => (
                  <ListItem key={index} id={item.name} onTouchTap={this.selectRoom.bind(this, item.name)}
                    primaryText={item.name} secondaryText={"Number of people:" + item.counts}
                  />
                ))
              }
              </List>
            </CardText>
            <CardActions>
              <FlatButton label="Create Channel" onTouchTap={this.createRoom.bind(this)} />
            </CardActions>
          </Card>
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
    );
  }
}

function select({ app, users, messages }) {
  return { app, users, messages };
}

export default connect(select)(Welcome);
