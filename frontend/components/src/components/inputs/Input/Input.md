Our input component

Without validation:

```jsx
<Input label="First name" placeholder="First name" hint="Homer, is this you?"/>
```

Using a custom validation function that always red when shorter than 6 characters:

```jsx
validation = (value) => {
  if (!value) {
    return undefined;
  } else if (value.length < 6) {
    return "Needs to be longer than 5 characters";
  } 
  return true;
}

<Input label="First name" placeholder="First name" hint="Homer, is this you?" validation={validation}/>
```

Validating email using the browser input type "email":
```jsx
<Input label="Email" placeholder="Email" hint="We never spam" type="email"/>
```

You can also replace the label by something more complex:

```jsx

validation = (value) => {
  if (!value) {
    return undefined;
  } else if (value.length < 6) {
    return "Needs to be longer than 5 characters";
  } 
  return true;
}

<Input label="First name" placeholder="First name" hint="Homer, is this you?" validation={validation}>
  {icon => (
    <div>
     <span>Label</span> <strong>with</strong> <span>Elements</span> {icon}
    </div>
  )}
</Input>
```

It also shows the maximum number of characters left:

```jsx
<Input label="First name" placeholder="First name" hint="Homer, is this you?" maxlength={20}/>
```

Additionally you could also display an emoji selector if needed:

```jsx
<Input label="First name" placeholder="First name" hint="Homer, is this you?" emoji={true} />
```
