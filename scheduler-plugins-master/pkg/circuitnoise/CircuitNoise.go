package circuitnoise

import (
	"context"
	"fmt"

	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/klog/v2"
	"k8s.io/kubernetes/pkg/scheduler/framework"
)

const Name = "CircuitNoise"

var _ = framework.ScorePlugin(&CircuitNoise{})

type CircuitNoise struct {
	handle framework.Handle
}

// Name implements framework.ScorePlugin.
func (*CircuitNoise) Name() string {
	return Name
}

func New(obj runtime.Object, h framework.Handle) (framework.Plugin, error) {	
	klog.Infof("[CircuitNoise] initiated")

	return &CircuitNoise{
		handle:     h,
	}, nil
}

// Score implements framework.ScorePlugin.
func (c *CircuitNoise) Score(ctx context.Context, state *framework.CycleState, p *v1.Pod, nodeName string) (int64, *framework.Status) {
	klog.Infof("[CircuitNoise] entered scoring of node")
	noise, err := GetNodeNoise(nodeName, p.Name)
	if err != nil {
		klog.Infof("[CircuitNoise] Got error from get noise")
		return 0, framework.NewStatus(framework.Error, fmt.Sprintf("error getting node noise: %s", err))
	}

	klog.Infof("[CircuitNoise] Node '%s' noise '%s'", nodeName, noise)

	formattedNoise := noise * 100;

	klog.Infof("[CircuitNoise] Node '%s' formatted noise '%s'", nodeName, formattedNoise)

	if(formattedNoise == 0) {
		return int64(1), nil
	}

	return int64(formattedNoise), nil
}

// ScoreExtensions implements framework.ScorePlugin.
func (c *CircuitNoise) ScoreExtensions() framework.ScoreExtensions {
	return c
}

func (n *CircuitNoise) NormalizeScore(ctx context.Context, state *framework.CycleState, pod *v1.Pod, scores framework.NodeScoreList) *framework.Status {
	var higherScore int64
	for _, node := range scores {
		if higherScore < node.Score {
			higherScore = node.Score
		}
	}

	for i, node := range scores {
		scores[i].Score = framework.MaxNodeScore - (node.Score * framework.MaxNodeScore / higherScore)
	}

	klog.Infof("[CircuitNoise] Nodes final score: %v", scores)
	return nil
}
