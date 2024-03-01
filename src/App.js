import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
const defaultTasks = [
  {
    id: "1",
    text: "Doctors Appointment",
    day: "Feb 5th at 2:30",
    reminder: true,
  },
  {
    id: "2",
    text: "Meeting at School",
    day: "Feb 6th at 1:30",
    reminder: true,
  },
  {
    id: "1d1e",
    text: "Take Medicine",
    day: "Feb 20th 4:46",
    reminder: true,
  },
];

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const tempData = localStorage.getItem("tasks");
  let defTasks = JSON.parse(tempData) || defaultTasks;
  const [tasks, setTasks] = useState(defTasks);

  useEffect(() => {
    const localData = localStorage.getItem("tasks");
    // console.log(localData);
    if (!localData) {
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }
  }, []);

  //Delete task
  const deleteTask = async (id) => {
    const localData = JSON.parse(localStorage.getItem("tasks"));
    const updatedTasks = localData.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    // const index = localData.indexOf()
    setTasks(updatedTasks);
  };

  //Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = localStorage.setItem(
      "tasks",
      JSON.stringify(tasks.push(updatedTask))
    );
    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  //Add Task
  const addTask = async (task) => {
    task.id = 5;
    const data = localStorage.getItem("tasks");
    const parsedData = JSON.parse(data);
    localStorage.setItem("tasks", JSON.stringify([...parsedData, task]));
    setTasks([...parsedData, task]);
  };

  //Fetch Task
  const fetchTask = async (id) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const res = tasks.find((taskId) => taskId === id);
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
