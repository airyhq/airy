resource "kafka_topic" "%s" {
   name               = "%s"
   replication_factor = var.replicas
   partitions         = var.partitions

   config = {
%s
   }
 }