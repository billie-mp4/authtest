import {createClient, type JwtPayload} from '@supabase/supabase-js'
import type {Database} from './database.types'
import {useState,useEffect} from 'react'
function App() {
  const url=import.meta.env.VITE_SUPABASE_URL
  const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const supabase=createClient<Database>(url,key)
  const [claims,setClaims]=useState<JwtPayload|null>(null)

  useEffect(()=>{
    supabase.auth.getClaims().then(({data})=>{setClaims(data?.claims??null)})
    const {data}=supabase.auth.onAuthStateChange(()=>{
      supabase.auth.getClaims().then(({data})=>{setClaims(data?.claims??null)})
    })
    return ()=>data.subscription.unsubscribe()
  },[])

  async function login(){
    const {data:_data,error}=await supabase.auth.signInWithOAuth({provider:'github',options:{redirectTo:'https://billie-mp4.github.io/authtest/'}})
    if(error!==null){
      console.error(error)
    }
    const {data,error:_error}=await supabase.auth.getClaims()
    setClaims(data?.claims??null)
  }
  async function logout(){
    const {error}=await supabase.auth.signOut()
    if(error!==null){
      console.error(error)
    }
    setClaims(null)
  }

  if(claims)return <div><button onClick={()=>logout()}>logout</button></div>
  return <div><button onClick={()=>login()}>login</button></div>
}
export default App