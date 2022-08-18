function numberFormat(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const numberToKorean = (number: string) => {
  let inputNumber = Number(number) < 0 ? false : Number(number);
  let unitWords = ["", "만", "억", "조", "경"];
  let splitUnit = 10000;
  let splitCount = unitWords.length;
  let resultArray = [];
  let resultString = "";

  for (let i = 0; i < splitCount; i++) {
    let unitResult: any;
    if (inputNumber) {
      unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        resultArray[i] = unitResult;
      }
    }
  }

  for (let j = 0; j < resultArray.length; j++) {
    if (!resultArray[j]) continue;
    resultString = String(numberFormat(resultArray[j])) + unitWords[j] + resultString;
  }
  if (resultString) {
    return resultString + "원";
  } else {
    return "0원";
  }
};

const priceRegex = /\B(?=(\d{3})+(?!\d))/g;

const converterPrice = (price: string): string => {
  const result = price.replace(priceRegex, ",");
  return result;
};

const calculationDiscount = (price: number, discount: number): number => {
  return Math.floor(price - (price *= discount / 100));
};

const priceUtil = {
  converterPrice,
  numberToKorean,
  priceRegex,
  numberFormat,
  calculationDiscount,
};

export default priceUtil;
