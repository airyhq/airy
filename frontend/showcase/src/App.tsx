//@ts-nocheck
import React, { useState } from "react";
import moment from "moment";
import { BrowserRouter } from "react-router-dom";

import {
  Button,
  LinkButton,
  HrefButton,
  ErrorNotice,
  ErrorPopUp,
  SettingsModal,
  DateRange,
  Dropdown,
  Input,
  SearchField,
  TextArea,
  Toggle,
  UrlInputField,
  AiryLoader,
  AnalyticsLoader,
  SimpleLoader
} from "components";

import styles from "./index.module.scss";

const App = () => {
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [showModalPopUp, setShowModalPopUp] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dropdownOption, setDropdownOption] = useState("Dropdown");
  const [inputText, setInputText] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [toggleValue, setToggleValue] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Airy Components Library Showcase</h1>
      <div className={styles.main}>
        <h2 className={styles.sectionTitle}>Alerts</h2>
        <div className={styles.section}>
          <div className={styles.item}>
            <h3>Error PopUp</h3>
            <Button
              styleVariant="outline-big"
              type="submit"
              onClick={() => setShowErrorPopUp(true)}
            >
              Show Error PopUp
            </Button>
            {showErrorPopUp && (
              <ErrorPopUp
                message="This in an error message popup"
                closeHandler={() => setShowErrorPopUp(false)}
              />
            )}
          </div>
          <div className={styles.item}>
            <h3>Error notice warning</h3>
            <ErrorNotice theme="warning">
              This in an warning message
            </ErrorNotice>
          </div>
          <div className={styles.item}>
            <h3>Error notice error</h3>
            <ErrorNotice theme="error">This in an error message</ErrorNotice>
          </div>
          <div className={styles.item}>
            <h3>Error setting modal</h3>
            <Button
              styleVariant="outline-big"
              type="submit"
              onClick={() => setShowModalPopUp(true)}
            >
              Show Settings Modal
            </Button>
            {showModalPopUp && (
              <SettingsModal
                style={{ maxWidth: "420px" }}
                title="Settings Modal"
                close={() => setShowModalPopUp(false)}
              >
                <p>This is a modal</p>
                <p>This is a modal</p>
                <p>This is a modal</p>
              </SettingsModal>
            )}
          </div>
        </div>
        <h2 className={styles.sectionTitle}>Buttons</h2>
        <div className={styles.section}>
          <div className={styles.item}>
            <h3>Normal</h3>
            <Button
              styleVariant="normal"
              type="submit"
              onClick={() => alert("Button Pressed")}
            >
              Button
            </Button>
          </div>
          <div className={styles.item}>
            <h3>Small</h3>
            <Button
              styleVariant="small"
              type="submit"
              onClick={() => alert("Button Pressed")}
            >
              Button
            </Button>
          </div>
          <div className={styles.item}>
            <h3>Outline normal</h3>
            <Button
              styleVariant="outline"
              type="submit"
              onClick={() => alert("Button Pressed")}
            >
              Button
            </Button>
          </div>
          <div className={styles.item}>
            <h3>Outline big</h3>
            <Button
              styleVariant="outline-big"
              type="submit"
              onClick={() => alert("Button Pressed")}
            >
              Button
            </Button>
          </div>
          <div className={styles.item}>
            <h3>Warning</h3>
            <Button
              styleVariant="warning"
              type="submit"
              onClick={() => alert("Button Pressed")}
            >
              Button
            </Button>
          </div>
          <div className={styles.item}>
            <h3>Text</h3>
            <Button
              styleVariant="text"
              type="submit"
              onClick={() => alert("Button Pressed")}
            >
              Button
            </Button>
          </div>
          <div className={styles.item}>
            <h3>Link</h3>
            <LinkButton onClick={() => alert("Button Pressed")}>
              Button
            </LinkButton>
          </div>
          <div className={styles.item}>
            <h3>Href</h3>
            <BrowserRouter>
              <HrefButton href="buttonTest">Button</HrefButton>
            </BrowserRouter>
          </div>
        </div>
      </div>
      <h2 className={styles.sectionTitle}>Inputs</h2>
      <div className={styles.section}>
        <div className={styles.item}>
          <h3>Date Range</h3>
          <DateRange
            startDate={startDate}
            endDate={endDate}
            onDatesChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            minDate={moment().startOf("day")}
            maxDate={moment()
              .add(2, "y")
              .endOf("day")}
            variant="light"
            anchorDirection="right"
          />
        </div>
        <div className={styles.item}>
          <h3>Dropdown</h3>
          <Dropdown
            variant="default"
            options={[
              "Dropdown",
              "Option A",
              "Option B",
              "Option C",
              "Option D"
            ]}
            onClick={(item: string) => {
              setDropdownOption(item);
            }}
            text={dropdownOption}
          />
        </div>
        <div className={styles.item}>
          <h3>Input</h3>
          <Input
            label="Label"
            placeholder="Placeholder"
            name="newLabel"
            type="text"
            value={inputText}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setInputText(e.target.value)}
            required={true}
            height={32}
            minLength={6}
            fontClass="font-base"
          />
        </div>
        <div className={styles.item}>
          <h3>Input Secret</h3>
          <Input
            label="Label Secret"
            placeholder="Placeholder"
            name="newInputSecret"
            type="password"
            value={inputSecret}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setInputSecret(e.target.value)}
            required={true}
            height={32}
            minLength={6}
            fontClass="font-base"
          />
        </div>
        <div className={styles.item}>
          <h3>Search Field</h3>
          <SearchField
            placeholder="Search Stuff"
            value={searchValue}
            setValue={(value: string) => setSearchValue(value)}
          />
        </div>
        <div className={styles.item}>
          <h3>Text Area</h3>
          {/* <TextArea
            label="Audience"
            placeholder="Set your audience here"
            name="audience"
            minRows={2}
            maxRows={10}
            maxLength={100}
            value={textAreaValue || ''}
            onChange={e => {}}
            required={false}
            fontClass="font-base"
          /> */}
        </div>
        <div className={styles.item}>
          <h3>Toogle</h3>
          <Toggle
            text="This is a toggle"
            value={toggleValue}
            updateValue={(value: boolean) => {
              setToggleValue(value);
            }}
          />
        </div>
        <div className={styles.item}>
          <h3>URL Input</h3>
          <UrlInputField
            label="Button URL"
            fontClass="font-s"
            height={32}
            value={urlInput}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setUrlInput(e.target.value)}
          />
        </div>
      </div>
      <h2 className={styles.sectionTitle}>Loaders</h2>
      <div className={styles.section}>
        <div className={styles.item}>
          <h3>Airy Loader</h3>
          <div className={styles.loaders}>
            <AiryLoader />
          </div>
        </div>
        <div className={styles.item}>
          <h3>Airy Analytics Loader</h3>
          <AnalyticsLoader />
        </div>
        <div className={styles.item}>
          <h3>Airy Simple Loader</h3>
          <div className={styles.loaderSmall}>
            <SimpleLoader />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
