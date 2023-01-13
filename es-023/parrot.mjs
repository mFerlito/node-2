class Parrot {
    constructor(value) {
      this.text = value;
    }
  
    output(value) {
      this.text = value;
      console.log(value);
    }
  }
  
  export const parrot = new Parrot("Initial value");
  
  // Altro modo di creare il singleton
  // export const parrot = {
  //   text: "Initial value";
  //   output(value) {
  //    this.text = value;
  //    console.log(value);
  //   }
  // }