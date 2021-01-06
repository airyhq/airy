import {h} from 'preact';
import {AuthConfiguration} from '../../config';
import {RoutableProps} from 'preact-router';
import Chat from '../../components/chat';

type Props = Partial<AuthConfiguration> & RoutableProps;

export default ({channel_id}: Props) => {
  if (!channel_id) {
    return <span style={{color: 'red'}}>Widget authorization failed. Please check your installation.</span>;
  }

  return <Chat channel_id={channel_id} />;
};
