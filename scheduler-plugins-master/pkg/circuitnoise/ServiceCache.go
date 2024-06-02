package circuitnoise

type ServiceCache struct {
	serviceMap map[string]string
}

func (serviceCache ServiceCache) get(key string) (string, bool) {
	var result, ok = serviceCache.serviceMap[key]
	return result, ok
}

func (serviceCache ServiceCache) set(key string, value string) {
	serviceCache.serviceMap[key] = value
}