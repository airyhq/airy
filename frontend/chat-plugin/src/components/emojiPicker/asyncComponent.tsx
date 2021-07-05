import React, {Component} from 'react';

const asyncComponent = (importComponent: any) => {
    console.log('importComponent', importComponent)
    return class extends Component {
        state = {
            component: null
        }

        componentDidMount() {
            importComponent()
                .then(cmp => {
                    console.log('cmp', cmp)
                    this.setState({component: cmp.EmojiPickerComponent});
                });
        }

        render() {
            const C = this.state.component;

            console.log('C', C)

            if(C){
                return <C {...this.props} />
            } else {
                return null
            }
        }
    }
};

export default asyncComponent;