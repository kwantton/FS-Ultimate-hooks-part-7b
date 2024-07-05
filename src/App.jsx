import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

                    // baseUrl = either localhost:3005/notes or localhost:3005/persons
const useResource = (baseUrl) => { // "Extract the code for communicating with the backend into its own useResource hook. It is sufficient to implement fetching all resources and creating a new resource."
  const [resources, setResources] = useState([])

  // ...
  // I guess useEffect should be used to get the resources
  useEffect(() => {
    axios.get(baseUrl)
    .then(response => {
      console.log("get response.data:", response.data)
      setResources(response.data)
    })
  }, [baseUrl])

  const create = (resource) => {  // resource = { name: name.value, number: number.value} (person), OR  { content: content.value } (notes)
    axios.post(`${baseUrl}`, resource)
    .then(response => {
      console.log("post response.data:",response.data)
      setResources([...resources, response.data]) // don't forget this or you won't see the new stuff until refresing (presuming your database is functional, that is c:)
      return response.data // since "service" (this function) is returned to be used in this way
    })
    .catch(error => console.error(error))
  }

  const service = {
    create
  }

  return [ // below: [notes, noteService] = useResource('http://localhost:3005/notes), etc. for persons, personService
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App