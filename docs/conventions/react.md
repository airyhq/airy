# React

- [React at Airy](#react-at-airy)
  - [Folder structure](#folder-structure)
  - [File naming conventions](#file-naming-conventions)
  - [Redux store shape](#redux-store-shape)
    - [Data](#data)
    - [UI](#ui)
  - [Stylesheets](#stylesheets)

# React in the Airy Core Platform

## Folder structure

```
src
|- actions          = redux actions
|- reducers         = redux reducers
|- components       = reusable components we use in
|                     at least two pages
|- layout           = sidebar, footer, menus, etc...
|- services         = helper classes that won't fit anywhere else
|- pages            = every page has a subfolder in here
|  |- subpage_one   = if the page has sub components, they are
|  |  |- ...          inside of its folder.
|  |  \- index.js
|  \- subpage_two
|- index.html
\- app.js
```

## File naming conventions

We have the following file naming conventions (borrowed from the react community):

* lowercase folder names with `lisp-case` to separate words.
* camel cased file names starting with a lower case character for JS files that are not components
* camel cased file names starting with a capital letter for React Components

UI components have a small difference regarding their file name, they are named like this:

```
components/inputs/TextArea/index.jsx
components/inputs/TextArea/style.scss
components/inputs/TextArea/doc.md
```

This breaks the folder naming rule a bit, but we decided to do this to keep the code maintainable and `grep`able

## Redux store shape

We only have two root keys in our redux store: `data` and `ui`.

### Data

In here we store data that is shared between pages. We [normalize the shape
for
data](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape).
For shape normalization we use [this
library](https://github.com/paularmstrong/normalizr).

### UI

Every page has a key in here and stores it's data inside of it. This separates
the data and reduces conflicts when working on the store with a bigger team.

For UI elements that don't depend on the page the user is in, we have a
`global` key. For example for flash messages, modals and banners.

```json
{
  "ui": {
     "global": {
         "isModalOpen": true
      },
      "conversations": {
         "totalUnread": 42,
         "filters": {
            ...
         }
      },
     "settings": {
         "showPassword": false,
          ....
      },
  },
  "data": {
     "members": {
        "42": {
            "name": "Grace",
            "surname": "Hopper"
        }
     }
  }
}
```

## Stylesheets

We use css modules instead of styled components. With css vars we also get all
needed features and don't have an additional dependency. CSS files are easy to
understand and have a better tooling support. Inside of the module files we
use camel case to name the classes and rely on the fact that css modules
automatically namespace the classes by file.

The selectors inside of those `module.scss` files are camelCased and start with
a lowercase letter.

## Components

We use components stored in `ui/components`. Our apps aim to have as little
custom component code as possible. If something can be used more than once, we
will add it to the library.

The components in the library follow there rules:

- Implement only the common cases and be extendable for special ones. ***Example:*** no validtion for the content “DELETE” in an input field, those can be done with custom validators as parameters for the input component.
- Components should be independent on HTML sourrounding it. ***Example:*** Dropdowns should only need `<Dropdown values={values} onClick={onClick} />` and don't rely on the sturcture or style of the elements around it.
- They should not have default exports. We want to make it easy to refeactor code. If we don't export defaults, the code has to use the name we use to export the component. ***Example:*** `import {Button} from 'components/ui/button` makes sure that the `Button` has the same name everywhere.
 - Each component has a `.scss` file with it's required css. No component should share a style file with another component. If needed add a global scss in the assets directory for things that are needed a lot.
- You should never nest sass selectors deeper than one level (exception: pseudo selectors like :hover etc.)

