import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {UrlInputField} from '../../lib/typescript/components/inputs/UrlInputField';

test('verifies valid URLs', async () => {
  render(<UrlInputField />);

  const input = screen.getByRole('textbox') as HTMLInputElement;
  const inputHint = screen.getByTestId('input-hint') as HTMLInputElement;

  expect(inputHint).toBeEmptyDOMElement();

  fireEvent.change(input, {target: {value: 'airy.co'}});

  expect(inputHint).toHaveTextContent('invalidURL');

  fireEvent.change(input, {target: {value: 'https://airy.co'}});

  expect(inputHint).toBeEmptyDOMElement();
});
