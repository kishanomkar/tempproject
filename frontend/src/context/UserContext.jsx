import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'


export const userDataContext = createContext();

export default function UserContext({children}) {

    const [domuser, setDomUser] = useState({
        email: '',
        fullname:{
            firstname:'',
            lastname:''
        }
    })

    const [foguser, setFogUser] = useState({
        email: '',
        fullname:{
            firstname:'',
            lastname:''
        }
    })

return (
    <div>
    <userDataContext.Provider value={{user, setUser}}>
        {children}
    </userDataContext.Provider>
    </div>
)
}
