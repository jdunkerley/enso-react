import React, { useState } from 'react'
import './App.css'
import { getFunctions } from './data/Function';
import Node from './components/Node';
import FunctionNode from './components/FunctionNode';

const typeMapping: { [id:string] : [string | null, string | null] } = {
  "Static": [null, null],
  "Table": ["Standard.Table.Data.Table", "Table"],
  "Column": ["Standard.Table.Data.Column", "Column"],
  "DBTable": ["Standard.Table.Data.Table", "Table"],
  "DBColumn": ["Standard.Table.Data.Column", " Column"],
  "File": ["Standard.Base.System.File", "File"],
  "Text": ["Standard.Base.Data.Text", "Text"],
  "Number": ["Standard.Base.Data.Numbers", "Number"],
  "Integer": ["Standard.Base.Data.Numbers", "Integer"],
  "Decimal": ["Standard.Base.Data.Numbers", "Decimal"],
  "Date": ["Standard.Base.Data.Time.Date", "Date"],
  "Date_Time": ["Standard.Base.Data.Time.Date_Time", "Date_Time"],
  "Time_Of_Day": ["Standard.Base.Data.Time.Time_Of_Day", "Time_Of_Day"]
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
          <option key={key} value={key}>{key}</option>
        ))}
      </select><br />

      <div style={{'display': 'table', 'backgroundColor': '#eeeeee'}}>
        <Node>
          <label htmlFor='search'>Search: </label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value.toLowerCase().trim())} />
        </Node>

        <div className='matchesList'>
          {funcs.map(func => (
            <FunctionNode key={func.key} function={func} search={search} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
