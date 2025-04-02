export const MixinClass = <T>(base: T, extendedClasses: any[]): T => {
  for (const extendedClass of extendedClasses) {
    const propNames = Object.getOwnPropertyNames(extendedClass.prototype);
    for (const propName of propNames) {
      if (propName != 'constructor') {
        Object.defineProperty(
          base['prototype'],
          propName,
          Object.getOwnPropertyDescriptor(extendedClass.prototype, propName) ||
            Object.create(null),
        );
      }
    }
  }

  return base;
};
