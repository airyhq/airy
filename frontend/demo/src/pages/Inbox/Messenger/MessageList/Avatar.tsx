import React from 'react';

import './Avatar.scss';
import airyAvatarImage from '../../../../assets/images/icons/airy_avatar.svg';

type AvatarProps = {
  avatarUrl?: string;
  isLastMessage: boolean;
};

const Avatar = (props: AvatarProps) => {
  const {avatarUrl, isLastMessage} = props;

  return avatarUrl && isLastMessage ? (
    <div className={'avatarImage'}>
      <img src={airyAvatarImage} />
    </div>
  ) : (
    <div className={'noAvatar'}>
      <img />
    </div>
  );
};

export default Avatar;
