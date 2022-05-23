import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Toggle} from '../../lib/typescript/components/inputs/Toggle';

describe('Input toggles value', () => {
  const toggleVal = (val: boolean) => !val;

  test('toggles input checked value', async () => {
    render(<Toggle value={false} updateValue={toggleVal} />);

    const toggleInput = screen.getByRole('checkbox') as HTMLInputElement;

    expect(toggleInput.checked).toEqual(false);

    await fireEvent.change(toggleInput, {
      target: {checked: true},
    });

    expect(toggleInput.checked).toEqual(true);
  });
});
