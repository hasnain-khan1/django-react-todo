import React, {useState,useEffect} from 'react';
import axios from "axios";
import { getToken, removeToken } from '../services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../features/authSlice';
import { unsetUserInfo } from '../features/userSlice';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleCheck, faPen, faTrashCan 
} from '@fortawesome/free-solid-svg-icons'
import './tod.css';

function Todo() {
  const handleLogout = () => {
    dispatch(unsetUserInfo({ name: "", email: "" }))
    dispatch(unSetUserToken({ access_token: null }))
    removeToken()
    navigate('/login')
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Tasks (ToDo List) State
  const { access_token } = getToken()
  const auth_token = {headers:{'Authorization': `Bearer ${access_token}`}}
  const [toDo, setToDo] = useState([]);
  let [logged, setlogged] = useState([]);
//  const base_url = process.env.REACT_APP_BASE_URL
 const base_url = 'https://hasnain-django-react3-dot-cloud-work-314310.ew.r.appspot.com/'
  // Temp State
  // const [newTask, setNewTask] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updateData, setUpdateData] = useState('');

  useEffect(()=>{
    axios.get(`${base_url}/all-todo/`,auth_token).then((response) => {
      setToDo(response.data);
    });
    axios.get(`${base_url}/profile/`,auth_token).then((response) => {
      setlogged(response.data);
    });
})

  // Add task
  const addTask = () => {
    if(title || description) {
        let newEntry = {title: title,description:description, status: false}
        axios.post(`${base_url}/add-todo/`,newEntry,auth_token).then((response) => {
          setToDo([...toDo, response.data]);
        });
        // setNewTask('');
        setTitle('');
        setDescription('');
    }
  }
  const deleteTask = (id) => {
    let newTasks = toDo.filter((task) => task.id !== id);
    axios.delete(`${base_url}/delete-todo/${id}/`,auth_token).then((response) => {
    });
    setToDo(newTasks);}

  // mark task as done or completed
  const markDone = (id) => {
    const newTasks = toDo.map((task) => {
      if (task.id === id){
        axios.post(`${base_url}/update-todo/${id}/`,{status:!task.status},auth_token).then((response) => {
        });
        return ({ ...task, status: !task.status })
      }
      return task;
    });
    setToDo(newTasks);
  }

  // cancel update
  const cancelUpdate = () => {
    setUpdateData('');
  }

  // Change task for update
  const changeTask = (e) => {
    let newEntry = {
      id: updateData.id,
      title: e.target.value,
      description: updateData.description,
      status: updateData.status ? true : false,
    }
    setUpdateData(newEntry);
  }

  const changeTask1 = (e) => {
    let newEntry = {
      id: updateData.id,
      title: updateData.title,
      description: e.target.value,
      status: updateData.status ? true : false,
    }
    setUpdateData(newEntry);
  }

  // update task
  const updateTask = () => {
    axios.post(`${base_url}/update-todo/${updateData.id}/`,updateData,auth_token).then((response) => {
      // setToDo(response.data);
    });
    let filterRecords = [...toDo].filter( task=>task.id !== updateData.id);
    let updatedObject = [...filterRecords, updateData];
    setToDo(updatedObject);
    setUpdateData('');
  }

  return (
    <div className="container App">
          <div class="header">
      <a href="#home" class="logo">TodoAPP</a>
      <div class="header-right">
        <a class="active" href="/login" onClick={handleLogout}>Logout</a>
      </div>
    </div>
      
      <br /><br />
      <h2><b>{logged.username}</b> Todos</h2>
      <br /><br />
      
      {updateData && updateData ? (
        <>
          <div className="row">
            <div className="col">
              <input 
                value={updateData && updateData.title} 
                onChange={ (e) => changeTask(e) } 
                className="form-control form-control-lg" 
              />
            </div>
            <br/>
            <br/>

            <div className="col">
              <input 
                value={updateData && updateData.description} 
                onChange={ (e) => changeTask1(e) } 
                className="form-control form-control-lg" 
              />
            </div>
            <div className="col-auto">
              <button 
                className="btn btn-lg btn-success mr-20" 
                onClick={updateTask}
              >Update</button>
              <button 
                className="btn btn-lg btn-warning" 
                onClick={cancelUpdate}
              >Cancel</button>
            </div>
          </div>
          <br />
        </>
      ) : (
        <>
          <div className="row">
            <div className="col">
              <input value={title}  onChange={e => setTitle(e.target.value)} className="form-control form-control-lg" 
                placeholder='Task'
              /></div>

            <div className="col">
              <input 
                value={description} onChange={e1=> setDescription(e1.target.value)} 
                className="form-control form-control-lg" placeholder='description'/>
            </div>
            <div className="col-auto">
              <button  className="btn btn-lg btn-success" onClick={addTask}>Add Task</button>
            </div>
          </div>
          <br />
        </>
      )}



      {/* If there are no to dos in state, display a message   */}
      {toDo && toDo.length ? '' : 'No tasks...'}
      {/* Show to dos   */}
      {toDo && toDo
        .sort((a, b) => a.id < b.id ? 1 : -1)
        .map( (task, index) => {
        return(
          <React.Fragment key={task.id}>
            <div className="col taskBg">            
              <div 
                // if task status is true, add class to this div named as done
                className={ task.status ? 'done' : '' }>
                {/* Show number of task */}
                <span className="taskNumber">{index + 1}</span> 
                <span className="taskText">{task.title}</span>
              </div>
              <div className='description'>
                <span className={ task.status ? 'done' : 'descrip' }> <br/>&nbsp;&nbsp;&nbsp;&nbsp;
                {task.description}</span>
                </div>
              <div className="iconsWrap">
                <span 
                  onClick={(e) => markDone(task.id)}
                  title="Completed / Not Completed"
                >
                  <FontAwesomeIcon icon={faCircleCheck} />
                </span>
                
                {task.status ? null : (
                  <span 
                    title="Edit"
                    onClick={ () => setUpdateData({ id: task.id, title: task.title,description:task.description                                                                                  
                      , satus: task.status ? true : false }) }
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </span>
                )}
                <span 
                  onClick={() => deleteTask(task.id)}
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </span>
              </div>
            </div>   
        </React.Fragment>
        );
      })}
    </div>
  );
}

export default Todo;