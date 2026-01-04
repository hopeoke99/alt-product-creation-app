import { useState } from 'react';
import './App.css';
import NoFormLibrary from './pages/NoFormLibrary';
import FormLibrary from './pages/FormLibrary';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div style={{ padding: 24, fontFamily: 'Arial' }}>
        <h1>Product Creation App</h1>

        <h2>No Form Library</h2>
        <NoFormLibrary />

        <hr />

        <h2>With Form Library (React Hook Form)</h2>
        <FormLibrary />
      </div>
    </>
  );
}

export default App;
