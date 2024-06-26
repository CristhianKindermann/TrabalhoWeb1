import { useState, useEffect } from "react";
import api from "./services/api";

import "./css/global.css";
import "./css/app.css";
import "./css/sidebar.css";
import "./css/main.css";


import EmployeeForm from "./components/EmployeeForm";
import EmployeeItem from "./components/EmployeeItem";

function App() {
  const [employeesList, setEmployeesList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");
        setEmployeesList(response.data);
      } catch (error) {
        console.log("Erro ao buscar funcionários", error);
      }
    };
    fetchEmployees();
  }, [employees]);

  async function handleAddEmployee(data) {
    if (editingEmployee) {
      const response = await api.put(`/employees/${editingEmployee.id}`, data);
      setEmployees(
        employees.map((employee) =>
          employee.id === editingEmployee.id ? response.data : employee
        )
      );
      setEditingEmployee(null);
    } else {
      const response = await api.post("/employees", data);
      setEmployees([...employees, response.data]);
    }
  }

  async function handleEditEmployee(employee) {
    setEditingEmployee(employee);
  }

  function handleDeleteEmployee(id) {
    setEmployeeToDelete(id);
  }

  async function confirmDeleteEmployee() {
    if (employeeToDelete) {
      await api.delete(`/employees/${employeeToDelete}`);
      setEmployees(employees.filter((employee) => employee.id !== employeeToDelete));
      setEmployeeToDelete(null);
    }
  }

  function cancelDeleteEmployee() {
    setEmployeeToDelete(null);
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastro de Funcionário</strong>
        <EmployeeForm onSubmit={handleAddEmployee} initialData={editingEmployee} />
      </aside>
      <main>
        <ul>
          {employeesList.map((employee) => (
            <EmployeeItem
              key={employee.id}
              employee={employee}
              Edit={handleEditEmployee}
              Delete={handleDeleteEmployee}
            />
          ))}
        </ul>
      </main>

      {employeeToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmação</h2>
            <p>Tem certeza que deseja deletar esse funcionário?</p>
            <div className="modal-buttons">
              <button id="cancel" onClick={cancelDeleteEmployee}>Cancelar</button>
              <button onClick={confirmDeleteEmployee}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
