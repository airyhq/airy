package util

import (
	"bytes"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"io"
	"reflect"
	"sort"
	"strings"

	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	v1 "k8s.io/api/core/v1"
	"k8s.io/klog"
)

//Config contains rolling upgrade configuration parameters
type Config struct {
	Namespace           string
	ResourceName        string
	ResourceAnnotations map[string]string
	Annotation          string
	SHAValue            string
	Type                string
}

// GenerateSHA from text
func GenerateSHA(data string) string {
	hasher := sha1.New()
	_, err := io.WriteString(hasher, data)
	if err != nil {
		klog.Errorf("Unable to write data in hash writer %v", err)
	}
	sha := hasher.Sum(nil)
	return fmt.Sprintf("%x", sha)
}

// GetSHAfromConfigmap generate SHA for a configmap
func GetSHAfromConfigmap(configmap *v1.ConfigMap) string {
	values := []string{}
	for k, v := range configmap.Data {
		values = append(values, k+"="+v)
	}
	for k, v := range configmap.BinaryData {
		values = append(values, k+"="+base64.StdEncoding.EncodeToString(v))
	}
	sort.Strings(values)
	return GenerateSHA(strings.Join(values, ";"))
}

// InterfaceSlice converts an interface to an interface array
func InterfaceSlice(slice interface{}) []interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() != reflect.Slice {
		klog.Errorf("InterfaceSlice() given a non-slice type")
	}

	ret := make([]interface{}, s.Len())

	for i := 0; i < s.Len(); i++ {
		ret[i] = s.Index(i).Interface()
	}

	return ret
}

// Int32Ptr
func Int32Ptr(i int32) *int32 { return &i }

// ConvertToEnvVarName converts the given text into a usable env var
// removing any special chars with '_' and transforming text to upper case
func ConvertToEnvVarName(text string) string {
	var buffer bytes.Buffer
	upper := strings.ToUpper(text)
	lastCharValid := false
	for i := 0; i < len(upper); i++ {
		ch := upper[i]
		if (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') {
			buffer.WriteString(string(ch))
			lastCharValid = true
		} else {
			if lastCharValid {
				buffer.WriteString("_")
			}
			lastCharValid = false
		}
	}
	return buffer.String()
}

type ObjectMeta struct {
	meta_v1.ObjectMeta
}

func ToObjectMeta(kubernetesObject interface{}) ObjectMeta {
	objectValue := reflect.ValueOf(kubernetesObject)
	fieldName := reflect.TypeOf((*meta_v1.ObjectMeta)(nil)).Elem().Name()
	field := objectValue.FieldByName(fieldName).Interface().(meta_v1.ObjectMeta)

	return ObjectMeta{
		ObjectMeta: field,
	}
}
