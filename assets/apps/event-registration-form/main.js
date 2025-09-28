import App from './app';
const { Component, render } = wp.element;

class EventRegistrationForm extends Component {

  render() {
    return <App />;
  }
}

render(<EventRegistrationForm />, document.getElementById("app"));
