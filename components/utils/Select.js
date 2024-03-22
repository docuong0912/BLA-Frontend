import React from 'react'
import { useEffect,useRef,useState } from 'react'
import { useContentContext } from '../../pages/content/Create';
const Select = ({content, setValue, index }) => {
    
    const [filteredTitle,setTitle] = useState([]);
    useEffect(()=>{
       const filter = content?.filter((_,key)=>key!=index)
        setTitle(filter);
       
    },[content])

  return (
    <details className="custom-select">
	<summary className="radios">
              {content[index]?.prerequisitecontent_id.length != 0 ? "" :<p>prerequisitecontent_id</p>}
        {filteredTitle?.map((t,key)=>{
            return (
                <input key={key} type="radio" name={`item${index}`} id={t.cid} title={t.title} checked={content[index].prerequisitecontent_id.find(p => p.cid == t.cid)||false } readOnly />
            );
        })}
	</summary>
	<ul className="list">
        {filteredTitle?.map((t,key)=>{
            return(
                <li key={key} onClick={() => setValue(t.cid,index)}>
                    <label className='selection' htmlFor={t.cid} >
                        {t.title}
                        <span></span>
                    </label>
		        </li>
            );
        })}
		
	</ul>
</details>
  )
}

export default Select