import * as React from 'react'
import { render, screen, fireEvent} from "@testing-library/react";
import {UrlInputField} from "../inputs/UrlInputField";
import userEvent from '@testing-library/user-event';
import * as ReactDOM from 'react-dom/client';

describe("UrlInputField", () => {
  test("Adds http prefix to non-valid URL", async () => {
   render(<UrlInputField />);
 
    const inputEl = screen.getByTestId("url-input");
    userEvent.type(inputEl, "http://airy.core");
 
    expect(screen.getByTestId("url-input")).toEqual("http://airy.core");

  });
});