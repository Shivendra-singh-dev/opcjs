// events - Event handling
import events from 'events'

// console.log(events.init)
// console.log(events.setMaxListeners)
emitter.once("login", (username) => {
  console.log(`${username} logged in`);
});

emitter.emit("login", "Alice");
emitter.emit("login", "Bob");

