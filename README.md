# use-merge
Simplify the relationships between multiple hooks.

### 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add use-merge
```

### 😲 Everything and your mother is a hook now.
Functional components are becoming increasingly complex; the wide availability of capable hooks and their applicability to the management of application state logic has made it commonplace to embed multiple hooks in a single component. Depending on the availability of asynchronous data, hooks can easily become desynchronized with one-another and necessitate multiple render lifecycles in order to harmonize.

What's worse, is that hooks dependent on the output of previously declared hooks require non-trivial and repetitive manual management of loading and error states to manage the render result.

**Take the following:**

```javascript
import { ActivityIndicator } from "react-native";
import { useQuery, gql } from "@apollo/graphql";

import { DataComponent, ErrorComponent } from ".";

export default function SomeComponent() {
  const { loading: loadingA, error: errorA, data: dataA } = useQuery(gql`...`);
  const { loading: loadingB, error: errorB, data: dataB } = useQuery(gql`...`);
  const { loading: loadingC, error: errorC, data: dataC } = useQuery(gql`...`);
  
  const loading = loadingA || loadingB || loadingC;
  const error = errorA || errorB || errorC; // Not to mention, this swallows errors...
  
  if (loading) {
    return <ActivityIndicator />;
  } else if (error) {
    return <ErrorComponent />;
  }
  return <DataComponent a={dataA} b={dataB} c={dataC} />;
}
```

> We've all seen it. And it's becoming increasingly more common as hooks get ever more awesome.

### 🤔 So... what's the answer to the problem of multiple hooks? Why, a hook of course!

With `use-merge`, you can combine the outputs of multiple hooks _and_ synchronize their requests to re-render:

```javascript
import { ActivityIndicator } from "react-native";
import { useQuery, gql } from "@apollo/graphql";
import useMerge, { By } from "use-merge";

import { DataComponent, ErrorComponent } from ".";

export default function SomeComponent() {
  const { a, b, c, merged: { loading, error } } = useMerge({
    a: useQuery(gql`...`),
    b: useQuery(gql`...`),
    c: useQuery(gql`...`),
  })({ loading: By.Truthy, error: By.Error });
  
  if (loading) {
    return <ActivityIndicator />;
  } else if (error) {
    return <ErrorComponent />;
  }
  return <DataComponent a={a.data} b={b.data} c={c.data} />;
}
```

This makes it much simpler, consistent and more efficient to handle the processing of multiple hooks within the scope of a single function.

## ✌️ License
[**MIT**](./LICENSE)
