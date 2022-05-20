import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Toggle} from '../../lib/typescript/components/inputs/Toggle';

describe('Toggle input', () => {
  test('Toggles input checked value', async () => {
    const setEnabled = (val: boolean) => {
      if (val) return false;
      if (!val) return true;
    };

    render(<Toggle value={false} updateValue={setEnabled} />);

    const toggleInput = screen.getByTestId('toggle-input') as HTMLInputElement;

    expect(toggleInput).not.toBeChecked();

    await fireEvent.change(toggleInput, {
      target: {checked: true},
    });

    expect(toggleInput.checked).toEqual(true);
  });
});
