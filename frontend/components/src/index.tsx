
//@ts-nocheck
import * as React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import TopBar from './components/general/TopBar'
import {store} from './store';


export * from './components/alerts'
export * from './components/cta'
export * from './components/general'


// export const ExampleComponent = () => {
//   return (
//     <Provider store={store}>
//         <BrowserRouter>
//             <TopBar isAdmin={true} />
//         </BrowserRouter>
//     </Provider>
//   )
// }