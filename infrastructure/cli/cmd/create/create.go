package create

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	provider  string
	CreateCmd = &cobra.Command{
		Use:   "create",
		Short: "Creates an instance of the airy core",
		Long:  ``,
		Run:   create,
	}
)

func init() {
	CreateCmd.PersistentFlags().StringVarP(&provider, "provider", "", "", "provider")
	viper.BindPFlag("provider", CreateCmd.PersistentFlags().Lookup("provider"))
}

func create(cmd *cobra.Command, args []string) {
	fmt.Println("⚙️  Creating core with provider", provider)
	fmt.Println("🚀 Starting core with default config")
	fmt.Println("🎉 Your Airy Core is ready")
	fmt.Println("\t Link to the API")
	fmt.Println("\t Link to the UI")
	fmt.Println("\t Link to more docs")
}
