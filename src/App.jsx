import { useState } from "react"
import { UserSearch } from "./UserSearch"

export default function App() {
  const [vods, setVods] = useState([])


  return (
    <>
      <h1>VodTTV</h1>
      <UserSearch/>
      <h2>Vods</h2>
      
    </>
  )
}