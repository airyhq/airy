import React from 'react';
import PropTypes from 'prop-types';

import './Avatar.scss';
// import {userInitials} from '../../../../services/user';

const Avatar = ({user, isMember, messageStyle}) => {
  const hideProfileImg = isMember || messageStyle === 'middle' || messageStyle === 'top';

  return user.avatar_url ? (
    <div className={`AvatarDiv ${hideProfileImg ? 'hideProfileImg' : ''}`} key={'avatar-' + user.id}>
      <div
        className={`ProfileImage ${hideProfileImg ? 'hideProfileImg' : ''} ${isMember ? 'isMember' : ''} ${
          isMember || messageStyle === 'top' ? 'top' : ''
        }`}
        style={{backgroundImage: `url(${user.avatar_url})`}}
      />
    </div>
  ) : (
    <div className={`DisplayName no-avatar ${hideProfileImg ? 'hideProfileImg' : ''}`} key={'avatar-' + user.id}>
      {/* {userInitials(user)} */}
    </div>
  );
};

Avatar.propTypes = {
  user: PropTypes.object,
};

export default Avatar;