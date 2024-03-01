import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
const dbPath = process.env.PATH;
console.log(dbPath);

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  //Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch(`${dbPath}/tasks`, {mode:'cors'});
    const data = await res.json();

    return data;
  };

  //Delete task
  const deleteTask = async (id) => {
    await fetch(`${dbPath}/tasks/${id}`, { method: "DELETE" }, {mode:'cors'});
    setTasks(tasks.filter((task) => task.id !== id));
  };

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`${dbPath}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    }, {mode:'cors'});

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  //Add Task
  const addTask = async (task) => {
    const res = await fetch(`${dbPath}/tasks`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    }, {mode:'cors'});

    const data = await res.json();
    setTasks([...tasks, data]);
  };

  //Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`${dbPath}/tasks/${id}`, {mode:'cors'});
    const data = await res.json();

    return data;
  };
  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No Tasks to Show"
                )}
              </>
            }
          />
          <Route path="/about" Component={About} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
