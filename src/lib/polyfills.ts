import { Buffer } from 'buffer';

// Add Buffer to the global scope
window.Buffer = Buffer;

// Declare the Buffer property on the Window interface
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}