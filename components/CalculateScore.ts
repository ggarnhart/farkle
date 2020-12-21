import { Die } from "./GameSpace";
import { useMap } from "@roomservice/react"; // check game meta data

// only passing in the score might be convenient here.
// it doesn't correspond to the specific die in the id, but idk if we need that.
export default function calculateScore(dice: number[]): number {
  let diceAmount: number = dice.length;

  switch (diceAmount) {
    case 1:
      return calculateOnesAndFives(dice);

    case 2:
      return calculateOnesAndFives(dice);

    case 3:
      if (allTheSame(dice)) {
        // right now, assuming the 1000 for 3 ones isn't a thing.
        if (dice[0] === 1) {
          return 300;
        } else {
          return 100 * dice[0];
        }
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
  }

  return 0;
}

const calculateOnesAndFives = (arr: number[]) => {
  let score = 0;
  let err: boolean = false;
  arr.forEach((element) => {
    if (element === 1) {
      score = score + 100;
    } else if (element === 5) {
      score = score + 50;
    } else {
      err = true;
    }
  });
  if (err) {
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

const isStraight = (arr: number[]) => {
  let valueArr = [1, 2, 3, 4, 5, 6];
  arr.forEach((elem) => {
    if (valueArr.includes(elem)) {
      valueArr[elem - 1] = 0;
    }
  });
  return allTheSame(valueArr); // isStraight is true if valueArr is all zeros. Use this function to check that.
};

const isFourOfAKindPlusAPair = (arr: number[]) => {
  let totals = {};
  arr.forEach((elem) => {
    if (totals.hasOwnProperty(elem)) {
      totals[elem] = totals[elem] + 1;
    } else {
      totals[elem] = 1;
    }
  });

  let keys: string[] = Object.keys(totals);
  if (keys.length !== 2) {
    return false;
  } else {
    let fourOfOne: boolean = totals[keys[0]] === 4 || totals[keys[1]] === 4;
    let twoOfOne: boolean = totals[keys[0]] === 2 || totals[keys[1]] === 2;

    return fourOfOne && twoOfOne;
  }
};

const isThreePairs = (arr: number[]) => {
  let totals = {};
  arr.forEach((elem) => {
    if (totals.hasOwnProperty(elem)) {
      totals[elem] = totals[elem] + 1;
    } else {
      totals[elem] = 1;
    }
  });

  let keys: string[] = Object.keys(totals);
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

const isTwoTriplets = (arr: number[]) => {
  let totals = {};
  arr.forEach((elem) => {
    if (totals.hasOwnProperty(elem)) {
      totals[elem] = totals[elem] + 1;
    } else {
      totals[elem] = 1;
    }
  });

  let keys: string[] = Object.keys(totals);
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
