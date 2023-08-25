import { useState } from "react"
import { UserSearch } from "./UserSearch"

export default function App() {
  const [vods, setVods] = useState([])


  return (
    <>
      <h1>VoddTTV</h1>
      <UserSearch/>
      <h2>Vods</h2>
      <ul>
        {vods.map(vod => {
          return <li key={vod.id}>
            {vod.title}
          </li>
        })}
      </ul>
    </>
  )
}