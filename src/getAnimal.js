export const getAnimal = () => {
  const animal = ['🦁','🐸','🐙','🐔','🐧','🐤','🐣','🦆','🦋','🦄']
  return animal[parseInt(Math.random() * 10)]
}