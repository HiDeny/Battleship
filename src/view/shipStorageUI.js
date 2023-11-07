/* eslint-disable no-param-reassign */

import { handleDragStart, handleDragEnd, getFields } from './drag-and-drop';

const handleClickShipRotate = (event) => {
  const { direction, row, column, length } = event.target.dataset;
  const isVertical = direction === 'vertical';
  const newDir = isVertical ? 'horizontal' : 'vertical';

  const fieldsToPopulate = getFields(row, column, length, newDir);
  const fieldsToPopulateCore = fieldsToPopulate.coreFields;
  const fieldsToPopulateOffset = fieldsToPopulate.offsetFields;

  const fieldsToClear = getFields(row, column, length, direction);
  const fieldsToClearCore = fieldsToClear.coreFields;
  const fieldsToClearOffset = fieldsToClear.offsetFields;

  let allAvailable = true;

  if (
    fieldsToPopulateCore.length === Number(length) &&
    !fieldsToPopulateCore.includes(null)
  ) {
    fieldsToClearCore.forEach((div) => {
      div.dataset.ship = 'false';
    });

    fieldsToPopulateCore.forEach((div) => {
      if (!div || div.dataset.ship === 'true') allAvailable = false;
    });

    fieldsToPopulateOffset.forEach((div) => {
      if (!div) return;
      if (div.dataset.ship === 'true') allAvailable = false;
    });

    if (allAvailable) {
      event.target.dataset.direction = newDir;

      fieldsToClearCore.forEach((div) => {
        div.dataset.ship = 'false';
      });
      fieldsToClearOffset.forEach((div) => {
        if (!div) return;
        div.dataset.offset = 'false';
      });

      fieldsToPopulateCore.forEach((div) => {
        div.dataset.ship = 'true';
      });
      fieldsToPopulateOffset.forEach((div) => {
        if (!div) return;
        div.dataset.offset = 'true';
      });
    } else {
      fieldsToClearCore.forEach((div) => {
        div.dataset.ship = 'true';
      });
      event.target.classList.add('no-rotate');

      setTimeout(() => {
        event.target.classList.remove('no-rotate');
      }, 700);
    }
  } else {
    event.target.classList.add('no-rotate');
    setTimeout(() => {
      event.target.classList.remove('no-rotate');
    }, 700);
  }
};

const renderShip = (newShip) => {
  const shipContainer = document.createElement('div');
  const { length, type } = newShip;
  const dir = Math.random() < 0.5 ? 'vertical' : 'horizontal';

  shipContainer.classList.add('ship');
  shipContainer.classList.add(`${type}`);
  shipContainer.dataset.length = length;
  shipContainer.dataset.direction = dir;
  shipContainer.dataset.row = null;
  shipContainer.dataset.column = null;

  shipContainer.draggable = true;
  shipContainer.addEventListener('dragstart', handleDragStart);
  shipContainer.addEventListener('dragend', handleDragEnd);
  shipContainer.addEventListener('click', handleClickShipRotate);

  for (let i = 0; i < length; i += 1) {
    const shipBlock = document.createElement('div');
    shipBlock.dataset.number = i;
    shipBlock.classList.add('ship-block');
    shipContainer.append(shipBlock);
  }

  return shipContainer;
};

const renderShipStorage = (shipStorage, boardUI) => {
  Object.keys(shipStorage).forEach((shipType) => {
    const newShip = renderShip(shipStorage[shipType]);
    const { length, direction } = newShip.dataset;

    let newRow;
    let newColumn;
    let newPosition;
    let keepGoing = true;

    while (keepGoing) {
      newRow = Math.floor(Math.random() * 10);
      newColumn = Math.floor(Math.random() * 10);

      while (newRow + (length - 1) > 9 || newColumn + (length - 1) > 9) {
        newRow = Math.floor(Math.random() * 10);
        newColumn = Math.floor(Math.random() * 10);
      }

      newPosition = getFields(newRow, newColumn, length, direction, boardUI);
      const { coreFields, offsetFields } = newPosition;

      if (coreFields.length === Number(length) && !coreFields.includes(null)) {
        keepGoing = false;

        // eslint-disable-next-line no-loop-func
        coreFields.forEach((div) => {
          const { ship, offset } = div.dataset;
          if (ship === 'true' || offset === 'true') keepGoing = true;
        });

        // eslint-disable-next-line no-loop-func
        offsetFields.forEach((div) => {
          if (!div) return;
          if (div.dataset.ship === 'true') keepGoing = true;
        });
      }
    }

    const { coreFields, offsetFields } = newPosition;
    newShip.dataset.row = newRow;
    newShip.dataset.column = newColumn;

    const baseField = coreFields.find(
      (div) =>
        Number(div.dataset.row) === newRow &&
        Number(div.dataset.column) === newColumn
    );
    baseField.append(newShip);

    coreFields.forEach((div) => {
      div.dataset.ship = 'true';
    });

    offsetFields.forEach((div) => {
      if (!div) return;
      div.dataset.offset = 'true';
    });
  });
};

export default renderShipStorage;