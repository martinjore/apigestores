import React, { useState,useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() 
{
  const baseUrl="https://localhost:44344/api/gestores";
  const [data, setData]=useState([]);
 
  const [ModalEditar, setModalEditar]=useState(false);
  const [ModalInsertar, setModalInsertar]=useState(false);
  const [ModalEliminar, setModalEliminar]=useState(false);

  const [GestorSeleccionado, setGestorSeleccionado]=useState({
    id:'',
    nombre:'',
    lanzamiento:'',
    desarrolador:''

  })
  
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!ModalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!ModalEditar);
  }

   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!ModalEliminar);
  }

  const handleChange =e=>{
    const {name,value}=e.target;
    setGestorSeleccionado({
      ...GestorSeleccionado,
      [name]:value

    });
    console.log(GestorSeleccionado);
  }
 


 
  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPost=async()=>{
    delete GestorSeleccionado.id;
    GestorSeleccionado.lanzamiento=parseInt(GestorSeleccionado.lanzamiento);
    await axios.post(baseUrl, GestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }


  const peticionPut=async()=>{
    GestorSeleccionado.lanzamiento=parseInt(GestorSeleccionado.lanzamiento);
    await axios.put(baseUrl+"/"+GestorSeleccionado.id, GestorSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(gestores=>{
        if(gestores.id===GestorSeleccionado.id){
          gestores.nombre=respuesta.nombre;
          gestores.lanzamiento=respuesta.lanzamiento;
          gestores.desarrollador=respuesta.desarrollador;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+GestorSeleccionado.id)
    .then(response=>{
     setData(data.filter(gestor=>gestor.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarGestor=(gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }
    
  useEffect(()=>{

  peticionGet();

  },[])

  return (
    <div className="App">
       <br/><br/>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar nuevo gestor</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <tr>
          <th>ID </th>
          <th>Nombre </th>
          <th>Lanzamiento </th> 
          <th>Desarrolador </th>
          <th>Acciones</th>
          
          </tr>
        </thead>
        <tbody>
        {data.map(gestores=>(
          <tr key={gestores.id}>
            <td>{gestores.id}</td>
            <td>{gestores.nombre}</td>
            <td>{gestores.lanzamiento}</td>
            <td>{gestores.desarrolador}</td>
            <td>
              <button className="btn btn-outline-secondary"onClick={()=>seleccionarGestor(gestores, "Editar")}>Editar</button>{" "}
              <button className="btn btn-danger"onClick={()=>seleccionarGestor(gestores, "Eliminar")}>Eliminar</button>
            </td>
          </tr>
        ))}
        
        </tbody>


      </table>
     
      <Modal isOpen={ModalInsertar}>
        <ModalHeader>Insertar de la base de datos</ModalHeader>
          <ModalBody>
            <div className="form-group">

              <label>Nombre</label>
              <br/>
              <input text ="type" className="form-control" name="nombre" onChange={handleChange}/>
              <br/>
              <label>Lanzamiento</label>
              <br/>
              <input text ="type" className="form-control" name="lanzamiento" onChange={handleChange}/>
              <br/>
              <label>Desarrolador</label>
              <br/>
              <input text ="type" className="form-control" name="desarrollador" onChange={handleChange}/>
            </div>
          </ModalBody>
            <ModalFooter>
             <button className="btn btn-primary"onClick={()=>peticionPost()}>Insertar</button>{"  " }
             <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
            </ModalFooter>

          
        
      </Modal>
      
    <Modal isOpen={ModalEditar}>
      <ModalHeader>Editar Gestor de Base de Datos</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID: </label>
          <br />
          <input type="text" className="form-control" readOnly value={GestorSeleccionado && GestorSeleccionado.id}/>
          <br />
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange} value={GestorSeleccionado && GestorSeleccionado.nombre}/>
          <br />
          <label>Lanzamiento: </label>
          <br />
          <input type="text" className="form-control" name="lanzamiento" onChange={handleChange} value={GestorSeleccionado && GestorSeleccionado.lanzamiento}/>
          <br />
          <label>Desarrollador: </label>
          <br />
          <input type="text" className="form-control" name="desarrollador" onChange={handleChange} value={GestorSeleccionado && GestorSeleccionado.desarrollador}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={ModalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Gestor de Base de datos {GestorSeleccionado && GestorSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    
    </div>
  );
}
export default App;