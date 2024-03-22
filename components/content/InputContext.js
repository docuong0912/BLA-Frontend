import React from 'react'
export const useInputContext=createContext();
const InputContext = ({title,sectionCount,description,children}) => {
  return (
    <InputContext.Provider value={{title,sectionCount,description}}>
        <div>children</div>
    </InputContext.Provider>
    
  )
}

export default InputContext