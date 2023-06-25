import React, { useState } from 'react'
import './App.css'
import { getFunctions } from './data/Function';
import FunctionNode from './components/FunctionNode';

const typeMapping: { [id:string] : [string | null, string | null] } = {
  "Static": [null, null],
  "Table": ["Standard.Table.Data.Table", "Table"],
  "TableColumn": ["Standard.Table.Data.Column", "Column"],
  "File": ["Standard.File", "File"],
  "Text": ["Standard.Data.Text", "Text"]
}

function App() {
  const [ inputType, setInputType ] = useState("Table")
  const [ search, setSearch ] = useState("sc")

  const [ namespace, type ] = typeMapping[inputType]
  const funcs = getFunctions(search, namespace, type)

  return (
    <div>
      <label htmlFor="inputType">Input Type: </label>
      <select value={inputType} onChange={e => setInputType(e.target.value)}>
        {Object.keys(typeMapping).map(key => (
          <option value={key}>{key}</option>
        ))}
      </select><br />

      <label htmlFor='search'>Search: </label>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} />

      {funcs.map(func => (
        <FunctionNode function={func} />
      ))}
    </div>
  );
}

export default App;
