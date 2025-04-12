/**
 * Utility function to convert numbers to words in English
 * Specialized for Philippine Peso amounts
 */

import { CurrencyCode } from "@/types/numberToWords";

/**
 * Converts a number to words in English
 * @param num The number to convert
 * @returns The number in words
 */
export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    let result = '';
    
    // Handle hundreds
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    // Handle tens and ones
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      n = 0;
    }
    
    // Handle ones
    if (n > 0) {
      result += ones[n] + ' ';
    }
    
    return result.trim();
  }
  
  let result = '';
  
  // Handle billions
  if (num >= 1000000000) {
    result += convertLessThanThousand(Math.floor(num / 1000000000)) + ' Billion ';
    num %= 1000000000;
  }
  
  // Handle millions
  if (num >= 1000000) {
    result += convertLessThanThousand(Math.floor(num / 1000000)) + ' Million ';
    num %= 1000000;
  }
  
  // Handle thousands
  if (num >= 1000) {
    result += convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  
  // Handle less than thousand
  result += convertLessThanThousand(num);
  
  return result.trim();
}

/**
 * Converts an amount to currency words
 * @param amount The amount
 * @param currency The currency
 * @returns The amount in words with "Pesos" and "Centavos"
 */
export function currencyToWords(amount: number, currency: CurrencyCode = 'php'): string {
  // Split into pesos and centavos
  const whole = Math.floor(amount);
  const decimal = Math.round((amount - whole) * 100);
 
  let result = '';
  const currencyLabel = currency === 'php' ? 'Pesos' : 'Dollars';
  const centLabel = currency === 'php' ? 'Centavos' : 'Cents';
  
  if (whole > 0) {
    result += numberToWords(whole) + ` ${currencyLabel}`;
  } else {
    result += `Zero ${currencyLabel}`;
  }
  
  // Add centavos if any
  if (decimal > 0) {
    result += ' and ' + numberToWords(decimal) + ` ${centLabel}`;
  }
  
  return result;
} 

export function numberToWordsWithFraction(amount: number): string {
  const whole = Math.floor(amount);
  const decimal = Math.round((amount - whole) * 100);

  const words = numberToWords(whole);
  const fraction = decimal > 0 ? ` and ${decimal.toString().padStart(2, '0')}/100` : '';

  return `${words}${fraction}`;
}