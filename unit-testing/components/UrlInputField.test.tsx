import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {UrlInputField} from '../../lib/typescript/components/inputs/UrlInputField';

describe('UrlInputField', () => {
  test('Verifies valid URLs and adds http prefix to non-valid URLs', async () => {
    render(<UrlInputField />);

    const input = screen.getByTestId('url-input') as HTMLInputElement;
    const inputHint = screen.getByTestId('input-hint') as HTMLInputElement;

    fireEvent.change(input, {target: {value: 'airy.co'}});

    expect(screen.getByRole('textbox')).toHaveValue('airy.co');

    await fireEvent.focus(input);
    input.focus();

    expect(inputHint).toHaveTextContent('The URL is invalid');

    await fireEvent.keyDown(input, {key: 'Enter', code: 'Enter', charCode: 13});

    expect(screen.getByRole('textbox')).toHaveValue('http://airy.co');

    expect(inputHint).toBeEmptyDOMElement();
  });
});
