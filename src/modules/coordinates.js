export const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomColumn = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;

  return [randomRow, randomColumn, isVertical];
};

const getFields = (coordinates, isVertical, board) => {
  const [row, column] = coordinates;
  const dynamicDir = isVertical ? Number(column) : Number(row);
  const insideBoardUp = dynamicDir + 1 <= 9;
  const insideBoardDown = dynamicDir - 1 >= 0;

  const [upRow, upCol] = isVertical ? [row, column + 1] : [row + 1, column];
  const [downRow, downCol] = isVertical ? [row, column - 1] : [row - 1, column];

  const base = board[row][column];
  const up = insideBoardUp ? board[upRow][upCol] : false;
  const down = insideBoardDown ? board[downRow][downCol] : false;

  return { base, up, down };
};

const isOccupiedField = (field) => (field ? field.ship !== null : false);

const checkOutOfBoard = (coordinates, shipLength) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? Number(row) : Number(column);

  return row > 9 || column > 9 || dynamicDir + shipLength - 1 > 9;
};

const checkOffset = (coordinates, shipLength, board) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? Number(row) : Number(column);

  const oneBefore = dynamicDir - 1;
  if (oneBefore > -1) {
    const coordToCheck = isVertical ? [oneBefore, column] : [row, oneBefore];
    const { base, up, down } = getFields(coordToCheck, isVertical, board);

    if (isOccupiedField(base)) return true;
    if (isOccupiedField(up)) return true;
    if (isOccupiedField(down)) return true;
  }

  const oneAfter = dynamicDir + shipLength;
  if (oneAfter < 10) {
    const coordToCheck = isVertical ? [oneAfter, column] : [row, oneAfter];
    const { base, up, down } = getFields(coordToCheck, isVertical, board);

    if (isOccupiedField(base)) return true;
    if (isOccupiedField(up)) return true;
    if (isOccupiedField(down)) return true;
  }

  return false;
};

const checkFields = (coordinates, shipLength, board) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? Number(row) : Number(column);

  for (let i = dynamicDir; i < dynamicDir + shipLength; i += 1) {
    const coordToCheck = isVertical ? [i, column] : [row, i];
    const { base, up, down } = getFields(coordToCheck, isVertical, board);

    if (isOccupiedField(base) || base.offset === true) return true;
    if (isOccupiedField(up)) return true;
    if (isOccupiedField(down)) return true;
  }

  return false;
};

export const checkShipCoordinates = (toCheck) => {
  const { coordinates, board, shipLength } = toCheck;

  if (checkOutOfBoard(coordinates, shipLength)) return false;
  if (checkOffset(coordinates, shipLength, board)) return false;
  if (checkFields(coordinates, shipLength, board)) return false;

  return true;
};

export const possibleShots = (coordinates) => ({
  down: [coordinates[0] - 1, coordinates[1]],
  left: [coordinates[0], coordinates[1] - 1],
  up: [coordinates[0] + 1, coordinates[1]],
  right: [coordinates[0], coordinates[1] + 1],
});

export const checkNextShot = (markedFields, nextMark) => {
  const [markX, markY] = nextMark;
  const nextMarkStr = `${markX},${markY}`;

  const isInsideX = markX >= 0 && markX <= 9;
  const isInsideY = markY >= 0 && markY <= 9;
  const isInside = isInsideX && isInsideY;

  const alreadyMarked = markedFields.has(nextMarkStr);

  return !alreadyMarked && isInside;
};

export const getRandomNextShot = (markedFields) => {
  let randomShot = getRandomCoordinates();
  while (!checkNextShot(markedFields, randomShot)) {
    randomShot = getRandomCoordinates();
  }
  return randomShot;
};
