
#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

sudo yum install jq -y

header='Content-Type: application/json'
ingress_port=`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}'`
if [ $(curl -X POST -H $header -d '{"password": "password","email": "testing@example.com"}' "192.168.50.5:$ingress_port/users.login" -o login.txt -w '%{http_code}\n' -s) == "200" ]; then
    echo "Logged in"
else
    if [ $(curl -X POST -H 'Content-Type: application/json' -d '{"first_name": "test","last_name": "user","password": "password","email": "testing@example.com"}' "localhost:$ingress_port/users.signup" -o login.txt -w '%{http_code}\n' -s) != "200" ]; then
        echo "Could not login" 
        exit 1
    fi
fi

token=($(jq -r ".token" login.txt))


declare -A endpoints 
declare -A bodies

endpoints['conversations.list']='{}'
bodies['conversations.list']='{"data":[],"response_metadata":{"previous_cursor":null,"next_cursor":null,"filtered_total":0,"total":0}}'

# endpoints["conversations.info"]='{}'
# bodies["conversations.info"]='{"data":[],"response_metadata":{"previous_cursor":null,"next_cursor":null,"filtered_total":0,"total":0}}'




for i in "${!endpoints[@]}"
do
  response=$(curl -X POST -H $header -H "Authorization: $token" -d ${endpoints[$i]} "localhost:$ingress_port/$i")
  if [ $response == ${bodies[$i]} ]
  then
    echo "Endpoint $i is fine"
  else 
    echo "not fine"
    echo $response
  fi

done
