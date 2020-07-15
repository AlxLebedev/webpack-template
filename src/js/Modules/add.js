// let add = (a, b) => a + b;

// export default add;

export default class Add {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  init() {
    console.log(this.x);
    console.log(this.y);
    console.log(`${this.x} + ${this.y} = ${this.x + this.y}`);
  }
}
