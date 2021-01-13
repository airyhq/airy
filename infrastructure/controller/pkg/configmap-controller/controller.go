package configmapController

import (
	"fmt"
	"time"

	v1 "k8s.io/api/core/v1"

	"k8s.io/apimachinery/pkg/fields"
	"k8s.io/apimachinery/pkg/util/runtime"
	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/klog"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/cache"
	"k8s.io/client-go/util/workqueue"
)

type Controller struct {
	indexer   cache.Indexer
	queue     workqueue.RateLimitingInterface
	informer  cache.Controller
	clientSet kubernetes.Interface
}

type ResourceHandler interface {
	Handle(clientSet kubernetes.Interface) error
}

func NewController(queue workqueue.RateLimitingInterface, indexer cache.Indexer, informer cache.Controller, clientset kubernetes.Interface) *Controller {
	return &Controller{
		informer:  informer,
		indexer:   indexer,
		queue:     queue,
		clientSet: clientset,
	}
}

func (c *Controller) processNextItem() bool {
	// Wait until there is a new item in the working queue
	handler, quit := c.queue.Get()
	if quit {
		return false
	}
	defer c.queue.Done(handler)
	// Invoke the method containing the business logic
	err := handler.(ResourceHandler).Handle(c.clientSet)
	// Handle the error if something went wrong during the execution of the business logic
	c.handleErr(err, handler)
	return true
}

// handleErr checks if an error happened and makes sure we will retry later.
func (c *Controller) handleErr(err error, key interface{}) {
	if err == nil {
		c.queue.Forget(key)
		return
	}

	// This controller retries 5 times if something goes wrong. After that, it stops trying.
	if c.queue.NumRequeues(key) < 5 {
		klog.Infof("Error syncing %v: %v", key, err)
		c.queue.AddRateLimited(key)
		return
	}

	c.queue.Forget(key)
	// Report to an external entity that, even after several retries, we could not successfully process this key
	runtime.HandleError(err)
	klog.Infof("Dropping pod %q out of the queue: %v", key, err)
}

func (c *Controller) Run(threadiness int, stopCh chan struct{}) {
	defer runtime.HandleCrash()

	// Let the workers stop when we are done
	defer c.queue.ShutDown()
	klog.Info("Starting controller")

	go c.informer.Run(stopCh)

	// Wait for all involved caches to be synced, before processing items from the queue is started
	if !cache.WaitForCacheSync(stopCh, c.informer.HasSynced) {
		runtime.HandleError(fmt.Errorf("Timed out waiting for caches to sync"))
		return
	}

	for i := 0; i < threadiness; i++ {
		go wait.Until(c.runWorker, time.Second, stopCh)
	}

	<-stopCh
	klog.Info("Stopping controller")
}

func (c *Controller) runWorker() {
	for c.processNextItem() {
	}
}

// ConfigMapController for monitoring the configmaps
func ConfigMapController(clientset kubernetes.Interface) *Controller {

	configMapListWatcher := cache.NewListWatchFromClient(clientset.CoreV1().RESTClient(), "configmaps", v1.NamespaceDefault, fields.Everything())
	queue := workqueue.NewRateLimitingQueue(workqueue.DefaultControllerRateLimiter())
	indexer, informer := cache.NewIndexerInformer(configMapListWatcher, &v1.ConfigMap{}, 0, cache.ResourceEventHandlerFuncs{
		AddFunc: func(obj interface{}) {
			queue.Add(&ResourceCreatedHandler{
				ConfigMap: obj.(*v1.ConfigMap),
			})
		},
		UpdateFunc: func(old interface{}, new interface{}) {
			queue.Add(&ResourceUpdatedHandler{
				ConfigMap: new.(*v1.ConfigMap),
				OldConfigMap: old.(*v1.ConfigMap),
			})
		},
		DeleteFunc: func(obj interface{}) {
			queue.Add(&ResourceDeleteHandler{
				ConfigMap: obj.(*v1.ConfigMap),
			})
			// Currently we do nothing when a new configMap is deleted
			klog.Infof("Deleted configMap %s", obj.(*v1.ConfigMap).GetName())
		},
	}, cache.Indexers{})
	return NewController(queue, indexer, informer, clientset)
}
