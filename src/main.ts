import { createClient, type SupabaseClient, type JwtPayload} from '@supabase/supabase-js'
import type {Database} from './database.types.ts'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey)
interface LoggedOut{kind:'logged-out'}
interface Pending{kind:'pending'}
interface LoggedIn{kind:'logged-in',claims:JwtPayload}
interface AuthError{kind:'auth-error'}
type AuthState=LoggedOut|Pending|LoggedIn|AuthError
type Claims=Awaited<ReturnType<SupabaseClient['auth']['getClaims']>>
const claims_to_state=(claims:Claims):AuthState=>{
	if(claims.data===null&&claims.error===null)return {kind:'logged-out'}
	else if(claims.error!==null)return {kind:'auth-error'}
	else return {kind:'logged-in',claims:claims.data.claims}
}
const get_auth_state=async (client:SupabaseClient<Database>):Promise<AuthState>=>{
	const claims=await client.auth.getClaims()
	return claims_to_state(claims)
}
/*
const show_username=(claims:LoggedIn)=>{
	const metadata=claims.claims.user_metadata
	return metadata?.user_name
}
let global_auth_state:AuthState={kind:'logged-out'} as AuthState
*/
const handle_auth_state=(authstate:AuthState)=>{
	show_auth_state(authstate)
	//global_auth_state=authstate
}

async function login(client:SupabaseClient<Database>){
	const {data:_data,error}=await client.auth.signInWithOAuth({provider:'github',options:{redirectTo:'https://billie-mp4.github.io/authtest/'}})
	if(error!==null)return console.error(error)
}
let app=document.querySelector<HTMLDivElement>('#app')!
const show_logged_in=(authstate:LoggedIn)=>{
	let btn=document.createElement('button')
	btn.textContent='logout'
	app.appendChild(btn)
	btn.onclick=async()=>{const{error:_error}=await supabase.auth.signOut()}
	console.log(authstate)
}
const show_logged_out=(authstate:LoggedOut)=>{
	let btn=document.createElement('button')
	btn.textContent='login'
	app.appendChild(btn)
	btn.onclick=async()=>{login(supabase)}
	console.log(authstate)
}
const show_auth_state=(authstate:AuthState)=>{
	app.replaceChildren()
	if(authstate.kind==='logged-in')show_logged_in(authstate)
	else if(authstate.kind==='logged-out')show_logged_out(authstate)
}
window.onload=async function(){
	let auth_state=await get_auth_state(supabase)
	handle_auth_state(auth_state)
	supabase.auth.onAuthStateChange(async ()=>{
		let new_auth_state=await get_auth_state(supabase)
		handle_auth_state(new_auth_state)
	})
}