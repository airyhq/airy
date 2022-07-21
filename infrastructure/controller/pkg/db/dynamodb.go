package db

import "github.com/aws/aws-sdk-go-v2/aws"

//NOTE: we can change this later for an interface to accept multiples
//      providers

type DB struct {
}

func MustNewDB() DB {
	config := &aws.Config{
		Region:   aws.String("us-east-1"),
		Endpoint: aws.String("http://localhost:8080"),
	}
}
