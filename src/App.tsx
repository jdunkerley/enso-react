import React, { useState } from 'react'
import './App.css'
import Function, { getFunctions, getTypes } from './data/Function';
import Grouping, { ALL_GROUP, GROUPING_NAMES, GROUPS, SUGGESTED } from './data/Grouping';
import Node from './components/Node';
import FunctionNode from './components/FunctionNode';
import { getJSON, reset } from './data/FunctionGrouping';
import SvgIcon from './components/SvgIcon';
import svgIcons from './components/icons.svg';

const typeMapping: { [id:string] : [string | null, string | null] } = 
  getTypes().reduce((acc: { [id:string]: [string | null, string | null] }, type) => {
    if (type === null) {
      acc["Static"] = [null, null]
      return acc
    }

    const parts = type.match(/^(.*)\.([^.]+)$/)
    if (parts !== null) {
      const name = parts[2].toString()
      const namespace = parts[1].toString()
      if (namespace.startsWith("Standard.Visualization")) {
        return acc
      }

      if (acc[name] !== undefined && acc[name][0] !== namespace) {
        console.error(`Duplicate type: ${name} (${type} vs ${acc[name][0]}.${acc[name][1]})`)
      }
      acc[name] = [namespace, name]
    }
    return acc
  }, {})

function App() {
  const [ inputType, setInputType ] = useState("Static")
  const [ search, setSearch ] = useState("")

  const [ namespace, type ] = typeMapping[inputType] ?? ["???", "???"]

  const [ grouping, setGrouping ] = useState(ALL_GROUP)

  const [ showPrivate, setShowPrivate ] = useState(false)

  const [ revision, setRevision ] = useState(0)

  const funcs = getFunctions(search, namespace, type, grouping, showPrivate, revision)
  const suggestedFuncs = getFunctions("", namespace, type, SUGGESTED, false, revision)
  const [ selected, setSelected ] = useState<string | null>(null)

  const selectedFunc = selected ? funcs.find(func => func.key === selected) : null
  const handleAliasChange = (index: number, value: string | null) => {
    if (selectedFunc) {
      const current = selectedFunc.aliases ?? []
      if (value === null) {
        selectedFunc.aliases = [...current.slice(0, index), ...current.slice(index + 1)]
      } else {
        if (index >= current.length) {
          selectedFunc.aliases = [...current, value]
        } else {
          selectedFunc.aliases = [...current.slice(0, index), value, ...current.slice(index + 1)]
        }
      }
      setRevision(revision + 1);
    }
  }

  const handleSuggestChange = (func: Function) => {
    if (func.suggested) {
      func.suggested = null
    } else {
      func.suggested = getFunctions("", namespace, type, "Suggested", false, revision).map(f => f.suggested || 0).reduce((acc, val) => Math.max(acc, val), 0) + 1
    }
    setRevision(revision + 1)
  }

  const handleSuggestFlip = (top:number, bottom:number) => {
    const topFunc = suggestedFuncs[top]
    const bottomFunc = suggestedFuncs[bottom]
    const topSuggest = topFunc.suggested
    topFunc.suggested = bottomFunc.suggested
    bottomFunc.suggested = topSuggest
    setRevision(revision + 1)
  }

  const handleDownload = () => {
    const jsonData = new Blob([getJSON()], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
    link.href = jsonURL;
    link.download = `FunctionGrouping.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all Function Groupings?")) {
      reset()
      setRevision(revision + 1)
    }
  }
  const [ icons, setIcons ] = useState<string[]>([])
  if (icons.length === 0) {
    setIcons(["enso_logo"])
    fetch(svgIcons).then(response => response.text()).then(text => {
      setIcons([...text.matchAll(/<symbol id="([^"]+)"/g)].map((match: RegExpMatchArray) => {
            return match[1].toString()
        }).sort())
      })
    }

  return (
    <div>
      <button style={{'float': 'right', padding: '2px', margin: '2px'}} onClick={handleReset}>Reset</button>
      <button style={{'float': 'right', padding: '2px', margin: '2px'}} onClick={handleDownload}>Download Data</button>
      <label htmlFor="inputType">Input Type: </label>
      <input type="text" name="typeInput" list="typeList" value={inputType} onChange={e => setInputType(e.target.value)}></input>
      <datalist id="typeList">
        {Object.keys(typeMapping).sort().map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </datalist>

      <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
        <div className='functionList'>
          <Node>
            <label htmlFor="grouping">Grouping: </label>
            <select value={grouping} onChange={e => setGrouping(e.target.value)}>
              {GROUPING_NAMES.map(key => (
                <option key={key} value={key} style={{ 'backgroundColor': Grouping.get(key)?.color}}>{key}</option>
                ))}
            </select>
          </Node>
          <Node>
            <label htmlFor="showPrivate">Show Private: </label>
            <input type="checkbox" checked={showPrivate} onChange={e => setShowPrivate(e.target.checked)} />
          </Node><br />

          <Node>
            <label htmlFor='search'>Search: </label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value.toLowerCase().trim())} />
          </Node><br />

          <div className='matchesList'>
            {funcs.map((func, idx) => (
              <div key={func.key}>
                <FunctionNode key={func.key} function={func} search={search} onClick={() => setSelected(func.key)} onDoubleClick={() => handleSuggestChange(func)}/>
              </div>
              ))}
          </div>
        </div>
        <div className='functionList'>
          <Node>
            <label htmlFor='suggested'>Reapply Suggested: </label>
            <input type="button" value="Reapply" disabled={suggestedFuncs.length > 0 && suggestedFuncs.length === suggestedFuncs[suggestedFuncs.length - 1].suggested} onClick={() => {
              suggestedFuncs.forEach((func, idx) => func.suggested = idx + 1)
              setRevision(revision + 1)
            }} />
          </Node>

          <div className='matchesList'>
            {suggestedFuncs.map((func, idx) => (
              <div key={func.key} style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                <FunctionNode key={func.key} function={func} search={search} onClick={() => setSelected(func.key)} onDoubleClick={() => handleSuggestChange(func)}/>
                <button style={{border: 'none', float: 'right'}} disabled={idx === 0} onClick={() => handleSuggestFlip(idx, idx - 1)}>⬆️</button>
                <button style={{border: 'none', float: 'right'}} disabled={idx === suggestedFuncs.length - 1} onClick={() => handleSuggestFlip(idx, idx + 1)}>⬇️</button>
              </div>
              ))}
          </div>
        </div>
        {selectedFunc && (
          <div className='functionList' style={{'paddingLeft': '15px', 'flex': 1}}>
              <FunctionNode function={selectedFunc} search={search} onClick={() => setSelected(null)} /><br />

              <label>Namespace: {selectedFunc.namespace}</label><br />
              <label>Type: {selectedFunc.type}</label><br />
              <label>Name: {selectedFunc.name}</label><br />
              <br />

              <label htmlFor='isPublic'>Is Public: </label>
              <input type="checkbox" checked={selectedFunc.isPublic} onChange={e => { selectedFunc.isPublic = e.target.checked; setRevision(revision + 1) }} /><br />

              <label htmlFor='grouping'>Group: </label>
              <select value={selectedFunc.grouping.name} onChange={e => { selectedFunc.grouping = Grouping.get(e.target.value); setRevision(revision + 1) }}>
                {GROUPS.map(key => (
                  <option key={key} value={key} style={{ 'backgroundColor': Grouping.get(key)?.color}}>{key}</option>
                ))}
              </select><br />

              <label htmlFor='icon'>Icon: </label>
              <SvgIcon name={selectedFunc.icon ?? "enso_logo"} />
              <select value={selectedFunc.icon ?? "enso_logo"} onChange={e => { selectedFunc.icon = e.target.value; setRevision(revision + 1) }}>
                {icons.map(key => (
                  <option key={key} value={key} data-img={key}>
                    {key}
                  </option>
                ))}
              </select><br />

              {selectedFunc.suggested && (<><label>Suggested: {selectedFunc.suggested}</label><br /></>)}
              <br/>

              <label htmlFor='alias'>Aliases: </label>
              {selectedFunc.aliases.map((alias, index) => (
                <div key={index} style={{display: 'flex', flexDirection: 'row'}}>
                  <input type="text" value={alias} onChange={e => handleAliasChange(index, e.target.value)} style={{'display': 'block'}}/>
                  <input type="button" value="⛔" onClick={() => handleAliasChange(index, null)} />
                </div>
                ))}
              <input type="button" value="➕" onClick={() => handleAliasChange(selectedFunc.aliases.length, "new_alias")} /><br />
              <br />

              <label htmlFor='description'>Description: </label><br/>
              <textarea value={selectedFunc.description ?? ""} onChange={e => { selectedFunc.description = e.target.value; setRevision(revision + 1); }} rows={5} cols={120}/>
              <br />

              <label htmlFor='args'>Arguments: </label><br/>
              <textarea value={selectedFunc.arguments ?? ""} onChange={e => { selectedFunc.arguments = e.target.value; setRevision(revision + 1); }} rows={5} cols={120}/>
              <br />

              <label htmlFor='returns'>Returns: </label><br/>
              <textarea value={selectedFunc.returns ?? ""} onChange={e => { selectedFunc.returns = e.target.value; setRevision(revision + 1); }} rows={5} cols={120}/>
              <br />

              <label htmlFor='examples'>Examples: </label><br/>
              <textarea value={selectedFunc.examples ?? ""} onChange={e => { selectedFunc.examples = e.target.value; setRevision(revision + 1); }} rows={5} cols={120}/>
              <br />

              <label htmlFor='errors'>Errors: </label><br/>
              <textarea value={selectedFunc.errors ?? ""} onChange={e => { selectedFunc.errors = e.target.value; setRevision(revision + 1); }} rows={5} cols={120}/>
              <br />

              <label htmlFor='remarks'>Remarks: </label><br/>
              <textarea value={selectedFunc.remarks ?? ""} onChange={e => { selectedFunc.remarks = e.target.value; setRevision(revision + 1); }} rows={5} cols={120}/>
              <br />
          </div>
        )}
        <div className='functionList'>
          {icons.map(key => (
            <div key={key} style={{display: 'flex', flexDirection: 'row'}}>
              <SvgIcon name={key} />
              <label>{key}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
