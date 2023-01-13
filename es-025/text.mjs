// Implement a toString method on the Shout class that decorates the toString method for a Text class instance.
// It should use the toUpperCase() method to convert the Text instance string to uppercase.

class Text {
    constructor(text) {
      this.string = text;
    }
  
    toString() {
      return this.string;
    }
  }
  
  //Questo metodo di implementare il decorator design pattern è chiamato composition
  class Shout {
    constructor(text) {
      this.text = text;
    }
  
    toString() {
      return this.text.toString().toUpperCase();
    }
  }
  
  // Altro metodo di usare il decorator design pattern
  // Questo è chiamato augmentation o monkey patching
  // function shout(text) {
  //   const originalToString = text.toString;
  //   text.toString = () => originalToString.apply(text).toUpperCase();
  //   return text;
  // }
  
  console.log(new Text("Hello, I'm talking").toString());
  
  console.log(new Shout(new Text("Hello, I'm shouting!")).toString());
  
  console.log(shout(new Text("Hello, I'm shouting!")).toString());
  
  console.log(new Text("Hello, I'm talking").toString());
  