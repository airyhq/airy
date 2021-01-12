import React from 'react';

import './Avatar.scss';
import airyAvatarImage from '../../../../assets/images/icons/airy_avatar.svg';

type AvatarProps = {
  avatarUrl?: string;
  isLastMessage: boolean;
};

const NoAvatar = () => {
  return (
    <div className={'noAvatar'}>
      <img />
    </div>
  );
};

const Avatar = (props: AvatarProps) => {
  const {avatarUrl, isLastMessage} = props;

  if (avatarUrl && isLastMessage) {
    return (
      <div className={'avatarImage'}>
        <img src={airyAvatarImage} />
      </div>
    );
  }

  return <NoAvatar />;
};

export default Avatar;
