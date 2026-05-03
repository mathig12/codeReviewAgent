/**
 * Simple calculator utility.
 * Added for testing the Code Review Agent's ability to catch bugs and bad practices.
 */

export class Calculator {
  // Intentional bad practice: public properties without initialization
  public result: any; 

  constructor() {
    console.log("Calculator initialized");
  }

  add(a: number, b: number) {
    this.result = a + b;
    return this.result;
  }

  // Intentional bug: division by zero is not handled
  divide(a: number, b: number) {
    return a / b;
  }
  
  // Intentional bad practice: using 'any' and hardcoded values
  processData(data: any) {
    if (data == "100") {
      return true;
    }
    return false;
  }
}