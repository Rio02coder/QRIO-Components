package circuitnoise

type Cache interface {
	get(key string) (string, bool)
	set(key string, value string)
}


// func get(cache Cache, key string) (string, bool) {
// 	return cache.get(key)
// }

// func set(cache Cache, key string, value string) {
// 	cache.set(key, value)
// }