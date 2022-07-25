package db

import (
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

//NOTE: we can change this later for an interface to accept multiples
//      providers

type DB struct {
	svc *dynamodb.DynamoDB
}

func MustNewDB() DB {
	accessKey, keyOk := os.LookupEnv("DYNAMODB_ACCESS_KEY_ID")
	secretKey, secretOk := os.LookupEnv("DYNAMODB_SECRET_ACCESS_KEY")
	if !keyOk || !secretOk {
		log.Fatal("dynamodb credentials not found")
	}

	sess := session.Must(session.NewSession(
		aws.NewConfig().WithCredentials(
			credentials.NewStaticCredentials(
				accessKey,
				secretKey,
				"",
			),
		).WithRegion("us-east-1"),
	))
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

		c["installed"] = false
		componentsDetails[*name.S] = c
	}

	return componentsDetails, nil
}
