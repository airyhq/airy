import React, {useState} from 'react';
import styles from './TwilioSmsConnected.module.scss';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as FilterIcon} from 'assets/images/icons/filter-alt.svg';
import {SearchField} from '@airyhq/components';
import {CHANNELS_ROUTE} from '../../../../routes/routes';

interface TwilioSmsProps {
  channelId?: string;
}

const TwilioSmsConnected = (props: RouteComponentProps<TwilioSmsProps>) => {
  const [isShowingSearchChannelInput, setIsShowingSearchChannelInput] = useState(false);
  const [searchChannel, setSearchChannel] = useState('');

  const onClickSearch = () => {
    setIsShowingSearchChannelInput(!isShowingSearchChannelInput);
  };

  const onClickBack = () => {
    setIsShowingSearchChannelInput(!isShowingSearchChannelInput);
    setSearchChannel('');
  };

  const setValue = (value: string) => {
    setSearchChannel(value);
  };

  const renderSearchChannelInput = isShowingSearchChannelInput ? (
    <div className={styles.containerChannelSearchField}>
      <button type="button" className={styles.backButton} onClick={onClickBack}>
        <BackIcon className={styles.backIcon} />
      </button>
      <div className={styles.channelSearchFieldWidth}>
        <SearchField
          placeholder="Search"
          value={searchChannel}
          setValue={setValue}
          resetClicked={onClickSearch}
          autoFocus={true}
        />
      </div>
    </div>
  ) : (
    <div className={styles.containerChannelSearchHeadline}>
      <div className={styles.searchBox}>
        <button type="button" className={styles.searchButton} onClick={onClickSearch}>
          <SearchIcon className={styles.searchIcon} title="Search" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>SMS</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backChannelButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>

      <div className={styles.containerFilterAndSearchChannel}>
        <div className={styles.containerFilter}>
          <button type="button" className={styles.searchButton} onClick={onClickSearch} disabled={true}>
            <FilterIcon className={styles.searchIcon} title="Filter" />
          </button>
        </div>
        {renderSearchChannelInput}
      </div>
    </div>
  );
};

export default withRouter(TwilioSmsConnected);
