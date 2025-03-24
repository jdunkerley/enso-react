import React, { useState } from 'react'
import './App.css'
import { getFunctions, getTypes } from './data/Function';
import { getGrouping, GROUPING_NAMES } from './data/Grouping';
import Node from './components/Node';
import FunctionNode from './components/FunctionNode';

const typeMapping: { [id:string] : [string | null, string | null] } = 
  getTypes().reduce((acc: { [id:string]: [string | null, string | null] }, type) => {
    if (type === null) {
      acc["Static"] = [null, null]
      return acc
    }

    const parts = type.match(/(.*)\.([^.]+)/)
    if (parts !== null) {
      acc[parts[2].toString()] = [parts[1].toString(), parts[2].toString()]
    }
    return acc
  }, {})

function App() {
  const [ inputType, setInputType ] = useState("Static")
  const [ search, setSearch ] = useState("")

  const [ namespace, type ] = typeMapping[inputType] ?? ["???", "???"]

  const [ grouping, setGrouping ] = useState("Suggested")

  const [ showPrivate, setShowPrivate ] = useState(false)

  const funcs = getFunctions(search, namespace, type, grouping, showPrivate)

  return (
    <div>
      <label htmlFor="inputType">Input Type: </label>
      <input type="text" name="typeInput" list="typeList" value={inputType} onChange={e => setInputType(e.target.value)}></input>
      <datalist id="typeList">
        {Object.keys(typeMapping).sort().map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </datalist>
      <br />

      <label htmlFor="grouping">Grouping: </label>
      <select value={grouping} onChange={e => setGrouping(e.target.value)}>
        {GROUPING_NAMES.map(key => (
          <option key={key} value={key} style={{ 'backgroundColor': getGrouping(key)?.color}}>{key}</option>
          ))}
      </select>
      <br />

      <label htmlFor="showPrivate">Show Private: </label>
      <input type="checkbox" checked={showPrivate} onChange={e => setShowPrivate(e.target.checked)} />

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
