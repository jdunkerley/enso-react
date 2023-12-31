import React, { useState } from 'react'
import './App.css'
import { getFunctions } from './data/Function';
import Node from './components/Node';
import FunctionNode from './components/FunctionNode';

const typeMapping: { [id:string] : [string | null, string | null] } = {
  "Static": [null, null],
  "Table": ["Standard.Table.Data.Table", "Table"],
  "Column": ["Standard.Table.Data.Column", "Column"],
  "Vector": ["Standard.Base.Data.Vector", "Vector"],
  "Array": ["Standard.Base.Data.Array", "Array"],
  "DBTable": ["Standard.Table.Data.Table", "Table"],
  "DBColumn": ["Standard.Table.Data.Column", " Column"],
  "File": ["Standard.Base.System.File", "File"],
  "Text": ["Standard.Base.Data.Text", "Text"],
  "Number": ["Standard.Base.Data.Numbers", "Number"],
  "Integer": ["Standard.Base.Data.Numbers", "Integer"],
  "Decimal": ["Standard.Base.Data.Numbers", "Decimal"],
  "Date": ["Standard.Base.Data.Time.Date", "Date"],
  "Date_Time": ["Standard.Base.Data.Time.Date_Time", "Date_Time"],
  "Time_Of_Day": ["Standard.Base.Data.Time.Time_Of_Day", "Time_Of_Day"],
  "Excel_Workbook": ["Standard.Table.Excel.Excel_Workbook", "Excel_Workbook"],
  "Postgres_Connection": ["Standard.Database.Internal.Postgres.Postgres_Connection", "Postgres_Connection"]
}

function App() {
  const [ inputType, setInputType ] = useState("Static")
  const [ search, setSearch ] = useState("")

  const [ namespace, type ] = typeMapping[inputType]
  const funcs = getFunctions(search, namespace, type)

  const [ limitHeight, setLimitHeight ] = useState(false)

  return (
    <div>
      <label htmlFor="inputType">Input Type: </label>
      <select value={inputType} onChange={e => setInputType(e.target.value)}>
        {Object.keys(typeMapping).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <label htmlFor="limitHeight">Limit Height: </label>
      <input type="checkbox" checked={limitHeight} onChange={e => setLimitHeight(e.target.checked)} />
      <br />

      <div style={{'display': 'table', 'backgroundColor': '#eeeeee'}}>
        <Node>
          <label htmlFor='search'>Search: </label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value.toLowerCase().trim())} />
        </Node>

        <div className='matchesList' style={{ 'maxHeight': (limitHeight ? '230px' : '') }}>
          {funcs.map(func => (
            <FunctionNode key={func.key} function={func} search={search} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
