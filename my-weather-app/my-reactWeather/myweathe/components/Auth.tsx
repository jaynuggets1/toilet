'use client'
import {useState} from 'react'
import {supabase} from '@/lib/supabase'
import {User} from '@supabase/supabase-js'

interface Authprops{
    user:User|null
}
export default function Auth({user}: Authprops){

const [email, setEmail] = useState<string>("")
const [password, setPassword] = useState<string>("")






async function  handleSignUp(e: React.MouseEvent<HTMLButtonElement>){
e.preventDefault()

const { data,error}= await supabase.auth.signUp({
    email:email,
    password:password
})
if(error){alert(error)}
else(alert("worked"))


}




async function handlePassword(e: React.MouseEvent<HTMLButtonElement>) {
e.preventDefault()

const {error }= await supabase.auth.signInWithPassword({
    email,
    password
})
if(error){alert(error)}
else(alert("worked"))

}


if(user) {
    return(


        <div>
            hi {user.email}
    <div>
        <button onClick={()=>supabase.auth.signOut()}>sign out</button>
    </div>
    </div>
)}







return(
    <div>

<div>
<input type='email' 
value={email}
placeholder='enter email'
onChange={(e)=>setEmail(e.target.value)} />

</div>

<input type='password' value={password} 
placeholder='enter password'
onChange={(e)=>setPassword(e.target.value)} />



<div>
    <button onClick={handleSignUp}>
        sign up
    </button>
    
    <button onClick={handlePassword}>
            login
     </button>
</div>




    </div>
)


}