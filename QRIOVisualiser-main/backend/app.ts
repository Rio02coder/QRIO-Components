import getNodeInfo from "./utils/getNodeInfo.js";
import getNodeNameWithJob from "./utils/getNodeNameWithJob.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { exec } from "child_process";
import util from "node:util";
import express, { Request } from "express";
import fs from "fs";
import multer from "multer";
import formidable from "formidable";
import path from "path";
import { SubmitJobRequestProcessor } from "./utils/Processor/Request/SubmitJob.js";
import { JobLogResponse } from "./types/JobLogResponse.js";

const promiseExec = util.promisify(exec);
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

// const jobNamespace = io.of("/get-job-info");
// const clusterNamespace = io.of("/get-cluster-info");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirName = file.originalname.substring(
      0,
      file.originalname.indexOf(".")
    );
    fs.mkdirSync(dirName);
    cb(null, `${dirName}/`); // specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // specify the file name
  },
});

const fileFilter = (
  req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extName = path.extname(file.originalname).toLowerCase();

  if (extName === ".py" || extName === ".qasm") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only python and qasm files are allowed"));
  }
};

const upload = multer({ storage: storage });

app.post("/submit-job", upload.single("circuitFile"), (req, res) => {
  const submitJobReqProcessor: SubmitJobRequestProcessor =
    new SubmitJobRequestProcessor();

  console.log("B", req.body);
  const fileName = req.file?.originalname as string;
  submitJobReqProcessor
    .processRequest(req.body, fileName.substring(0, fileName.indexOf(".")))
    .then(() => {
      res.send({
        message: "success",
      });
    });
});

app.get("/get-logs", (req, res) => {
  const reqBody = req.body;
  const jobName = reqBody.jobName;
  getNodeNameWithJob(jobName)
    .then(async (deviceName) => {
      const getPodCommand = `kubectl get pods --selector=job-name=${jobName} -o=jsonpath='{.items[0].metadata.name}'`;
      const podName = await promiseExec(getPodCommand);
      const getJobLogInfoCommand = `kubectl logs pod/${podName.stdout} --follow`;
      const { stderr, stdout } = await promiseExec(getJobLogInfoCommand);
      var response: JobLogResponse = { device: deviceName };
      if (!stderr && !stdout && stdout !== "") {
        response = { ...response, log: stdout };
      }
      res.send(response);
    })
    .catch(() => {
      res.send({
        message: "No logs",
      });
    });
});

// app.get("/get-job-info", (req: Request, res) => {
//   res.send(
//     "WebSocket connection is required for pod info. Use a WebSocket client to connect."
//   );
// });

// app.get("/get-cluster-info", async (req, res) => {
//   var jobName = req.params.jobName;
//   const getJobLogInfoCommand = `kubectl logs job/${jobName}`;
//   const { stdout } = await promiseExec(getJobLogInfoCommand);
//   res.send(stdout);
// });

// app.post("/upload-qasm", upload.single("file"), (req, res) => {
//   res.send("File uploaded!");
// });

// app.post("/create-job", (req, res) => {
//   const form = formidable({ multiples: true });
//   form.parse(req, async (err, fields) => {
//     const jobCreator = new JobCreator();
//     console.log("Here");
//     // console.log(fields.dirName);
//     // console.log(fields.imageName);
//     // console.log(fields.jobFileName);
//     // console.log(fields.fileName);
//     // console.log(fields.pythonFileName);
//     // console.log(fields.qubits);
//     // console.log(fields.jobName);
//     await jobCreator.createJob(
//       fields.dirName,
//       fields.imageName,
//       fields.jobFileName,
//       fields.fileName,
//       fields.pythonFileName,
//       fields.qubits,
//       fields.jobName
//     );
//     res.send({ success: true });
//   });
// });

// jobNamespace.on("connection", async (socket) => {
//   console.log("A client connected to node info namespace");
//   socket.on("sendJob", async (jobName) => {
//     const describePodInterval = setInterval(async () => {
//       const nodeName = await getNodeNameWithJob(jobName);
//       console.log("Node name", nodeName);
//       const nodeInfoObj = getNodeInfo(nodeName);
//       const textNodeInfo = await nodeInfoObj.getInfo();
//       jobNamespace.emit("nodeInfo", {
//         data: textNodeInfo,
//         timestamp: Date.now(),
//       });
//     }, 5000);
//     socket.on("disconnect", () => {
//       console.log("A client disconnected from node info namespace");
//       clearInterval(describePodInterval);
//     });
//   });
// });

// clusterNamespace.on("connection", (socket) => {
//   console.log("A client connected to job log info namespace");

//   socket.on("sendJob", async (jobName) => {
//     const getPodCommand = `kubectl get pods --selector=job-name=${jobName} -o=jsonpath='{.items[0].metadata.name}'`;
//     const { stdout } = await promiseExec(getPodCommand);
//     console.log(stdout);
//     const podName = stdout;
//     const getJobLogInfoCommand = `kubectl logs pod/${podName} --follow`;
//     const describePodInterval = setInterval(async () => {
//       console.log("Here");
//       const { stdout } = await promiseExec(getJobLogInfoCommand);
//       console.log(stdout);
//       clusterNamespace.emit("clusterInfo", {
//         data: stdout,
//         timestamp: Date.now(),
//       });
//     }, 10000);
//     socket.on("disconnect", () => {
//       console.log("A client disconnected from node info namespace");
//       clearInterval(describePodInterval);
//     });
//   });
// });

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
