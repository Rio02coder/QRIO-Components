package circuitnoise

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"k8s.io/klog/v2"
)

// // Assigning map literal
// var nodeDNS = map[string]string{
//     "qiskube-m05": "10.110.217.147",
// }

// var nodeDevice = map[string]string{
//     "qiskube-m02":  "FakeKolkata",
//     "qiskube-m03": "FakeManhattan",
//     "qiskube-m04":  "FakeMontreal",
//     "qiskube-m06":  "FakeNairobi",
//     "qiskube-m07": "FakeMumbai",
// }

var serviceIp = "<META SERVER IP>"

// var serviceCache ServiceCache = ServiceCache{serviceMap: map[string]string{}}

/**
* Function responsible for getting the noise
* value of a node. This function uses a cache
* to manage the service to contact the node. It
* automatically retries and sets the correct values to 
* cache.
*/
func GetNodeNoise(nodeName string, podName string) (float64, error) {
    // Get the port number from the nodePort map
    // serviceUrl, ok := nodeDNS[nodeName]
    // if !ok {
    //     klog.Infof("[CircuitNoise] Error in getting node service")
    //     return 0, fmt.Errorf("nodeName %s not found in nodeDNS map", nodeName)
    // }

    // serviceIp := getServiceIP("qiskube-m05")

    // deviceName := nodeDevice[nodeName]

    klog.Infof("[CircuitNoise] podName %v", podName)

    lastIndexOfSep := strings.LastIndex(podName, "-")
    jobName := podName[:lastIndexOfSep]
    // Make a network call to retrieve JSON data
    url := getUrl(serviceIp, jobName, nodeName)
    response, err := makeNetworkCallFromUrl(url)

    if err != nil {
        return 0, fmt.Errorf("failed to make HTTP request: %v", err)
    }
    defer response.Body.Close()

    // Read the response body
    body, err := io.ReadAll(response.Body)
    if err != nil {
        klog.Infof("[CircuitNoise] Failed to read response body")
        return 0, fmt.Errorf("failed to read response body: %v", err)
    }

    // Define a struct to hold the JSON response
    var responseData struct {
        Score float64 `json:"score"`
    }

    // Unmarshal JSON data
    if err := json.Unmarshal(body, &responseData); err != nil {
        klog.Infof("[CircuitNoise] Failed to unmarshall json")
        return 0, fmt.Errorf("failed to unmarshal JSON: %v", err)
    }

    return responseData.Score, nil
}

/**
* Given a url it makes a network call
* returns the response and error
*/
func makeNetworkCallFromUrl(url string) (*http.Response, error) {
    response, err := http.Get(url)
    return response, err
}

// /**
// * This function assumes that the call from the value
// * stored in the service cache has failed. It will
// * retrieve the url from the kubernetes client
// * and make a network call.
// */
// func handleErrorFromNetworkRequest(nodeName string) (*http.Response, error) {
//     serviceName := getServiceNameFromNode(nodeName)
//     var serviceIP = getServiceClusterIP(serviceName)
//     if serviceIP == "" {
//         return nil, errors.New("service does not exist")
//     }

//     url := fmt.Sprintf("http://%s:8000/get-noise/", serviceIP)
//     response, err := makeNetworkCallFromUrl(url)

//     if err != nil {
//         return nil, errors.New("call can't be forwarded to service")
//     }

//     // Speculatively assume that the service cache does not have the new service IP
//     // So set the new ip
//     serviceCache.set(serviceName, serviceIP)
//     return response, err

// }

func getUrl(serviceIp string, podName string, deviceName string) string {
    return fmt.Sprintf("http://%s:8000/get-score/%s/%s/", serviceIp, podName, deviceName)
}

// func getServiceIP(nodeName string) string {
//     //var serviceName = getServiceNameFromNode(nodeName)
//     serviceIp, ok := nodeDNS[nodeName]
//     if !ok {
//         return ""
//     }
//     // var ip, ok = serviceCache.get(serviceName)
//     // if !ok {
//     //     // Service IP not found.
//     //     // Need to retrieve from kubernetes client
//     //     var serviceIP = getServiceClusterIP(serviceName)
//     //     // Store service IP in service cache
//     //     serviceCache.set(serviceName, serviceIP)
//     //     return serviceIP
//     // }

//     return serviceIp
// }

// func getServiceNameFromNode(nodeName string) string {
//     return "node-"+nodeName[len(nodeName) - 3:]+"-service"
// }