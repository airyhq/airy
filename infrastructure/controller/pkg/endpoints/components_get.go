package endpoints

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"

	"github.com/airyhq/airy/lib/go/k8s"
	"k8s.io/client-go/kubernetes"
)

type ClusterGet struct {
	clientSet *kubernetes.Clientset
	namespace string
}

func (s *ClusterGet) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	components, err := k8s.GetComponentsConfigMaps(r.Context(), s.namespace, s.clientSet, maskSecrets)
	if err != nil {
		log.Printf(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	blob, err := json.Marshal(map[string]interface{}{"components": components})
	if err != nil {
		log.Printf("Unable to marshal config Error: %s\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(blob)
}

var secretMatcher = regexp.MustCompile(`(?i)secret|key|token`)

func maskSecrets(data map[string]string) map[string]string {
	mask := func(s string) string {
		if len(s) < 2 {
			return "..."
		}

		if len(s) > 8 {
			return s[:4] + "..."
		}

		return s[:1] + "..."
	}
	out := make(map[string]string, len(data))

	for k, v := range data {
		if k == "saFile" {
			out[k] = "<service account keys>"
		} else if secretMatcher.MatchString(k) {
			out[k] = mask(v)
		} else {
			out[k] = v
		}
	}

	return out
}
