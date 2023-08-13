import express from 'express';
import cors from 'cors';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { 
  convertNodeToArray, 
  addNodeToNestedStructure, 
  addEmployee, 
  replaceNodeById,
  updateEmployee,
  deleteEmployee,
  deleteLeafRole,
  popRole
 } from './functions.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular application's URL
};

// Enable CORS
app.use(cors(corsOptions));
// Read the content of data.json synchronously
const filePath = 'data.json'
let jsonAllData = readFileSync('data.json', 'utf8');
// fs.writeFileSync(filePath, JSON.stringify(newData));
// Store the content in a variable
let parsedAllData = JSON.parse(jsonAllData);
// console.log(parsedAllData.roles[0])
// 
let parsedRolesData = parsedAllData.roles
// console.log('parsed roles data ', parsedRolesData[0].data.id)

let parsedEmployeeData = parsedAllData.employees

let arrayRolesData = convertNodeToArray(parsedRolesData)
// console.log('array roles ', arrayRolesData)

app.get('/api/all', (req, res) => {
  res.status(200).send(parsedAllData);
})

// get array roles
app.get('/api/array-roles', (req, res) => {
    res.status(400).send(arrayRolesData)
})

app.get('/api/employees', (req, res) => {
  console.log(parsedEmployeeData)
  res.status(200).send(parsedEmployeeData)
})

// get all nested roles
app.get('/api/nested-roles', (req, res) => {
    res.status(400).send(parsedRolesData)
})

// get roles by id
app.get('/api/role/:id', (req, res) => {
    const roleId = req.params.id;
    
    const role = arrayRolesData.find(role => role.data.id === parseInt(roleId));
  
    if (role) {
      res.send(role);
    } else {
      res.status(404).send({ error: 'Role not found' });
    }
})


// add new role
app.post('/api/new-role', async (req, res) => {
  const newRole = req.body;
  // check if roleExist
  const role = arrayRolesData.find(_role => _role.data.id === newRole.data.id)
  
  if(!role){
    const {data, ...roleData} = newRole   
    const parentExist = arrayRolesData.find(_role => _role.data.id === data.parentId)
    if(!parentExist){
      res.status(404).send({message: 'Parent Role not found'})
      return
    } 
    parsedRolesData = addNodeToNestedStructure(parsedRolesData, newRole)
    arrayRolesData = convertNodeToArray(parsedRolesData)
    parsedAllData= {...parsedAllData, roles: parsedRolesData}

    await writeFile(filePath, JSON.stringify({ ...parsedAllData }), (err) => {
      if (err) {
        console.error('An error occurred while writing the file:', err);
      } else {
        console.log('Data has been written to the file successfully.');
      }
    });
    res.status(200).send(parsedAllData);

  }else{
    // throw new eror
    res.status(403).send({message: 'Role with the same id already exists'})
  }
  
  // overwrite the file wit the new data

});

// add new employee
app.post('/api/new-employee', (req, res) => {
    
  const newEmployee = req.body;
  const { id, roleId } = newEmployee
    // check if employee exits
  const employeeExist = parsedEmployeeData.find(emp => emp.id === id)
  if(employeeExist){
      res.status(409).send({message: 'Employee Already Exist'})
      return
    }else {
    // check if the role exist with the specified id
    const roleExist = arrayRolesData.find(r => r.data.id===roleId)

    if(roleExist){
      // adding the id to the role employee property role.employee.push(id)
      parsedRolesData = addEmployee(parsedRolesData, roleId, id);
      // adding new employee to the parsedEmployeeData Array 
      parsedEmployeeData = [...parsedEmployeeData, newEmployee]
      // updating the parsedAllData with newly formed data 
      parsedAllData = {roles: parsedRolesData, employees: parsedEmployeeData}
      // overwrite the file data.json
      writeFileSync(filePath, JSON.stringify(parsedAllData));
      // successfull response for the request if 
      res.status(200).send(parsedAllData);
    }else{
      // throw new error
      console.log('Role with id '+ roleId+'not found')
      res.status(400).send({message: `Role with id${roleId} not found!`})
    }
  }
  });
  
