import logo from './logo.svg';
import './App.css';
// import dancePuppet from './puppeteerScripts/dance.js';

function App() {

  const clickHandler = () => {
    console.log('Clicked');
    // dancePuppet();
  };
  return (
    <div className="App">
      <p>Hello World</p>
      {/* <button onClick={clickHandler}>Click me</button> */}
    </div>
  );
}

export default App;
