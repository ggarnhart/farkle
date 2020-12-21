function calculateScore(dice) {
  let diceAmount = dice.length;

  switch (diceAmount) {
    case 1:
      return calculateOnesAndFives(dice);

    case 2:
      return calculateOnesAndFives(dice);

    case 3:
      if (allTheSame(dice)) {
        // right now, assuming the 1000 for 3 ones isn't a thing.
        return 100 * dice[0];
      } else {
        return calculateOnesAndFives(dice);
      }
    case 4:
      if (allTheSame(dice)) {
        return 1000;
      } else {
        return 0;
      }
    // do something else
    case 5:
      if (allTheSame(dice)) {
        return 2000;
      } else {
        return 0;
      }
    case 6:
      if (allTheSame(dice)) {
        return 3000;
      } else if (isStraight(dice)) {
        return 1500;
      } else if (isThreePairs(dice)) {
        return 1500;
      } else if (isFourOfAKindPlusAPair(dice)) {
        return 1500;
      } else if (isTwoTriplets(dice)) {
        return 2500;
      } else {
        return 0;
      }
    default:
      return 0;
  }

  return 0;
}

const calculateOnesAndFives = (arr) => {
  let score = 0;
  let b = true;
  arr.forEach((element) => {
    if (element === 1) {
      score = score + 100;
    } else if (element === 5) {
      score = score + 50;
    } else {
      b = false;
    }
  });
  if (b === false) {
    return 0;
  } else {
    return score;
  }
};

const allTheSame = (arr) => {
  const allEqualValue = (arr) => arr.every((v) => v === arr[0]);
  const res = allEqualValue(arr);
  return res;
};

const isStraight = (arr) => {
  let valueArr = [1, 2, 3, 4, 5, 6];
  arr.forEach((elem) => {
    if (valueArr.includes(elem)) {
      valueArr[elem - 1] = 0;
    }
  });
  return allTheSame(valueArr); // isStraight is true if valueArr is all zeros. Use this function to check that.
};

const isFourOfAKindPlusAPair = (arr) => {
  let totals = {};
  arr.forEach((elem) => {
    if (totals.hasOwnProperty(elem)) {
      totals[elem] = totals[elem] + 1;
    } else {
      totals[elem] = 1;
    }
  });

  let keys = Object.keys(totals);
  if (keys.length !== 2) {
    return false;
  } else {
    let fourOfOne = totals[keys[0]] === 4 || totals[keys[1]] === 4;
    let twoOfOne = totals[keys[0]] === 2 || totals[keys[1]] === 2;

    return fourOfOne && twoOfOne;
  }
};

const isThreePairs = (arr) => {
  let totals = {};
  arr.forEach((elem) => {
    if (totals.hasOwnProperty(elem)) {
      totals[elem] = totals[elem] + 1;
    } else {
      totals[elem] = 1;
    }
  });

  let keys = Object.keys(totals);
  if (keys.length !== 3) {
    return false;
  } else {
    keys.forEach((key) => {
      if (totals[key] !== 2) {
        return false;
      }
    });
  }
  return true;
};

const isTwoTriplets = (arr) => {
  let totals = {};
  arr.forEach((elem) => {
    if (totals.hasOwnProperty(elem)) {
      totals[elem] = totals[elem] + 1;
    } else {
      totals[elem] = 1;
    }
  });

  let keys = Object.keys(totals);
  if (keys.length !== 2) {
    return false;
  } else {
    keys.forEach((key) => {
      if (totals[key] !== 3) {
        return false;
      }
    });
  }
  return true;
};

// const one = [1];
// console.log(`${calculateScore(one)}, expected: 100`);
// const ones = [1, 1];
// console.log(`${calculateScore(ones)}, expected: 200`);
// const oneFive = [1, 5];
// console.log(`${calculateScore(oneFive)}, expected: 150`);
// const oneFives = [1, 5, 5];
// console.log(`${calculateScore(oneFives)}, expected: 200`);
// const oneFiveTwo = [1, 5, 3];
// console.log(`${calculateScore(oneFiveTwo)}, expected: 0`);
// const threes = [3, 3, 3];
// console.log(`${calculateScore(threes)}, expected: 300`);
// const noMatch = [3, 3, 2];
// console.log(`${calculateScore(noMatch)}, expected: 0`);
const fours = [3, 3, 3, 3];
console.log(`${calculateScore(fours)}, expected: 1000`);
const foursFail = [3, 3, 3, 2];
console.log(`${calculateScore(foursFail)}, expected: 0`);
const fives = [5, 5, 5, 5, 5];
console.log(`${calculateScore(fives)}, expected: 2000`);
const fivesFail = [5, 5, 5, 5, 3];
console.log(`error expected ${calculateScore(fivesFail)}, expected: 0`);
const straight = [1, 2, 3, 4, 5, 6];
console.log(`${calculateScore(straight)}, expected: 1500`);
const straightFail = [1, 2, 4, 4, 5, 6];
console.log(`${calculateScore(straightFail)}, expected: 0`);
const threePairs = [1, 1, 2, 2, 3, 3];
console.log(`${calculateScore(threePairs)}, expected: 1500`);
const threePairsFail = [1, 1, 2, 4, 3, 3];
console.log(`${calculateScore(threePairsFail)}, expected: 0`);
const twoTriplets = [1, 1, 1, 3, 3, 3];
console.log(`${calculateScore(twoTriplets)}, expected: 2500`);
const sixOfAKind = [1, 1, 1, 1, 1, 1];
console.log(`${calculateScore(sixOfAKind)}, expected: 3000`);
const fourAndAPair = [1, 1, 1, 1, 2, 2];
console.log(`${calculateScore(fourAndAPair)}, expected: 1500`);
