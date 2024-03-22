import React from 'react'
import { useState } from 'react';
import Cookies from 'js-cookie';
import { getToken, setToken } from '@/components/auth/auth';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import { useEffect } from 'react';
import { useDecodeJwt } from '../../hooks/useDecodeJwt';
const Login = () => {
    const [username,setUName] = useState('');
    const [password,setPW] = useState('');
    const [warning,setWarning] = useState(false);
    const router =useRouter();
    const token = getToken();
    useEffect(()=>{
      
      if(token){
        router.push('/home?tab=1')
      }
    })
   
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if the required fields are filled in
        if (username && password) {
          await signin();
        } 
      };
    const signin = async ()=>{

        const response =  await fetch('https://localhost:7277/api/Users/check-user',{
            method:'POST',
            body:JSON.stringify({
                "username":username,
                "password":password
            }),
            headers:{
                'Content-Type':'application/json'
            }
        });
        if(response.ok){
          setWarning(false)
            const token = (await response.text()).toString();
           
       
          Cookies.set('jwt',token,{expires:7});
          setToken(token)
          
          
          
          router.push({
            pathname:'/home'
          
          });
        }
        else{
          setWarning(true);
        }
        
    }
  return (
    <div className='form-02-main'>
        <div className="container">
        <div className="row">
          <div className="col-md-12">
            
            <div className="_lk_de">
            
              <form className="form-03-main" onSubmit={handleSubmit}>
              
                <div className="logo">
                  <img src="login/user.png"/>
                </div>
                <div className={`text-danger w-100 text-center warning ${warning?"active":""}`}>
                  <b ><FontAwesomeIcon icon={faCircleExclamation}/> Invalid Username or password</b>
                </div>
                <div className="form-group">
                    <label>Username:</label>
                  <input className="form-control _ge_de_ol" type="text" 
                  onChange={e=>setUName(e.target.value)}
                  placeholder="Username" required />
                </div>

                <div className="form-group">
                    <label>Password:</label>
                  <input type="password" name="password" className="form-control _ge_de_ol" 
                  onChange={e=>setPW(e.target.value)}
                  placeholder="Enter Password" required aria-required="true"/>
                </div>

                <div className="checkbox form-group">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id=""/>
                    <label className="form-check-label" >
                      Remember me
                    </label>
                  </div>
                  <a href="#">Forgot Password</a>
                </div>

                <div className="form-group">
                  <button type='submit'  className="_btn_04">
                    <a href="#">Login</a>
                  </button>
                </div>

               
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login