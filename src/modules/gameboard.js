const field = (coordinates) => {
  let mark = null;
  let ship = null;

  return {
    coordinates,
    get ship() {
      return ship;
    },
    set ship(newShip) {
      if (ship) throw new Error('Ship already set!');
      ship = newShip;
    },
    markField() {
      if (mark !== null) throw new Error(`Already marked!`);

      if (ship) ship.hit();
      mark = ship ? 'hit' : 'miss';

      return mark;
    },
    get mark() {
      return mark;
    },
  };
};

const initBoard = () => {
  const board = [];
  const rows = 10;
  const columns = 10;

  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < columns; j += 1) {
      board[i][j] = field(`X:${i}, Y:${j}`);
    }
  }

  return board;
};

const createGameboard = () => {
  const board = initBoard();
  const shipsOnBoard = [];

  const checkCoordinates = (length, dynamicDir, fixedDir, isVertical) => {
    if (dynamicDir + length > 9 || fixedDir > 9) {
      throw new Error('Out of board!');
    }

    for (let i = dynamicDir; i < dynamicDir + length; i += 1) {
      const currentField = isVertical ? board[i][fixedDir] : board[fixedDir][i];

      if (currentField.ship) {
        throw new Error('Check coordinates: Field Occupied!');
      }
    }

    return true;
  };

  return {
    board,
    placeShip(newShip, coordinates) {
      const [row, column, isVertical] = coordinates;

      // Dir === True  (ship will be placed vertically)
      const dynamicDir = isVertical ? row : column;
      const fixedDir = isVertical ? column : row;

      checkCoordinates(newShip.length, dynamicDir, fixedDir, isVertical);

      for (let i = dynamicDir; i < dynamicDir + newShip.length; i += 1) {
        const currentField = isVertical
          ? board[i][fixedDir]
          : board[fixedDir][i];
        currentField.ship = newShip;
      }
      shipsOnBoard.push(newShip);

      return `Start: X:${row}, Y:${column} End: X:${row}, Y:${
        column + (newShip.length - 1)
      }`;
    },
    receiveAttack(coordinates) {
      if (!shipsOnBoard.length) return 'No ships on board';

      const [row, column] = coordinates;
      const currentField = board[row][column];
      const markField = currentField.markField();

      return markField;
    },
    activeShips() {
      if (!shipsOnBoard.length) return false;
      let livingShips = 0;

      shipsOnBoard.forEach((ship) => {
        livingShips += ship.health > 0 ? 1 : 0;
      });

      return !!livingShips;
    },
    shipsOnBoard,
  };
};

export default createGameboard;