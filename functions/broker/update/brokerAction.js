module.exports = (actions) => {
  let currentStreak = 1;
  let previousStreak = 1;
  let lastAction;

  let currentActionIndex;

  for (let i = actions.length - 1; i >= 0; i--) {
    const action = actions[i];
    if (action === 'NONE') {
      currentStreak++;
    } else {
      lastAction = action;
      currentActionIndex = i;
      break;
    }
  }

  for (let i = currentActionIndex - 1; i >= 0; i--) {
    const action = actions[i];
    if (action === 'NONE') {
      if (i === 0) {
        previousStreak = 1;
        break;
      }
      previousStreak++;
    } else {
      break;
    }
  }

  if (!lastAction) {
    lastAction = 'NONE';
    currentStreak = 1;
    previousStreak = 1;
  }

  return [lastAction, currentStreak, previousStreak];
};
