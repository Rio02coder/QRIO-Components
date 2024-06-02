import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./pages/FileUpload";
import CreateJobForm from "./components/CreateJobForm";
import JobInfo from "./pages/JobInfo";
import Cluster from "./pages/Cluster";
import { JobContext } from "./types/JobContext";
import Form from "./pages/Form";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const jobContext = useContext(JobContext);
  useEffect(() => {
    jobContext ? setLoading(false) : setLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Router>
      <Navbar />
      {!loading ? (
        <div className="App">
          <Routes>
            <Route path="/create-job" element={<CreateJobForm />} />
            <Route path="/" element={<FileUpload />} />
            <Route path="/form" element={<Form />} />
            <Route path="/cluster-info" element={<Cluster />} />
            <Route path="/job-info" element={<JobInfo />} />
          </Routes>
        </div>
      ) : (
        <></>
      )}
    </Router>
  );
}

export default App;
