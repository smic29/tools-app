import { MAX_VALUE } from "@/constants/numbersToWords";
import { currencyToWords, numberToWordsWithFraction } from "@/utils/numberToWords";
import { useState } from "react";


const useNumberToWords = () => {
  const [number, setNumber] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('default');

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value == "" || value === null) {
      setNumber(null);
      return
    }

    const parsedValue = parseFloat(value);
    if (parsedValue > MAX_VALUE) return

    setNumber(parsedValue);
  };

  const handleCurrencyChange = (value: string) => {
    console.log("the onChange function was called")
    setCurrency(value);
  };

  let convertedValue
  if (number) {
    switch (currency) {
      case 'php':
        convertedValue = currencyToWords(number, currency);
        break;
      case 'usd':
        convertedValue = currencyToWords(number, currency);
        break;
      default:
        convertedValue = numberToWordsWithFraction(number);
        break;
    }
  }

  return {
    number,
    handleNumberChange,
    convertedValue,
    currency,
    handleCurrencyChange,
  }

}

export default useNumberToWords