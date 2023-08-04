export const convertNodeToArray = (node) => {
    const result = [];
  
    function traverse(node) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child);
        });
      }
    }
  
    traverse(node);
  
    return result;
}


export const addNodeToNestedStructure = (nestedStructure, newNode, parentId) => {
    // console.log('newNode',newNode)
    // console.log(typeof nestedStructure.id, 'type')
    if (nestedStructure.id === parentId) {
        nestedStructure.children.push(newNode);
    } else if (nestedStructure.children) {
        nestedStructure.children.forEach(child => {
            addNodeToNestedStructure(child, newNode, parentId);
        });
    }
    return nestedStructure;
}

// adding the id of new employee to the prerty employee []
export const addEmployee = (nestedStructure, roleId, newId) => {
    if (nestedStructure.id === roleId) {
      nestedStructure.data.employee.push(newId);
    } else if (nestedStructure.children) {
      nestedStructure.children.forEach(child => {
        addEmployee(child, roleId, newId);
      });
    }
    return nestedStructure;
  };

export const deleteEmployee = (nestedStructure, roleId, empId) => {
  if (nestedStructure.id === roleId){
    const updatedEmployeeArray = nestedStructure.data.employee.filter(id => id !== empId)
    nestedStructure.data.employee = updatedEmployeeArray
  }else if (nestedStructure.children){
    nestedStructure.children.forEach(child => {
      deleteEmployee(child, roleId, empId)
    })
  }
  return nestedStructure
}

export const deleteLeafRole = (nestedStructure, nodeId) => {
  if (nestedStructure.children) {
    nestedStructure.children = nestedStructure.children.filter(child => {
      return deleteLeafRole(child, nodeId) !== null;
    });
  }

  if (nestedStructure.children.length === 0 && nestedStructure.id === nodeId) {
    return null; // Remove the leaf node by returning null
  }

  return nestedStructure;
};


export const replaceNodeById = (nestedStructure, nodeId, updatedProperties) => {
    if (nestedStructure.id === nodeId) {
      return {...nestedStructure, data: {...updatedProperties.data}}
    } else if (nestedStructure.children) {
      const updatedChildren = nestedStructure.children.map(child =>
        replaceNodeById(child, nodeId, updatedProperties)
      );
      return { ...nestedStructure, children: updatedChildren };
    }
    return nestedStructure;
};
  

export const updateEmployee = (employeeArray, employeeId, employeeDetails) => {
  employeeArray = employeeArray.map(employee => {
    if(employee.id === employeeId){
      return {...employee, ...employeeDetails}
    }else{
      return employee
    }
  })
  console.info(employeeArray)
  return employeeArray
}

export const popRole = (nestedStructure, node) => {
  if (nestedStructure.id === node.data.parentId) {
    const newChildren = nestedStructure.children.filter(r => r.id !== node.id);
    nestedStructure = { ...nestedStructure, children: [...newChildren] };
  } else if (nestedStructure.children && nestedStructure.children.length > 0) {
    nestedStructure.children.forEach((child, index) => {
      nestedStructure.children[index] = popRole(child, node);
    });
  }
  return nestedStructure;
};

export const deleteRole = (nestedStructure, node) => {
  // implement here
  
  return nestedStructure;
};
