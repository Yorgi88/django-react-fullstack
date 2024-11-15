import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'

import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useState, useEffect } from 'react';

function ProtectedRoute({children}) {
    // i think the children means the other sub components that will be wrapped in this ProtectedRoute
    // we need to check if we are authorized, before we allow someone to access this route
    //otherwise we just redirect em and tell em they should log in

    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(()=>{
        auth().catch(() => setIsAuthorized(false));
    }, [])

    const refreshToken = async () => {
        // this refreshes the token for us automatically
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // we send a req to our backend with the refresh token to get a new access token
            const resp = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });  //in our django backend urls.py
            if (resp.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, resp.data.access);
                setIsAuthorized(true);
            }else{
                setIsAuthorized(false);
                console.log('error getting the access token');
                
            }

        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
            
            
        }
    }

    const auth = async () => {
        // this checks if we need to refresh the token or if we are good to go
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return
        }
        // if we do have the token
        const decoded = jwtDecode(token);
         // we decode the token and get what the expiration date is
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;  //to get the date in seconds

        if (tokenExpiration < now) {
            // meaning if token is expired
            await refreshToken();
        }else{
            setIsAuthorized(true);
        }

    }

    if (isAuthorized == null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to={'/login'}/>
    // this means if authorized ? then pass in the sub-comps, else
}

export default ProtectedRoute;