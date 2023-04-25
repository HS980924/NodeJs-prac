import { useState } from 'react';
import axios from 'axios';

const Main = () => {
    const [ signUp, setSignUp ]= useState(false);
    const [ isLoggined, setIsLoggined ]= useState(false);
    //const [ info, setInfo ] = useState({ "email":"", "password":"" });
    const [ email, setEmail ] = useState(null);
    const [ password, setPassword ] = useState(null);
    const [ userInfo, setUserInfo ] = useState({});

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onLogin = async() => {
        if (email && password){
            const user = {
                "email": email,
                "password": password,
            }
        }else{
            console.log();
        }
    };

    const onSignUp = () => {

    };

    return(
        <div>
            <input name='email' onChange={onChangeEmail}/>
            <input name='password' onChange={onChangePassword}/>
            <button onClick={onLogin}>로그인</button>
            <button>카카오톡</button>
            <button onClick={onSignUp}>회원가입</button>
        </div>
    );
};


export default Main;