package db

import (
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

//NOTE: we can change this later for an interface to accept multiples
//      providers

type DB struct {
	svc *dynamodb.DynamoDB
}

func MustNewDB() DB {
	//NOTE: The credentials are defined in the default ~/.aws folder
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	svc := dynamodb.New(sess)

	_, err := svc.DescribeTable(&dynamodb.DescribeTableInput{
		TableName: aws.String("ComponentsDetails"),
	})

	if err != nil {
		log.Fatal(err)
	}

	return DB{svc: svc}
}

func (db *DB) GetComponentsData() (map[string]map[string]interface{}, error) {
	result, err := db.svc.Scan(&dynamodb.ScanInput{TableName: aws.String("ComponentsDetails")})
	if err != nil {
		return nil, err
	}

	componentsDetails := make(map[string]map[string]interface{})
	for _, item := range result.Items {
		name, ok := item["name"]
		if !ok || name.S == nil {
			continue
		}

		c := make(map[string]interface{})
		for k, v := range item {
			//NOTE: For now we are assuming that all the values are strings
			if v.S != nil {
				c[k] = *v.S
			}
		}

		componentsDetails[*name.S] = c
	}

	return componentsDetails, nil
}
