const bound = (elementDescriptor) => {
  let { key, descriptor, } = elementDescriptor
  // assert(kind == 'method')
  let { value, } = descriptor
  function initializer () {
    return value.bind(this)
  }
  // Return both the original method and a bound function field that calls the method.
  // (That way the original method will still exist on the prototype, avoiding
  // confusing side-effects.)
  let boundFieldDescriptor = { ...descriptor, value: undefined, }
  return {
    ...elementDescriptor,
    extras: [{
      kind: 'field',
      key,
      placement: 'own',
      descriptor: boundFieldDescriptor,
      initializer,
    }, ],
  }
}

export default bound
