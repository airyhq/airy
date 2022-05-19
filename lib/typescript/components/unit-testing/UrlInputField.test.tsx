import * as React from 'react'
import { render, screen, fireEvent} from "@testing-library/react";
import {UrlInputField} from "../inputs/UrlInputField";
import userEvent from '@testing-library/user-event';

describe("UrlInputField", () => {
  test("Adds http prefix to non-valid URL", async () => {
   render(<UrlInputField />);
 
    const inputEl = screen.getByTestId("url-input") as HTMLInputElement;
    const labelEl = screen.getByTestId("input-label") as HTMLInputElement;
    //userEvent.type(inputEl, "airy.core");

    fireEvent.change(inputEl, { target: { value: "airy.co" } });

   expect(screen.queryByText('The URL is invalid'))

  //fireEvent.keyDown(labelEl, {key: 'Enter', code: 'Enter', charCode: 13})

    //await expect('http://airy.core').toBeInTheDocument()
 
    //expect(screen.getByTestId("url-input").innerHTML).toBe("http://airy.core");

    //screen.getByText('http://airy.co')

  });
});