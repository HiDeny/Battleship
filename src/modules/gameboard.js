import PubSub from './pubsub';

const field = (coordinates) => {
  let mark = null;
  let ship = null;

  return {
    coordinates,
    get ship() {
      return ship;
    },
    set ship(newShip) {
      const { type, boat } = newShip;
      if (boat === undefined) throw new Error('Fix boat');
      ship = boat;
      PubSub.publish('field-ship', [coordinates, type]);
    },
    markField() {
      if (mark !== null) throw new Error(`Already marked!`);

      if (ship) ship.hit();
      mark = ship ? 'hit' : 'miss';

      PubSub.publish('field-mark', coordinates, mark);
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
      board[i][j] = field([i, j]);
    }
  }

  return board;
};

const createGameboard = () => {
  const board = initBoard();
  const shipsOnBoard = [];

  // const checkCoordinates = (...args) => {
  //   const [length, row, column, isVertical] = args;
  //   const dynamicDir = isVertical ? row : column;

  //   if (row > 9 || column > 9 || dynamicDir + length > 10) {
  //     throw new Error('Out of board!');
  //   }

  //   for (let i = dynamicDir; i < dynamicDir + length; i += 1) {
  //     let currentField = board[row][i];
  //     if (isVertical) currentField = board[i][column];

  //     if (currentField.ship !== null) {
  //       throw new Error('Check coordinates: Field Occupied!');
  //     }
  //   }

  //   return true;
  // };

  return {
    board,
    shipsOnBoard,
    placeShip(newShip, coordinates) {
      const { boat } = newShip;
      const row = Number(coordinates[0]);
      const column = Number(coordinates[1]);
      const isVertical = coordinates[2];
      // Dir === True  (ship will be placed vertically)
      const dynamicDir = isVertical ? row : column;

      for (let i = dynamicDir; i < dynamicDir + boat.length; i += 1) {
        const currentField = isVertical ? board[i][column] : board[row][i];
        currentField.ship = newShip;
      }
      shipsOnBoard.push(newShip);
    },
    receiveAttack(coordinates) {
      if (!shipsOnBoard.length) return false;

      const [row, column] = coordinates;
      const currentField = board[row][column];
      const markField = currentField.markField();

      return markField;
    },
    activeShips() {
      let livingShips = shipsOnBoard.length;

      shipsOnBoard.forEach((completeShip) => {
        livingShips -= completeShip.boat.isSunk() ? 1 : 0;
      });

      return livingShips;
    },
  };
};

export default createGameboard;
