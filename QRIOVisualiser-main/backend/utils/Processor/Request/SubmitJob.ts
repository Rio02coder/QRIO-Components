import { jobCreator } from "../../../JobCreator";
import { SubmitJobRequest } from "../../../types/SubmitJob";
import { FLOATFIELDVALUES } from "../../Consts/FieldValues";
import { unitConverter } from "../../UnitConverter/UnitConverter";
import { STANDARD_UNIT, UNIT_NAMES } from "../../Units/UnitMap";

export class SubmitJobRequestProcessor {
  private unitFields = ["T1", "T2"];
  private floatFieldProcessor = new Map([
    [
      "T1",
      (val: number) => {
        return val * 1000000;
      },
    ],
    [
      "T2",
      (val: number) => {
        return val * 1000000;
      },
    ],
    [
      "readout",
      (val: number) => {
        return 100000 - val * 10000;
      },
    ],
    [
      "errorRate",
      (val: number) => {
        return 100000 - val * 10000;
      },
    ],
  ]);
  private floatToIntConvFields = ["T1", "T2", "errorRate", "readout"];
  private floatFieldRanges: Map<string, number[]> = new Map<string, number[]>([
    ["T1", [FLOATFIELDVALUES.T1_MIN, FLOATFIELDVALUES.T1_MAX]],
    ["T2", [FLOATFIELDVALUES.T2_MIN, FLOATFIELDVALUES.T2_MAX]],
    [
      "errorRate",
      [FLOATFIELDVALUES.ERROR_RATE_MIN, FLOATFIELDVALUES.ERROR_RATE_MAX],
    ],
    ["readout", [FLOATFIELDVALUES.READOUT_MIN, FLOATFIELDVALUES.READOUT_MAX]],
  ]);

  private convertUnits(body: SubmitJobRequest) {
    // Convert the units of the unit fields to the standard unit
    this.unitFields.forEach((field) => {
      // @ts-ignore
      body[field as keyof SubmitJobRequest] = unitConverter(
        body[field as keyof SubmitJobRequest] as number,
        body[`${field}Unit` as keyof SubmitJobRequest] as UNIT_NAMES,
        STANDARD_UNIT
      );
    });
  }

  // createJobSpace(jobFile: File, jobName: string) {
  //   // Create a folder with the job name and put the job file on there
  // }

  // startJob() {
  //   // Use JobCreator class to submit request to Kubernetes with the job details.
  // }

  private validateFloatToIntFields(body: SubmitJobRequest) {
    this.floatToIntConvFields.forEach((field) => {
      const val = body[field as keyof SubmitJobRequest] as number;
      const range = this.floatFieldRanges.get(field) as number[];
      const min = range[0];
      const max = range[1];
      if (val < min || val > max) {
        throw Error(`Bad values for ${field}`);
      }
    });
  }

  private processFloatFields(body: SubmitJobRequest) {
    this.floatToIntConvFields.forEach((field) => {
      const val = body[field as keyof SubmitJobRequest] as number;
      const converter = this.floatFieldProcessor.get(field) as (
        val: number
      ) => number;
      // @ts-ignore
      body[field as keyof SubmitJobRequest] = converter(val);
    });
  }

  // private contactMetadataServer(body: SubmitJobRequest) {
  //   //
  //   let metaRequestor: MetaServerRequestor;
  //   if (body.fidelity) {
  //     metaRequestor = new MetaServerFidelityRequestor({
  //       circuitFile: body.circuitFile,
  //       fidelity: body.fidelity,
  //     });
  //     metaRequestor
  //       .executeRequest()
  //       .then(() => {
  //         console.log("Meta server got request");
  //       })
  //       .catch(() => {
  //         console.log("Meta server request failed");
  //       });
  //   } else {
  //     // metaRequestor = new MetaServerTopologyRequestor({
  //     //   topologyFile: body.topologyFile as File,
  //     // });
  //   }
  // }

  private getPythonFileName(fileName: string) {
    return fileName + "-py";
  }

  private getJobFileName(fileName: string) {
    return fileName + "-job";
  }

  private getDirectoryName(fileName: string) {
    return fileName;
  }

  processRequest(request: Request, fileName: string) {
    const body = request as unknown as SubmitJobRequest;
    this.convertUnits(body);
    this.validateFloatToIntFields(body);
    this.processFloatFields(body);
    // Process Request
    const imageName = body.imageName;
    const qubits = body.qubits.toString();
    const T1 = body.T1.toString();
    const T2 = body.T2.toString();
    const readoutRate = body.readout.toString();
    const errorRate = body.errorRate.toString();
    const jobName = body.jobName;
    return jobCreator.createJob(
      this.getDirectoryName(fileName),
      imageName,
      this.getJobFileName(fileName),
      fileName,
      this.getPythonFileName(fileName),
      qubits,
      T1,
      T2,
      errorRate,
      readoutRate,
      jobName
    );
  }
}
