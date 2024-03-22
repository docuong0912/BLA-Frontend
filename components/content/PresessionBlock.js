import React, { useEffect } from 'react'
import { useState,useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faMinus,faBounce } from '@fortawesome/free-solid-svg-icons';
import Select from '../utils/Select';
import * as XLSX from 'xlsx';
const PresessionBlock = ({setDuration, question, setQuestion, UpdateProperty, content, setContent, handleSubmit, handleFile, sectionCount, setSectionCount }) => {
    const [excelFile, setExcel] = useState();
    useEffect(() => {
        console.log(question)
    }, [question])
    const handleExFile=(file)=> {
        
        console.log(file)
        const reader = new FileReader();
        let filterData = [];
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array',raw: true, cellFormula: false });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            filterData = jsonData.map((j, k) => {
                let obj = {}; // Initialize an object for each item in the jsonData array
                obj["name"] = j.question;
                obj["explaination"] = j.explain;
                obj["question_type"] = j.type;
                obj["difficult"] = j.difficult;
                obj["option"] = [];

                Object.keys(j).forEach(props => {
                    if (props.includes('option')) {
                        // Process option data if needed
                        const option_text = j[props].split("-")[0];
                        const isCorrect = j[props].split("-")[1];
                        obj["option"].push({
                            "option_text": option_text,
                            "isCorrect": isCorrect === "true"
                        });
                    }
                });

                return obj; // Return the constructed object
            });
            const temp = [...question];

            temp[sectionCount-1] = filterData
            setQuestion(temp);
            
            
        };
        console.log(filterData)
        return filterData;
    }
    useEffect(() => {
        const getFile = async()=>{
             await handleExFile(excelFile);
            
        }
        if (excelFile) {
             getFile();
           
        }
        
    }, [excelFile])
   
    const [needQuiz, DoesNeedQuiz] = useState([false]);
    const [err, setErr] = useState([]);
    //1st referenced, 2nd reference
    const handlePrerequisite = (cid,referenceKey) => {
        
        const referenced = content.find(c => c.cid == cid)
        const index = content.indexOf(referenced)
        const reference = content[index].prerequisitecontent_id.find(p => p.cid == content[referenceKey].cid)
        const otherReferenced = content[index].prerequisitecontent_id.find(p => p.prerequisitecontent_id.find(p2 => p2.cid == content[referenceKey].cid) )
        const alreadyReference = content[referenceKey].prerequisitecontent_id.find(p => p.cid == referenced.cid)

       
        if (alreadyReference) return;
        if (!reference && !otherReferenced) {
            setContent(c => {
                const temp = [...c]
                temp[referenceKey].prerequisitecontent_id[0] = (referenced)
                return temp;
            })
            
            setErr(c => {
                const temp = [...c];
                temp[referenceKey] = '';
                return temp;
            })
        }
        else {
            setErr(c => {
                const temp = [...c];
                temp[referenceKey] = `${referenced.title} is referencing ${content[referenceKey].title}`;
                return temp;
            })
            
        }
        
    }
   
    
    const UpdateQuestionNum = (index) => {

        //setquiz type for each question in each content
        const questionTemp = [...question]
        questionTemp[index].push({isOpen:true})
        setQuestion(questionTemp)
    }
    const UpdateQuizType = (key) => {
        setSectionCount(s => s + 1);
        const questiontemp = [...question];
        if (key >= sectionCount-1) {
            questiontemp.push(Array(1).fill({}));           
            setQuestion(questiontemp)
        }
    }
    useEffect(() => {
        console.log(question)   
        }, [question])
  return (
    <div>
        {[...Array(sectionCount)].map((_,index)=>{
            
            return(
                <div key={index}>
                    
                        <div className="row">
                            <div className="col-md-6 form-group"> 
                            <label>Title:</label>
                            <input type="text" className="form-control" placeholder="Title" onChange={e => setContent(UpdateProperty(content,index,"title",e.target.value))} required /> 
                            </div>
                            <div className="col-md-6 form-group"> 
                            <label>Description:</label>
                            <input type="text" className="form-control" placeholder="Description" onChange={e => setContent(UpdateProperty(content, index, "description", e.target.value))} required />
                                </div>
                        </div>
                            <div className="row mt-3">
                                <div className="col-md-6 form-group">
                                    <label>Choose file:</label>
                                    <input type="file" className="p-3 form-control" onChange={e=>handleFile(e.target.files[0],index)} required/> 
                                </div>
                                                
                          
                                            
                    </div>
                    <div className="form-check">
                        <input onChange={() => {
                            DoesNeedQuiz(UpdateProperty(needQuiz, index, "", !needQuiz));

                        }} className="form-check-input" type="checkbox" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Add Quiz
                        </label>
                     
                    </div>
                    <div className={`${needQuiz[index] ? '' : 'd-none'}`}>
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">Duration </span>
                            <input onChange={e => setDuration(d => {
                                const tempDuration = [...d]
                                tempDuration[index] = e.target.value;
                                return tempDuration;
                            })} type="number" className="form-control" placeholder="Duration" aria-label="Duration" aria-describedby="basic-addon1" />
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6 form-group">
                                <label>Choose file:</label>
                                <input onChange={(e) => setExcel(e.target.files[0])} type="file" className="p-3 form-control" required />
                            </div>



                        </div>
                    </div>
                    {[...Array(question[index].length)].map((_, i) => {
                        return (
                            <div key={i} className={`${needQuiz[index] ? '' : 'd-none'}`}>
                                <b>Question {i + 1}</b>
                             
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">Quiz Question</span>
                                    <input value={question[index][i].name} onChange={e => setQuestion(q => {
                                        const temp = [...question]
                                        question[index][i] = { ...question[index][i], "name": e.target.value }
                                        return temp;
                                    })} type="text" className="form-control" placeholder="Quesion" aria-label="Question" aria-describedby="basic-addon1" />
                                </div>
                                <div className="dropdown my-2">
                                    <button className="btn btn-secondary dropdown-toggle btn-lg" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        Difficulties : {!question[index][i].difficult ? "" : question[index][i].difficult}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li onClick={e => setQuestion(d => {
                                            const temp = [...d]
                                            temp[index][i] = { ...temp[index][i], "difficult": "easy" }
                                            return temp;
                                        })}><p className="dropdown-item" >Easy</p></li>
                                        <li onClick={e => setQuestion(d => {
                                            const temp = [...d]
                                            temp[index][i] = { ...temp[index][i], "difficult": "medium" }
                                            return temp;
                                        })}><p className="dropdown-item" >Medium</p></li>
                                        <li onClick={e => setQuestion(d => {
                                            const temp = [...d]
                                            temp[index][i] = { ...temp[index][i], "difficult": "hard" }
                                            return temp;
                                        })}><p className="dropdown-item" >Hard</p></li>
                                    </ul>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">Explaination</span>
                                    <input value={question[index][i].explaination} onChange={e => setQuestion(q => {
                                        const temp = [...question]
                                        question[index][i] = { ...question[index][i], "explaination": e.target.value }
                                        return temp;
                                    })} type="text" className="form-control" placeholder="Explain ..." aria-label="explain" aria-describedby="basic-addon1" />
                                </div>
                                <select value={question[index][i].question_type} onChange={(e) => setQuestion(t => {
                                    const temp = [...t];
                                    temp[index][i] = { ...temp[index][i], "question_type": e.target.value }
                                    if (e.target.value == 'tf') {
                                        temp[index][i] = { ...temp[index][i], "option": [] };
                                        [...Array(2)].forEach((t, k) => {
                                            
                                            temp[index][i].option.push({ "option_text": k == 0 ? "True" : "False", "isCorrect": false });
                                        })
                                    }
                                    return temp
                                })} className="form-select my-2" aria-label="Quiz type">
                                    <option defaultValue>Quiz type</option>
                                    <option value="mc" readOnly>Multiple Choice</option>
                                    <option value="tf" readOnly>True/False</option>
                                </select>
                                
                                <div>
                                    {/*initialize selection here*/}
                                    <div className={`${question[index][i]?.question_type != 'mc' ? 'd-none' : ''}`}>
                                        <select value={question[index][i]?.option?.length} onChange={(e) => setQuestion(t => {
                                            const temp = [...t];
                                            temp[index][i] = { ...temp[index][i], "number_of_choice": e.target.value };
                                            temp[index][i] = { ...temp[index][i], "option": [] };
                                            [...Array(parseInt(question[index][i]?.number_of_choice))].forEach((t, k) => {
                                                temp[index][i].option.push({ "option_text": '', "isCorrect": false })
                                  
                                            })
                                            return temp;
                                        })} className="form-select my-2" aria-label="Quiz type">
                                            <option defaultValue>Number of option</option>
                                            <option value="2" readOnly>2</option>
                                            <option value="3" readOnly>3</option>
                                            <option value="4" readOnly>4</option>
                                        </select>
                                        {
                                            question[index][i]?.number_of_choice || question[index][i]?.option ? [...Array(parseInt(question[index][i]?.number_of_choice) || question[index][i]?.option.length)].map((_, key) => {
                                                return (
                                                    <div key={key} className="input-group mb-3">
                                                        <span className="input-group-text" id="basic-addon1">Option {key + 1}</span>
                                                        <input value={question[index][i].option[key].option_text} onChange={e => setQuestion(() => {
                                                            const temp = [...question];
                                                            temp[index][i].option[key] = { ...temp[index][i].option[key], "option_text": e.target.value };
                                                            return temp;
                                                        })} type="text" className="form-control" placeholder={`Option${key + 1}`} aria-label="Option 1" aria-describedby="basic-addon1" />
                                                        <div className="form-check mx-1">
                                                            <input checked={question[index][i].option[key].isCorrect} onChange={e => setQuestion(() => {
                                                                const temp = [...question];
                                                                temp[index][i].option[key] = { ...temp[index][i].option[key], "isCorrect": true };
                                                                temp[index][i].option.forEach((_,optionKey) => {
                                                                    if (optionKey != key) {
                                                                        temp[index][i].option[optionKey] = { ...temp[index][i].option[optionKey], "isCorrect": false };
                                                                    }
                                                                });
                                                                return temp;
                                                            })} className="form-check-input" type="radio" name={`QuizQuesion${index}${i}`} id="flexRadioDefault2" />
                                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                Correct Answer
                                                            </label>
                                                        </div>
                                                    </div>
                                                );
                                            }) : ""
                                        }


                                    </div>
                                    <div className={`${question[index][i]?.question_type != 'tf' ? 'd-none' : ''}`}>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id="basic-addon1">Option 1</span>
                                            <input type="text" value="true" className="form-control" placeholder={`true`} aria-label="Option 1" aria-describedby="basic-addon1" readOnly />
                                            <div className="form-check mx-1">
                                                <input  onChange={e => setQuestion(() => {
                                                    const temp = [...question];
                                                    temp[index][i].option[0] = { ...temp[index][i].option[0], "isCorrect": true };
                                                    temp[index][i].option.forEach((_, optionKey) => {
                                                        if (optionKey != 0) {
                                                            temp[index][i].option[optionKey] = { ...temp[index][i].option[optionKey], "isCorrect": false };
                                                        }
                                                    });
                                                    return temp;
                                                })} className="form-check-input" type="radio" name={`QuizQuesion${i}`} id="flexRadioDefault2" />
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    Correct Answer
                                                </label>
                                            </div>
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text" id="basic-addon1">Option 2</span>
                                            <input type="text" value="false" className="form-control" placeholder={`false`} aria-label="Option 1" aria-describedby="basic-addon1" readOnly />
                                            <div className="form-check mx-1">
                                                <input  onChange={e => setQuestion(() => {
                                                    const temp = [...question];
                                                    temp[index][i].option[1] = { ...temp[index][i].option[1], "isCorrect": true };
                                                    temp[index][i].option.forEach((_, optionKey) => {
                                                        if (optionKey != 1) {
                                                            temp[index][i].option[optionKey] = { ...temp[index][i].option[optionKey], "isCorrect": false };
                                                        }
                                                    });
                                                    return temp;
                                                })} className="form-check-input" type="radio" name={`QuizQuesion${i}`} id="flexRadioDefault2" />
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    Correct Answer
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div onClick={() => UpdateQuestionNum(index)} className={`my-2 ${i == question[index].length-1?"":"d-none"}`}>
                                    <FontAwesomeIcon className='d-inline-block' icon={faPlus} />
                                    <p className='d-inline mx-2'>Add more Questions</p>
                                </div>
                            </div>
                        );
                    })}
                    
                    
                    <Select content={content }  setValue={handlePrerequisite} index={index}/>
                    <p className='text-danger'>{err[index]}</p>
                    {index != 0 ? <button onClick={() => { setSectionCount(s => s - 1)}} className='btn btn-lg border border-danger text-danger'><FontAwesomeIcon className='mx-2' icon={faMinus} /> Cancel</button> : ""}
                    <div className={`my-2 ${index == sectionCount-1 ? '' :"d-none"}`} onClick={() => UpdateQuizType(index)}>
                        <FontAwesomeIcon className='d-inline-block' icon={faPlus} />
                        <p className='d-inline mx-2'>Add more content for this section</p>
                    </div>
                </div>
            );
        })}
          <button type='button' className='btn btn-lg btn-success mt-5' onClick={() => handleSubmit()}>Submit</button> 
    </div>
  )
}

export default PresessionBlock