// update role
app.put('/api/update-role/:id', (req, res) => {
    const roleId = parseInt(req.params.id);

    let role = arrayRolesData.find(role => role.data.id === roleId);
    
    if(role) {
        const newRole = req.body
        // check if parent is changed
        if(newRole.data.parentId === role.data.parentId){
          console.log('there is no change in parent')
          parsedRolesData = replaceNodeById(parsedRolesData, role.data.id, newRole);
        }else{
          console.log('there is a change in role parent')
          parsedRolesData = popRole(parsedRolesData, role)
          parsedRolesData = addNodeToNestedStructure(parsedRolesData, newRole, newRole.data.parentId)
          parsedRolesData = replaceNodeById(parsedRolesData, newRole.id, newRole);
        }
        parsedAllData = {...parsedAllData, roles: parsedRolesData}
        arrayRolesData = convertNodeToArray(parsedRolesData);
        writeFileSync(filePath, JSON.stringify(parsedAllData))
        res.status(200).send(parsedRolesData);
    }else{
      // throw new error
        res.status(404).send({message: 'Role Not found'})
    }
  
})

// update Employee

app.put('/api/update-employee/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employeeDetail = req.body;
    const employee = parsedEmployeeData.find(emp => emp.id === employeeId);

    if(employee){
      // employee exists and ready for update
      // check if roleid is changed
      if(employee.roleId === employeeDetail.roleId){
        console.log('There is not change')
      }else{
        // check if the new role is legit
        const newRoleExist = arrayRolesData.find(role => role.data.id === employeeDetail.roleId)
        if(!newRoleExist ){
          // throw new Err
          res.status(404).send({message: `role with id ${employeeDetail.roleId} not found`})
        }else{
          console.log('CHANGE')
          // employee has changed their role
          // add employee id to the new role
          parsedRolesData = addEmployee(parsedRolesData, employeeDetail.roleId, employeeDetail.id)
          // delete employee id from old role
          parsedRolesData = deleteEmployee(parsedRolesData, employee.roleId, employeeDetail.id)
          arrayRolesData = convertNodeToArray(parsedRolesData);
          parsedAllData = {...parsedAllData, roles: parsedRolesData}
        }
      }
      parsedEmployeeData = updateEmployee(parsedEmployeeData, employeeId, employeeDetail)      
      parsedAllData = {...parsedAllData, employees: parsedEmployeeData}
      writeFileSync(filePath, JSON.stringify({...parsedAllData}))
      res.status(200).send(parsedAllData)
    }else{
      res.status(404).send({message: 'Employee Not found'})
    }
})

app.delete('/api/delete-role/:id', async (req, res) => {
  const roleId = parseInt(req.params.id);
  const roleExist = arrayRolesData.find((role) => role.data.id === roleId);
  
  if (roleExist) {
    // Check if it's a leaf node or not
    if (roleExist.children && !roleExist.children.length > 0) {
      parsedRolesData = deleteLeafRole(parsedRolesData, roleId);
      arrayRolesData = convertNodeToArray(parsedRolesData);

      // Delete all employees with that roleId
      parsedEmployeeData = parsedEmployeeData.filter(
        (employee) => employee.roleId !== roleId
      );

      // Modify the all data parsedAllData
      parsedAllData = { roles: parsedRolesData, employees: parsedEmployeeData };

      // Write the new data to the file asynchronously
      await writeFile(filePath, JSON.stringify({ ...parsedAllData }), (err) => {
        if (err) {
          console.error('An error occurred while writing the file:', err);
        } else {
          console.log('Data has been written to the file successfully.');
        }
      });

      res.status(200).send(parsedAllData);
    } else {
      res.status(403).send({ message: 'Cannot delete role that has children', role: roleExist });
    }
  } else {
    res.status(404).send({ message: 'Role not found' });
  }
});


app.delete('/api/delete-employee/:id', async (req, res) => {
  const employeeId = parseInt(req.params.id)
  const employee = parsedEmployeeData.find(emp=> emp.id===employeeId)

  if(employee){
    const role = arrayRolesData.find(role => role.data.id === employee.roleId)
    if(role){
      const newEmployees = role.data.employee.filter(id => id!==employeeId)
      const newRole = {...role, data: {...role.data, employee: [...newEmployees]}}
      parsedRolesData = replaceNodeById(parsedRolesData, role.data.id, newRole)
    }
    parsedEmployeeData = parsedEmployeeData.filter(empl => empl.id !== employeeId)
    parsedAllData = {roles: parsedRolesData, employees: parsedEmployeeData}
    await writeFile(filePath, JSON.stringify({...parsedAllData}), (err) => {
      if (err) console.log(err);
      else {
        console.log('data has been written to the file successfully')
        res.status(200).send(parsedAllData)
      }
    })

  }else{
    res.status(404).send({message: "Employee Not Found"})
  }

})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});