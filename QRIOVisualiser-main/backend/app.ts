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

app.get("/get-logs/:jobName", (req, res) => {
  const jobName = req.params.jobName;
  getNodeNameWithJob(req.params.jobName)
    .then(async (deviceName) => {
      console.log(deviceName);
      const getPodCommand = `kubectl get pods --selector=job-name=${jobName} -o=jsonpath='{.items[0].metadata.name}'`;
      var { stdout, stderr } = await promiseExec(getPodCommand);
      const getJobLogInfoCommand = `kubectl logs pod/${stdout}`;
      var { stderr, stdout } = await promiseExec(getJobLogInfoCommand);
      console.log(stderr);
      var response: JobLogResponse = { device: deviceName };
      if (stdout) {
        response = { ...response, log: stdout };
      }
      res.send(response);
    })
    .catch(() => {
      res.send({
        device: "",
        log: "",
      });
    });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
