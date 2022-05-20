import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {UrlInputField} from '../inputs/UrlInputField';

describe('UrlInputField', () => {
  test('Adds http prefix to non-valid URL', async () => {
    render(<UrlInputField />);
    //screen.debug();

    const inputEl = screen.getByTestId('url-input') as HTMLInputElement;
    const labelEl = screen.getByTestId('input-label') as HTMLInputElement;
    const inputHint = screen.getByTestId('input-hint') as HTMLInputElement;
    //userEvent.type(inputEl, "airy.core");

    fireEvent.change(inputEl, {target: {value: 'airy.co'}});

    //screen.getByText('The URL is invalid')

    expect(screen.getByRole('textbox')).toHaveValue('airy.co')

    expect(inputHint).toHaveTextContent('The URL is invalid');
    
    await fireEvent.keyDown(inputEl, {key: 'Enter', code: 'Enter', charCode: 13});

    expect(screen.getByRole('textbox')).toHaveValue('http://airy.co')

    expect(inputHint).toBeEmptyDOMElement();

    //expect(inputEl).toHaveTextContent('http://airy.core');

    //await expect(screen.queryByText('http://airy.core')).toBe(true)

    //expect(screen.getByTestId("url-input").innerHTML).toBe("http://airy.core");

    //screen.getByText('http://airy.co')
  });
});
